import fs from 'fs';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import { dirname } from 'path';
/* global console */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to extract homepage
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Extract domain from homepage URL
const { homepage } = packageJson;
if (homepage) {
    try {
        // Parse the URL and extract hostname
        const url = new URL(homepage);
        const domain = url.hostname;

        console.log(`Generating CNAME file with domain: ${domain}`);

        // Write to CNAME file in dist directory
        const cnamePath = path.join(__dirname, '..', 'dist', 'CNAME');
        fs.writeFileSync(cnamePath, domain);
        console.log('CNAME file created successfully');
    } catch (error) {
        console.error('Error generating CNAME file:', error);
    }
} else {
    console.warn('No homepage URL found in package.json. CNAME file not generated.');
}
