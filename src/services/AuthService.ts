import { generateCodeVerifier, generateCodeChallenge } from './pkceUtils';

class AuthService {
    private clientId: string;
    private redirectUri: string;
    private tokenKey: string;
    private userKey: string;
    private codeVerifierKey: string;


    constructor() {
        // GitHub OAuth App settings - you need to create this in GitHub
        this.clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        this.redirectUri = `${window.location.origin}/auth/callback`;

        // Local storage keys
        this.tokenKey = 'auth_token';
        this.userKey = 'user_data';
        this.codeVerifierKey = 'code_verifier';
    }

    getClientId(): string {
        return this.clientId;
    }
    getRedirectUri(): string {
        return this.redirectUri;
    }

    async loginWithGithub(): Promise<void> {
        // Generate and store PKCE code verifier
        const codeVerifier = generateCodeVerifier();
        localStorage.setItem(this.codeVerifierKey, codeVerifier);

        // Generate code challenge from verifier
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Create the authorization URL with the correct parameters
        const authUrl = new URL('https://github.com/login/oauth/authorize');
        authUrl.searchParams.append('client_id', this.clientId);
        authUrl.searchParams.append('redirect_uri', this.redirectUri);
        authUrl.searchParams.append('scope', 'user:email');
        authUrl.searchParams.append('state', this.generateRandomState());
        authUrl.searchParams.append('code_challenge', codeChallenge);
        authUrl.searchParams.append('code_challenge_method', 'S256');

        // Redirect to GitHub's authorization page
        window.location.href = authUrl.toString();
    }

    generateRandomState(): string {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    getUser(): any {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.codeVerifierKey);
    }

    // This method will be called by the callback handler
    setAuthData(token: string, user: any): void {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        localStorage.removeItem(this.codeVerifierKey);
    }
}

export default new AuthService();
