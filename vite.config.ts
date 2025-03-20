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
            },
            // Thêm plugin để copy 404.html vào thư mục dist trong quá trình build
            {
                name: 'copy-404-html',
                closeBundle() {
                    // Copy 404.html để GitHub Pages xử lý SPA routing
                    if (mode === 'production') {
                        try {
                            const source = path.resolve('./public/404.html');
                            const dest = path.resolve('./dist/404.html');
                            fs.copyFileSync(source, dest);
                            console.log('404.html copied to dist folder');
                        } catch (err) {
                            console.error('Error copying 404.html:', err);
                        }
                    }
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
            historyApiFallback: true, // Hỗ trợ BrowserRouter trong môi trường dev
        },
        base: base // Use '/' for custom domain
    };
});