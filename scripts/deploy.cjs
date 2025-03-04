const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
    console.error('Dist directory does not exist. Run npm run build first.');
    process.exit(1);
}

// Create necessary files
fs.writeFileSync('dist/.nojekyll', '');
fs.writeFileSync('dist/CNAME', 'interview.hoanghuyduc.com');

// Create environment config file with public env variables
const envConfig = {
    VITE_GOOGLE_SHEET_API_KEY: process.env.VITE_GOOGLE_SHEET_API_KEY || 'AIzaSyDG7Yo31AWQAux-CtTTI0rOuXxN-5Tabb0',
    VITE_OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY || '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',
    VITE_SPREADSHEET_ID: process.env.VITE_SPREADSHEET_ID || '1p3TFV_F5tMmCrxLG4ztNMmK3ueRabst60vp7MnSOI5Y',
    VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || '4444534707070-45dshuu8mnbj7cd2s679ftvrocnnuhro.apps.googleusercontent.com',
    VITE_GOOGLE_CLIENT_SECRET: process.env.VITE_GOOGLE_CLIENT_SECRET || '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',
    VITE_GOOGLE_REFRESH_TOKEN: process.env.VITE_GOOGLE_REFRESH_TOKEN || 'your_refresh_token',
    VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || 'AIzaSyDDjwTfVcvtTQvqzfRlAc6lpq4HvfCsN4s',
    VITE_OPENCHAT_API_KEY: process.env.VITE_OPENCHAT_API_KEY || '02fa687f7aed621f2acd79fdf8e82adc709b6d1f5071aec271ae910ffc7ca3f0',
    VITE_MISTRAL_API_KEY: process.env.VITE_MISTRAL_API_KEY || 'dPTopBXlbUFrq6SrtEH0vo4z0CQzbMC1',
};

// Write the environment config file
fs.writeFileSync('dist/env-config.js',
    `window.__ENV = ${JSON.stringify(envConfig, null, 2)};`
);

// Inject the script tag into the HTML file
try {
    const indexPath = 'dist/index.html';
    let htmlContent = fs.readFileSync(indexPath, 'utf-8');

    if (!htmlContent.includes('env-config.js')) {
        const headEndPos = htmlContent.indexOf('</head>');
        if (headEndPos !== -1) {
            // Split the HTML at the </head> position
            const before = htmlContent.slice(0, headEndPos);
            const after = htmlContent.slice(headEndPos);
            // Insert the script tag
            htmlContent = before + '<script src="./env-config.js"></script>\n' + after;
            fs.writeFileSync(indexPath, htmlContent);
            console.log('Successfully injected env-config.js script tag into index.html');
        } else {
            console.error('Could not find </head> tag in index.html');
        }
    }
} catch (error) {
    console.error('Failed to inject script tag:', error);
}

// Create a temporary branch for deployment
try {
    execSync('git checkout --orphan temp-gh-pages');
    execSync('git --work-tree dist add --all');
    execSync('git --work-tree dist commit -m "Deploy"');
    execSync('git push origin HEAD:gh-pages --force');
    execSync('git checkout -f master'); // Note: If your main branch is named "main" instead of "master", change this
    execSync('git branch -D temp-gh-pages');
    console.log('Successfully deployed!');
} catch (error) {
    console.error('Deployment failed:', error);
}