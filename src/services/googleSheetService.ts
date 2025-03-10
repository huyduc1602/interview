import axios from 'axios';
import type { ApiResponse, SheetData, Category, KnowledgeItem, QuestionItem } from './googleSheetService.d';
import { getApiKey } from '@/utils/apiKeys';
import { User } from '@/types/common';

export const fetchGoogleSheetData = async (_apiKey: string, _spreadsheetId: string,user: User | null): Promise<ApiResponse<SheetData>> => {
    if (!user) {
        throw new Error('User not authenticated');
    }
    const API_KEY = getApiKey('google_sheet', user.id);
    const SPREADSHEET_ID = getApiKey('spreadsheet_id', user.id);
    const SHEET_KNOWLEDGE = "Danh mục kiến thức";
    const SHEET_QUESTIONS = "Câu hỏi phỏng vấn";
    
    try {
        // Fetch knowledge data
        const knowledgeResponse = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_KNOWLEDGE)}`,
            {
                params: {
                    key: API_KEY
                }
            }
        );

        const rows = knowledgeResponse.data.values.slice(1); // Skip header row
        let currentCategory: string | null = null;
        const categorizedKnowledge: Category[] = [];
        const knowledgeItems: { [key: string]: KnowledgeItem[] } = {};

        interface Row extends Array<string> {
            [index: number]: string;
        }
        rows.forEach((row: Row, rowIndex: number): void => {
            if (!row[0] && row[1]) {
                currentCategory = row[1];
                knowledgeItems[currentCategory] = [];
            } else if (row[0] && row[1] && currentCategory) {
                knowledgeItems[currentCategory].push({
                    rowIndex: rowIndex + 2, // +2 because we skipped header and array is 0-based
                    order: row[0],
                    content: row[1],
                    status: row[2] || 'Đang đợi',
                    notes: row[3] || ''
                });
            }
        });

        Object.keys(knowledgeItems).forEach(category => {
            categorizedKnowledge.push({
                category,
                items: knowledgeItems[category]
            });
        });
        console.log('categorizedKnowledge', categorizedKnowledge);

        // Fetch questions
        const questionsResponse = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_QUESTIONS)}`,
            {
                params: {
                    key: API_KEY
                }
            }
        );
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
            if (row[0]) {
                currentQuestionCategory = row[0];
                if (!questionItems[currentQuestionCategory]) {
                    questionItems[currentQuestionCategory] = [];
                }
            }

            // If row has a question (second element) and category is defined
            if (row[1] && currentQuestionCategory) {
                questionItems[currentQuestionCategory].push({
                    rowIndex: index + 2,
                    question: row[1],
                    answer: '',
                    category: currentQuestionCategory
                });
            }
        });

        // Fetch category answers
        for (const category of Object.keys(questionItems)) {
            try {
                const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(category)}`;
                const answersResponse = await axios.get(sheetUrl, {
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
                console.error(`Failed to fetch answers for category ${category}:`, error);
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
            }
        };
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response:', error.response?.data);
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

export const updateKnowledgeStatus = async (rowIndex: number, status: string, user: User | null): Promise<boolean> => {
    if (!user) {
        throw new Error('User not authenticated');
    }
    
    const API_KEY = getApiKey('google_sheet', user.id);
    const SPREADSHEET_ID = getApiKey('spreadsheet_id', user.id);
    const SHEET_KNOWLEDGE = "Danh mục kiến thức";
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