import { supabase } from '@/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const fetchKnowledgeDataFromSupabase = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('answers')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'knowledge');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching knowledge data:', error);
        return [];
    }
};

export const fetchInterviewQuestionDataFromSupabase = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('answers')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'interview');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching interview questions:', error);
        return [];
    }
};

export const generateId = (): string => {
    return uuidv4();
};