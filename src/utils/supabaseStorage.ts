import { supabase } from '@/supabaseClient';
import { SavedItem, ItemTypeSaved, ChatMessage } from '@/types/common';

/**
 * Save data to Supabase answers table
 */
export const saveData = async (type: ItemTypeSaved, data: SavedItem) => {
    try {
        // Convert the legacy type format to database enum format
        const dbType = type === ItemTypeSaved.InterviewAnswers ? 'interview' : 'knowledge';

        const { data: response, error } = await supabase
            .from('answers')
            .insert([{
                ...data,
                type: dbType
            }]);

        if (error) throw error;

        return { data: response, error: null };
    } catch (error) {
        console.error(`Error saving data to answers (${type}):`, error);
        return { data: null, error };
    }
};

/**
 * Update existing data in Supabase answers table
 */
export const updateData = async (type: ItemTypeSaved, id: string, userId: string, data: Partial<SavedItem>) => {
    try {
        const { data: response, error } = await supabase
            .from('answers')
            .update(data)
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        return { data: response, error: null };
    } catch (error) {
        console.error(`Error updating data in answers (${type}):`, error);
        return { data: null, error };
    }
};

/**
 * Delete data from Supabase answers table
 */
export const deleteData = async (type: ItemTypeSaved, id: string, userId: string) => {
    try {
        // First delete any associated chat history
        await supabase
            .from('chat_history')
            .delete()
            .eq('answer_id', id)
            .eq('user_id', userId);

        // Then delete the answer
        const { data: response, error } = await supabase
            .from('answers')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        return { data: response, error: null };
    } catch (error) {
        console.error(`Error deleting data from answers (${type}):`, error);
        return { data: null, error };
    }
};

/**
 * Fetch data from Supabase answers table for a specific user
 */
export const fetchUserData = async (type: ItemTypeSaved, userId: string) => {
    try {
        // Convert the legacy type format to database enum format
        const dbType = type === ItemTypeSaved.InterviewAnswers ? 'interview' : 'knowledge';

        const { data, error } = await supabase
            .from('answers')
            .select('*')
            .eq('user_id', userId)
            .eq('type', dbType);

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error(`Error fetching data from answers (${type}):`, error);
        return { data: null, error };
    }
};

/**
 * Save chat history related to an answer
 */
export const saveChatHistory = async (answerId: string, userId: string, messages: ChatMessage[]) => {
    try {
        // Check if chat history already exists for this answer
        const { data: existingChat } = await supabase
            .from('chat_history')
            .select('id, messages')
            .eq('answer_id', answerId)
            .eq('user_id', userId)
            .single();

        if (existingChat) {
            // Update existing chat history
            const { error } = await supabase
                .from('chat_history')
                .update({
                    messages: messages
                })
                .eq('id', existingChat.id)
                .eq('user_id', userId);

            if (error) throw error;
            return { data: existingChat.id, error: null };
        } else {
            // Create new chat history
            const { data, error } = await supabase
                .from('chat_history')
                .insert([{
                    answer_id: answerId,
                    user_id: userId,
                    messages: messages
                }])
                .select();

            if (error) throw error;
            return { data: data[0].id, error: null };
        }

    } catch (error) {
        console.error(`Error saving chat history for answer ${answerId}:`, error);
        return { data: null, error };
    }
};

/**
 * Fetch chat history for a specific answer
 */
export const fetchChatHistory = async (answerId: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('chat_history')
            .select('messages')
            .eq('answer_id', answerId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            // If not found, return empty messages array instead of throwing error
            if (error.code === 'PGRST116') {
                return { data: { messages: [] }, error: null };
            }
            throw error;
        }

        return { data, error: null };
    } catch (error) {
        console.error(`Error fetching chat history for answer ${answerId}:`, error);
        return { data: { messages: [] }, error };
    }
};