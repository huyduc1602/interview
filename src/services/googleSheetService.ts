import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiResponse, SheetData, Category, QuestionItem } from './googleSheetService.d';
import { getApiKey } from '@/utils/apiKeys';
import { SharedItem, User } from '@/types/common';
import { ApiKeyService } from '@/hooks/useApiKeys';
import { generateId } from '@/utils/supabaseUtils';

// Define the Google Sheets API response interface
interface GoogleSheetValuesResponse {
    range: string;
    majorDimension: string;
    values: string[][];
}

interface GoogleSheetConfig {
    params: { key: string }
}

// Cache the current fetch operation's promise
let currentFetchPromise: Promise<ApiResponse<SheetData>> | null = null;
let isFetching = false;

// Improved function with retry logic
async function fetchWithRetry<T>(url: string, config: GoogleSheetConfig, retries = 3, delay = 1000): Promise<AxiosResponse<T>> {
    try {
        return await axios.get<T>(url, {
            ...config,
            timeout: 10000 // 10 second timeout
        });
    } catch (error) {
        if (retries <= 0) throw error;

        // Check if we should retry based on error type
        const shouldRetry = axios.isAxiosError(error) &&
            (error.code === 'ECONNABORTED' || // timeout
                error.response?.status === 429 || // rate limit
                error.response?.status === 500 || // server error
                error.response?.status === 503);  // service unavailable

        if (!shouldRetry) throw error;

        // Exponential backoff with jitter
        const backoffDelay = delay * (1 + 0.2 * Math.random());
        console.info(`Retrying request to ${url} after ${Math.round(backoffDelay)}ms, ${retries} retries left`);

        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return fetchWithRetry<T>(url, config, retries - 1, delay * 2);
    }
}

export const fetchGoogleSheetData = async (_apiKey: string, _spreadsheetId: string, user: User | null): Promise<ApiResponse<SheetData>> => {
    // If a fetch is already in progress, wait for and return its result
    if (isFetching && currentFetchPromise) {
        console.warn('A fetch is already in progress, waiting for its result...');
        return currentFetchPromise;
    }

    if (!user) {
        return {
            success: false,
            error: 'User not authenticated'
        };
    }

    // Set the semaphore flag and create a new promise
    isFetching = true;

    const fetchOperation = async (): Promise<ApiResponse<SheetData>> => {
        try {
            // Validate API keys before making any requests
            const API_KEY = getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY, user.id);
            const SPREADSHEET_ID = getApiKey(ApiKeyService.SPREADSHEET_ID, user.id);

            if (!API_KEY) {
                return {
                    success: false,
                    error: 'Missing Google Sheets API key. Please add your API key in settings.'
                };
            }

            if (!SPREADSHEET_ID) {
                return {
                    success: false,
                    error: 'Missing Spreadsheet ID. Please add your spreadsheet ID in settings.'
                };
            }

            const SHEET_KNOWLEDGE = getApiKey(ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE, user.id) || "Danh mục kiến thức";
            const SHEET_QUESTIONS = getApiKey(ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS, user.id) || "Câu hỏi phỏng vấn";

            // Fetch knowledge data with retry - now with proper typing
            const knowledgeResponse = await fetchWithRetry<GoogleSheetValuesResponse>(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_KNOWLEDGE)}`,
                {
                    params: {
                        key: API_KEY
                    }
                }
            );

            if (!knowledgeResponse.data.values) {
                return {
                    success: false,
                    error: `No data found in sheet "${SHEET_KNOWLEDGE}". Please check sheet structure.`
                };
            }

            interface Row extends Array<string> {
                [index: number]: string;
            }
            const rows: Row[] = knowledgeResponse.data.values.slice(1); // Skip header row
            if (!rows[1]) return {
                success: false,
                error: 'No "knowledge" categories found. Please check the sheet structure.'
            };;
            let currentCategory: string | null = null;
            const categorizedKnowledge: Category[] = [];
            const knowledgeItems: { [key: string]: SharedItem[] } = {};

            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const rowData = rows[rowIndex];
                // Stop processing if the question cell is empty

                if (rowData) {
                    // Skip rows without order or category
                    if (!rowData[2]) continue;
                    currentCategory = rowData[2];
                    if (!knowledgeItems[currentCategory]) knowledgeItems[currentCategory] = [];

                    knowledgeItems[currentCategory].push({
                        rowIndex: rowIndex + 2, // +2 because we skipped header and array is 0-based
                        order: Number.parseInt(rowData[0]),
                        question: rowData[1] || '',
                        notes: '',
                        status: 'Waiting',
                        id: generateId(),
                        category: currentCategory,
                        answer: null
                    });
                }
            };

            Object.keys(knowledgeItems).forEach(category => {
                categorizedKnowledge.push({
                    category,
                    items: knowledgeItems[category]
                });
            });

            // Check if we found any categories
            if (categorizedKnowledge.length === 0) {
                return {
                    success: false,
                    error: 'No "knowledge" categories found. Please check the sheet structure.'
                };
            }

            // Fetch questions with retry - now with proper typing
            const questionsResponse = await fetchWithRetry<GoogleSheetValuesResponse>(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_QUESTIONS)}`,
                {
                    params: {
                        key: API_KEY
                    }
                }
            );

            if (!questionsResponse.data.values) {
                return {
                    success: false,
                    error: `No data found in the "${SHEET_QUESTIONS}" sheet. Please check the sheet structure.`
                };
            }

            const questionRows = questionsResponse.data.values.slice(1);
            let currentQuestionCategory: string | null = null;
            const categorizedQuestions: Category[] = [];
            const questionItems: { [key: string]: QuestionItem[] } = {};

            // First pass: collect categories and questions
            interface QuestionRow extends Array<string> {
                [index: number]: string;
            }

            questionRows.forEach((row: QuestionRow, index: number): void => {
                // If first element has value, it's a new category
                if (row[1]) {
                    currentQuestionCategory = row[1];
                    if (!questionItems[currentQuestionCategory]) {
                        questionItems[currentQuestionCategory] = [];
                    }
                }

                // If row has a question (second element) and category is defined
                if (row[0] && currentQuestionCategory) {
                    questionItems[currentQuestionCategory].push({
                        rowIndex: index + 2,
                        question: row[0],
                        answer: '',
                        category: currentQuestionCategory
                    });
                }
            });

            // Check if we found any categories
            if (Object.keys(questionItems).length === 0) {
                return {
                    success: false,
                    error: 'No question categories found. Please check the google sheet structure.'
                };
            }

            // Fetch category answers - now with proper typing
            const categoryErrors: string[] = [];
            for (const category of Object.keys(questionItems)) {
                try {
                    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(category)}`;
                    const answersResponse = await fetchWithRetry<GoogleSheetValuesResponse>(sheetUrl, {
                        params: {
                            key: API_KEY
                        }
                    });
                    const answers = answersResponse.data.values || [];

                    // Update questions with answers
                    questionItems[category] = questionItems[category].map((item, index) => ({
                        ...item,
                        answer: answers[index] ? answers[index][0] : ''
                    }));
                } catch (error) {
                    console.warn(`Failed to fetch answers for category ${category}:`, error);
                    categoryErrors.push(category);
                    // Continue with next category instead of returning immediately
                }
            }

            // Convert to array format
            Object.keys(questionItems).forEach(category => {
                categorizedQuestions.push({
                    category,
                    items: questionItems[category]
                });
            });

            return {
                success: true,
                data: {
                    knowledge: categorizedKnowledge,
                    questions: categorizedQuestions
                },
                warnings: categoryErrors.length > 0 ?
                    `Không thể tải câu trả lời cho danh mục: ${categoryErrors.join(', ')}` :
                    undefined
            };
        } catch (error) {
            console.error('Error fetching sheet data:', error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;

                // Handle different error types with specific messages
                if (axiosError.code === 'ECONNABORTED') {
                    return {
                        success: false,
                        error: 'Kết nối tới Google Sheets API đã hết thời gian chờ. Vui lòng kiểm tra kết nối mạng và thử lại.'
                    };
                }

                if (axiosError.response) {
                    switch (axiosError.response.status) {
                        case 400:
                            return {
                                success: false,
                                error: 'Invalid request. Please check your API configuration.'
                            };
                        case 401:
                        case 403:
                            return {
                                success: false,
                                error: 'Authentication error. The API key may be invalid or expired.'
                            };
                        case 404:
                            return {
                                success: false,
                                error: 'Resource not found. Please check the spreadsheet ID.'
                            };
                        case 429:
                            return {
                                success: false,
                                error: 'API request limit exceeded. Please try again later.'
                            };
                        default:
                            return {
                                success: false,
                                error: `API error (${axiosError.response.status}): ${(axiosError.response.data as { error?: { message?: string } })?.error?.message || axiosError.message}`
                            };
                    }
                }

                return {
                    success: false,
                    error: `Connection error: ${axiosError.message}`
                };
            }

            return {
                success: false,
                error: error instanceof Error ? `Unknown error: ${error.message}` : 'An error occurred while loading data'
            };
        } finally {
            // Reset the semaphore and cached promise when done
            isFetching = false;
            currentFetchPromise = null;
        }
    };

    // Store the promise for potential reuse
    currentFetchPromise = fetchOperation();
    return currentFetchPromise;
};

export const updateKnowledgeStatus = async (rowIndex: number, status: string, user: User | null): Promise<boolean> => {
    // Existing code unchanged
    if (!user) {
        throw new Error('User not authenticated');
    }

    const API_KEY = getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY, user.id);
    const SPREADSHEET_ID = getApiKey(ApiKeyService.SPREADSHEET_ID, user.id);
    const SHEET_KNOWLEDGE = getApiKey(ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE, user.id) || "Danh mục kiến thức";
    try {
        const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_KNOWLEDGE)}!C${rowIndex}`;

        await axios.put(updateUrl,
            { values: [[status]] },
            {
                params: {
                    key: API_KEY,
                    valueInputOption: 'RAW'
                }
            }
        );

        return true;
    } catch (error) {
        console.error('Failed to update status:', error);
        return false;
    }
};