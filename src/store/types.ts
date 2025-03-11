import { SharedCategory } from '@/types/common';

// export interface KnowledgeItem {
//     id: string;
//     question: string;
//     answer: string;
// }

export interface InterviewQuestion {
    id: string;
    question: string;
    answer: string;
}

export interface InterviewState {
    questions: SharedCategory[];
    knowledge: SharedCategory[];
    loading: boolean;
    error: string | null;
}

export interface RootState {
    interview: InterviewState;
}