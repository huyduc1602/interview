import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchDataSuccess } from '@/store/interview/slice';
import { fetchKnowledgeDataFromSupabase, generateId } from '@/utils/supabaseUtils';
import { User } from '@/types/common';

interface KnowledgeCategory {
    items: { content: string;[key: string]: unknown }[];
    [key: string]: unknown;
}

export function useKnowledgeData(
    user: User | null,
    apiKey: string,
    spreadsheetId: string,
    sheetName: string,
    isGoogle: boolean,
    knowledge: SharedCategory[]
) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const dataLoadedRef = useRef(false);
    const userIdRef = useRef<string | null>(null);

    const loadData = async () => {
        setIsLoading(true);

        try {
            // Always load from Google Sheets first (for all users)
            if (apiKey && spreadsheetId && sheetName) {
                console.log('Fetching data from Google Sheets');
                dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
            }

            // For Google users, fetch answers from Supabase and merge with knowledge data
            if (isGoogle) {
                const answers = await fetchKnowledgeDataFromSupabase(user?.id ?? generateId());

                if (answers && answers.length > 0 && knowledge && knowledge.length > 0) {
                    // Create a map of question -> answer for quick lookup
                    const answersMap = new Map();
                    answers.forEach(item => {
                        if (item.question && item.answer) {
                            answersMap.set(item.question, item.answer);
                        }
                    });

                    // Clone and update knowledge data with answers
                    const updatedKnowledge = knowledge.map(category => ({
                        ...category,
                        items: category.items.map(item => {
                            const answer = answersMap.get(item.content);
                            if (answer) {
                                return { ...item, answer };
                            }
                            return item;
                        })
                    }));

                    // Update Redux store with merged data
                    dispatch(fetchDataSuccess({ knowledge: updatedKnowledge }));
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
            dataLoadedRef.current = true;
        }
    };

    useEffect(() => {
        // Skip if no user
        if (!user) return;

        // Only run if user has changed or this is first load
        if (user.id !== userIdRef.current || !dataLoadedRef.current) {
            userIdRef.current = user.id;
            loadData();
        }
    }, [apiKey, spreadsheetId, sheetName, user, isGoogle]);

    return {
        isLoading,
        setIsLoading,
        loadData
    };
}