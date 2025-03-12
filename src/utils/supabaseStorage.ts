import { supabase } from '@/supabaseClient';
import { SavedItem } from '@/types/common';

/**
 * Save new data to a Supabase table
 * @param table The table name to insert data into
 * @param data The data to insert
 * @returns Promise with the response or error
 */
export const saveDataSupabase = async (table: string, data: SavedItem) => {
    console.trace('supabaseStorage.ts - [table] - data', table, data);
    try {
        const { data: response, error } = await supabase
            .from(table)
            .insert([data]);

        if (error) throw error;

        return { data: response, error: null };
    } catch (error) {
        console.error(`Error saving data to ${table}:`, error);
        return { data: null, error };
    }
};

/**
 * Update existing data in a Supabase table
 * @param table The table name to update data in
 * @param id The ID of the record to update
 * @param userId The user ID for row-level security
 * @param data The data to update
 * @returns Promise with the response or error
 */
export const updateDataSupabase = async (table: string, id: string, userId: string, data: Partial<SavedItem>) => {
    try {
        const { data: response, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        return { data: response, error: null };
    } catch (error) {
        console.error(`Error updating data in ${table}:`, error);
        return { data: null, error };
    }
};

/**
 * Delete data from a Supabase table
 * @param table The table name to delete data from
 * @param id The ID of the record to delete
 * @param userId The user ID for row-level security
 * @returns Promise with the response or error
 */
export const deleteDataSupabase = async (table: string, id: string, userId: string) => {
    try {
        const { data: response, error } = await supabase
            .from(table)
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        return { data: response, error: null };
    } catch (error) {
        console.error(`Error deleting data from ${table}:`, error);
        return { data: null, error };
    }
};

/**
 * Fetch data from a Supabase table for a specific user
 * @param table The table name to fetch data from
 * @param userId The user ID to filter by
 * @returns Promise with the response or error
 */
export const fetchUserDataSupabase = async (table: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error(`Error fetching data from ${table}:`, error);
        return { data: null, error };
    }
};