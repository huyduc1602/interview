export interface KnowledgeItem {
    rowIndex: number;
    content: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface QuestionItem {
    question: string;
    category: string;
}

export interface KnowledgeCategory {
    category: string;
    items: KnowledgeItem[];
}

export interface QuestionCategory {
    category: string;
    items: QuestionItem[];
}

export interface CachedAnswers {
    [language: string]: {
        questions: { [id: string]: string };
        knowledge: { [id: string]: string };
    };
}

export interface InterviewState {
    knowledge: KnowledgeCategory[];
    questions: QuestionCategory[];
    answers: Record<string, string>;
    loading: boolean;
    error: string | null;
    cachedAnswers: CachedAnswers;
}

export interface AddItemPayload {
    type: 'knowledge' | 'question';
    category: string;
    content: string;
}

export interface SetCachedAnswerPayload {
    language: string;
    questionId: string;
    answer: string;
    type: 'questions' | 'knowledge';
}

export interface FetchAnswerPayload {
    question: string;
    answer: string;
}

export interface Category {
    category: string;
    items: unknown[];
}

export interface KnowledgeCategory2 extends Category {
    content: string;
    status: string;
    rowIndex: number;
}

export interface ActionPayload {
    rowIndex?: number;
    status?: string;
    question?: string;
    answer?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}