import AuthService from '../services/AuthService';

export default function LoginButton() {
    const handleLogin = () => {
        AuthService.loginWithGithub();
    };

    return (
        <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Login with GitHub
        </button>
    );
}
