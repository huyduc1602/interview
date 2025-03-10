import { BaseItem } from './common';

export interface KnowledgeItem extends BaseItem {
    category: string;
    question: string;
    answer: string | null;
}

export interface SavedItem {
    id: string;
    type: 'knowledge';
    category?: string;
    question: string;
    answer: string;
    model: string;
    timestamp?: number;
}

export interface KnowledgeCategory {
    category: string;
    items: KnowledgeItem[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isError?: boolean;
}

export interface ChatHistory {
    [key: string]: ChatMessage[];
}

export interface ExpandedCategories {
    [key: number]: boolean;
}