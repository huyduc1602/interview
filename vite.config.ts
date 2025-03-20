import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Check if the app is running on GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.DEPLOY_TARGET === 'gh-pages') ||
    process.env.BASE_URL?.includes('github.io');

// Function to extract domain from homepage in package.json
function getCustomDomain() {
    try {
        const packageJsonPath = path.resolve('./package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.homepage) {
            const url = new URL(packageJson.homepage);
            return url.hostname;
        }
    } catch (error) {
        console.warn('Error reading package.json:', error);
    }
    return null;
}

export default defineConfig(({ mode }) => {
    // Load env variables based on mode
    const customDomain = getCustomDomain();

    // Determine the base path
    let basePath = '/';
    if (process.env.NODE_ENV === 'production' && isGitHubPages) {
        // For GitHub Pages
        const repoName = process.env.REPO_NAME || 'interview';
        basePath = `/${repoName}/`;
    }

    return {
        plugins: [
            react(),
            // Plugin to replace %CUSTOM_DOMAIN% in env-config.js
            {
                name: 'html-transform',
                transformIndexHtml(html) {
                    return html.replace(/%CUSTOM_DOMAIN%/g, customDomain || '');
                }
            },
            // Add plugin to copy 404.html to dist folder during build
            {
                name: 'copy-404-html',
                closeBundle() {
                    // Copy 404.html for GitHub Pages SPA routing
                    if (mode === 'production') {
                        try {
                            const source = path.resolve('./public/404.html');
                            const dest = path.resolve('./dist/404.html');
                            fs.copyFileSync(source, dest);
                            console.log('404.html copied to dist folder');

                            // Also ensure index.html is properly configured
                            const indexPath = path.resolve('./dist/index.html');
                            if (fs.existsSync(indexPath)) {
                                let indexContent = fs.readFileSync(indexPath, 'utf8');

                                // Ensure proper base tag is included for routing
                                if (!indexContent.includes('<base href=')) {
                                    indexContent = indexContent.replace('<head>', `<head>\n    <base href="${basePath}">`);
                                    fs.writeFileSync(indexPath, indexContent);
                                    console.log('Base tag added to index.html');
                                }
                            }
                        } catch (err) {
                            console.error('Error during build post-processing:', err);
                        }
                    }
                }
            }
        ],
        define: {
            // Make custom domain and GitHub Pages status available at build time
            'import.meta.env.VITE_CUSTOM_DOMAIN': JSON.stringify(customDomain),
            'import.meta.env.VITE_IS_GITHUB_PAGES': isGitHubPages
        },
        resolve: {
            alias: {
                '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx']
        },
        build: {
            sourcemap: true,
            outDir: 'dist',
        },
        server: {
            port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173,
            historyApiFallback: true, // Support BrowserRouter in dev environment
        },
        base: basePath
    };
});