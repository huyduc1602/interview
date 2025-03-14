export const generateCodeVerifier = (): string => {
    try {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return base64URLEncode(array);
    } catch (error) {
        console.error('Error generating code verifier:', error);
        throw new Error('Failed to generate code verifier');
    }
}

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
    if (!verifier) {
        throw new Error('Code verifier is required');
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return base64URLEncode(new Uint8Array(digest));
    } catch (error) {
        console.error('Error generating code challenge:', error);
        throw new Error('Failed to generate code challenge');
    }
};

function base64URLEncode(buffer: ArrayBuffer | Uint8Array): string {
    // Convert to Uint8Array if not already
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

    // Safely convert bytes to string without using spread operator
    let binaryString = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(bytes[i]);
    }

    return btoa(binaryString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}