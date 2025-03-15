/**
 * Get the current Vite server port from environment variables
 * @param defaultPort The default port to use if not specified in environment variables
 * @returns The port number as a string
 */
export const getVitePort = (defaultPort: number = 5173): string => {
    // Get the actual port from window.location if available
    const actualPort = window.location.port;
    if (actualPort) {
        return actualPort;
    }

    // Fall back to environment variable or default
    const port = import.meta.env.VITE_PORT || defaultPort;
    return port.toString();
};

/**
 * Get the base URL for the current environment
 * @returns The base URL (with protocol and port if localhost)
 */
export const getBaseUrl = (): string => {
    if (window.location.origin.includes("localhost")) {
        return `http://localhost:${getVitePort()}`;
    }
    return window.location.origin;
};
