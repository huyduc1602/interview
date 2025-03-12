import { supabase } from '@/supabaseClient';
import { ItemTypeSaved, ResponseAnswer } from '@/types/common';
import { v4 as uuidv4 } from 'uuid';
import { PostgrestResponse } from '@supabase/supabase-js';

export const fetchKnowledgeDataFromSupabase = async (userId: string): Promise<ResponseAnswer[] | null> => {
    try {
        const response: PostgrestResponse<ResponseAnswer> = await supabase
            .from(ItemTypeSaved.KnowledgeAnswers)
            .select('*')
            .eq('user_id', userId);

        if (response.error) {
            console.error('Error fetching knowledge data:', response.error);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('Unexpected error fetching knowledge data:', error);
        return null;
    }
};

export const fetchInterviewQuestionDataFromSupabase = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from(ItemTypeSaved.InterviewAnswers)
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching interview question data:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error fetching interview question data:', error);
        return null;
    }
};

export const generateId = (): string => {
    return uuidv4();
};