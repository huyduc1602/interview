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
    items: SharedItem[];
}

export interface SharedCategoryShuffled {
    category: string;
    question: string;
    answer?: string | null;
    orderNumber?: number;
    rowIndex?: number;
    type?: string;
}

export interface SharedItem extends BaseItem {
    category: string;
    question: string;
    answer: string | null;
    order? : number;
}