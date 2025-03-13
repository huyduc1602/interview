import { BaseItem } from './common';

export interface KnowledgeItem extends BaseItem {
    answer?: string;
    content: string;
    notes: string;
    order: string;
    rowIndex: number;
    status: boolean;
    category: string;
}

export interface SavedItemKnowledge {
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

export interface ExpandedCategories {
    [key: number]: boolean;
}