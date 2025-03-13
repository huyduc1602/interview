export interface QuestionItem {
    rowIndex: number;
    question: string;
    answer: string;
    category: string;
}

export interface Category {
    category: string;
    items: SharedItem[] | QuestionItem[];
}

export interface SheetData {
    knowledge: Category[];
    questions: Category[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    warnings?: string;
}

export function fetchGoogleSheetData(): Promise<ApiResponse<SheetData>>;
// eslint-disable-next-line no-unused-vars
export function updateKnowledgeStatus(rowIndex: number, status: string): Promise<boolean>;