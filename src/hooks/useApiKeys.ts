import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useApiKeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
    }
  }, [user]);

  const getApiKey = (service: string) => {
    return apiKeys[service] || import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`];
  };

  return {
    apiKeys,
    getApiKey
  };
}