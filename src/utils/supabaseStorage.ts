import { supabase } from '@/supabaseClient';
import { SavedItem, ItemTypeSaved, ChatMessage } from '@/types/common';
import { SettingsState } from '@/hooks/useSettings';

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

// Fetch user settings from Supabase
export const fetchUserSettings = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return { data: null, error };
    }
};

// Save or update user settings to Supabase
export const saveUserSettings = async (userId: string, settings: any) => {
    try {
        // Format settings for database
        const dbSettings = {
            user_id: userId,
            openai: settings.openai,
            gemini: settings.gemini,
            mistral: settings.mistral,
            openchat: settings.openchat,
            google_sheet_api_key: settings.google_sheet_api_key,
            api_settings: settings.apiSettings || settings.api_settings || {},
            app_preferences: settings.appPreferences || settings.app_preferences || {},
            feature_flags: settings.featureFlags || settings.feature_flags || {}
        };

        // Check if settings already exist for this user
        const { data: existingSettings } = await supabase
            .from('settings')
            .select('id')
            .eq('user_id', userId)
            .single();

        let result;
        if (existingSettings) {
            // Update existing settings
            result = await supabase
                .from('settings')
                .update(dbSettings)
                .eq('user_id', userId);
        } else {
            // Insert new settings
            result = await supabase
                .from('settings')
                .insert([dbSettings]);
        }

        if (result.error) throw result.error;

        return { data: result.data, error: null };
    } catch (error) {
        console.error('Error saving user settings:', error);
        return { data: null, error };
    }
};

// Get feature flag values from user settings
export const getFeatureFlags = async (userId: string): Promise<Record<string, any>> => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('feature_flags')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return data?.feature_flags || {};
    } catch (error) {
        console.error('Error fetching feature flags:', error);
        return {};
    }
};

// Update specific feature flag
export const updateFeatureFlag = async (
    userId: string,
    flagPath: string,
    value: any
): Promise<boolean> => {
    try {
        // First get current flags
        const { data: currentSettings, error: fetchError } = await supabase
            .from('settings')
            .select('feature_flags')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        // Prepare update with new flag value
        const featureFlags = currentSettings?.feature_flags || {};

        // Handle nested paths like "auto_save.knowledge"
        const pathParts = flagPath.split('.');
        if (pathParts.length === 1) {
            featureFlags[pathParts[0]] = value;
        } else {
            let current = featureFlags;
            for (let i = 0; i < pathParts.length - 1; i++) {
                current[pathParts[i]] = current[pathParts[i]] || {};
                current = current[pathParts[i]];
            }
            current[pathParts[pathParts.length - 1]] = value;
        }

        // Update in database
        const { error: updateError } = await supabase
            .from('settings')
            .update({ feature_flags: featureFlags })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        return true;
    } catch (error) {
        console.error('Error updating feature flag:', error);
        return false;
    }
};