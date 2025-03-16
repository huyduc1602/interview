/**
 * Utility to help with React hydration issues
 * Particularly for GitHub Pages deployments
 */

import { useEffect, useState } from 'react';

/**
 * Hook to ensure consistent rendering between server and client
 * Helps prevent the React Error #185 (switching between controlled/uncontrolled)
 */
export function useHydrationSafeState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(initialState);
    const [hydrated, setHydrated] = useState(false);

    // Run once after hydration is complete
    useEffect(() => {
        setHydrated(true);
    }, []);

    // Return the initial state during first render, then the actual state
    return [hydrated ? state : initialState, setState];
}

/**
 * Wraps a value to ensure it's always a string
 * Helps prevent uncontrolled to controlled warnings
 */
export function ensureString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
}

/**
 * Get the custom domain from homepage in package.json or environment
 * This allows for dynamic domain configuration without hardcoding
 */
export function getCustomDomain(): string | null {
    // Try to get from import.meta if available (Vite environment)
    if (import.meta?.env?.VITE_CUSTOM_DOMAIN) {
        return import.meta.env.VITE_CUSTOM_DOMAIN;
    }

    // Try to get from window.ENV if defined (can be injected at build time)
    if (typeof window !== 'undefined' && window.__ENV && window.__ENV.CUSTOM_DOMAIN) {
        return window.__ENV.CUSTOM_DOMAIN;
    }

    // Extract from current hostname if not localhost or github.io
    if (typeof window !== 'undefined' &&
        !window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('github.io')) {
        return window.location.hostname;
    }

    return null;
}

/**
 * Checks if we're in a production environment
 * For custom domain GitHub Pages, we detect based on hostname
 */
export function isRunningOnGitHubPages(): boolean {
    const customDomain = getCustomDomain();
    const isCustomDomain = customDomain && window.location.hostname === customDomain;
    const isGithubIO = window.location.hostname.includes('github.io');

    return isCustomDomain || isGithubIO;
}
