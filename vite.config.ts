import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get base from environment or repository name for GitHub Pages
const base = process.env.BASE_URL || '/';

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

    return {
        plugins: [
            react(),
            // Plugin to replace %CUSTOM_DOMAIN% in env-config.js
            {
                name: 'html-transform',
                transformIndexHtml(html) {
                    return html.replace(/%CUSTOM_DOMAIN%/g, customDomain || '');
                }
            }
        ],
        define: {
            // Make custom domain available at build time
            'import.meta.env.VITE_CUSTOM_DOMAIN': JSON.stringify(customDomain)
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
        },
        base: base // Use '/' for custom domain
    };
});