declare global {
    interface Window {
        __ENV?: Record<string, string>;
    }
}

export const getApiKey = (service: string, userId: string): string => {
    // Check localStorage first
    const savedKeys = localStorage.getItem(`api_keys_${userId}`);
    if (savedKeys) {
        try {
            const decodedKeys = JSON.parse(atob(savedKeys));
            if (decodedKeys[service]) {
                return decodedKeys[service];
            }
        } catch (error) {
            console.error('Failed to decode API keys from localStorage:', error);
        }
    }

    // Fallback to environment variables
    return window.__ENV?.[`VITE_${service.toUpperCase()}_API_KEY`] || import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`] || '';
};