declare global {
    interface Window {
        __ENV?: Record<string, string>;
    }
}

export const getApiKey = (service: string, userId: string): string => {
    // Check localStorage first
    const savedKeys = localStorage.getItem(`api_keys_${userId}`);
    if (savedKeys) {
        const apiKeys = JSON.parse(savedKeys);
        if (apiKeys[service]) {
            return apiKeys[service];
        }
    }

    // Fallback to environment variables
    return window.__ENV?.[`VITE_${service.toUpperCase()}_API_KEY`] || import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`] || '';
};