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
    created_at: string;
    followUpQuestions?: { question: string; answer: string; timestamp: number }[];
    category: string;
    question: string;
    answer: string;
    model: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown;
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
    order? : number;
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