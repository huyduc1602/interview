import { supabase } from '@/supabaseClient';
import { SavedItem } from '@/types/common';

export const saveData = async (table: string, data: SavedItem) => {
    const { data: response, error } = await supabase.from(table).insert([data]);
    if (error) {
        console.error('Error saving data:', error);
    } else {
        console.log('Data saved:', response);
    }
};