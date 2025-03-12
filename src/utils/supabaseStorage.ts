import { supabase } from '@/supabaseClient';

export const saveData = async (table: string, data: any) => {
    const { data: response, error } = await supabase.from(table).insert([data]);
    if (error) {
        console.error('Error saving data:', error);
    } else {
        console.log('Data saved:', response);
    }
};