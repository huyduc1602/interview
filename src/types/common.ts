import { InterviewQuestion } from './interview';
import { KnowledgeItem } from './knowledge';
export interface BaseItem {
    id?: string;
    category?: string;
    model?: string;
    type?: 'knowledge' | 'interview';
    timestamp?: number;
}

export interface SavedItem {
    id: string;
    timestamp: number;
    followUpQuestions?: { question: string; answer: string; timestamp: number }[];
    type: string;
    category: string;
    question: string;
    answer: string;
    model: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface SharedCategory {
    category: string;
    items: KnowledgeItem[] | InterviewQuestion[];
}

export interface SharedCategoryShuffled {
    category: string;
    question: string;
    answer?: string | null;
    orderNumber?: number;
    rowIndex?: number;
}