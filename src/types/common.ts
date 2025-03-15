export interface BaseItem {
    id?: string;
    category?: string;
    model?: string;
    type?: 'knowledge' | 'interview';
    timestamp?: number;
}

export interface SavedItem {
    id: string;
    user_id: string;
    followUpQuestions?: { question: string; answer: string; timestamp: number }[];
    category: string;
    question: string;
    answer: string;
    model: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    isGoogle?: boolean;
    preferredLanguage?: string;
    [key: string]: unknown;
}

export interface ExpandedCategories {
    [key: number]: boolean;
}

export interface SharedCategory {
    category: string;
    items: SharedItem[];
}

export interface SharedCategoryShuffled {
    id: string;
    category: string;
    question: string;
    answer?: string | null;
    orderNumber?: number;
    rowIndex?: number;
    type?: string;
}

export interface SharedItem extends BaseItem {
    id: string;
    category: string;
    question: string;
    answer: string | null;
    order?: number;
    rowIndex: number;
    status: string
    notes: string
}

export enum ItemTypeSaved {
    KnowledgeAnswers = 'knowledge_answers',
    InterviewAnswers = 'interview_answers'
}

export type FollowUpQuestion = {
    itemId: string;
    question: string;
    answer: string
}

export interface ResponseAnswer {
    id: string;
    user_id: string;
    category?: string;
    question: string;
    answer: string;
    created_at: string;
    model: string
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isError?: boolean;
}

export interface ChatHistoryItem {
    id: string;
    answer_id: string;
    user_id: string;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
}

export interface ErrorAuthCallback {
    __isAuthError: boolean,
    name: string,
    originalError: object
}