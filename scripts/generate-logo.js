/**
 * Logo Generator for Davidov Beauty & Care
 * Uses Imagine.art API to generate a professional medical aesthetic logo
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.vyro.ai/v2/image/generations';
const API_KEY = 'Bearer vk-St6iIHZ2rwAaDhuqBJus3FMUoCfiaZunkSyt8KqOQeAoc';

// Logo generation prompt
const LOGO_PROMPT = `Professional minimalist logo for "Davidov Beauty & Care" medical aesthetic equipment company. Modern design with:
- Company name in elegant sans-serif font (English and Hebrew "דוידוב ביוטי אנד קר")
- Medical aesthetic symbol (stylized beauty/wellness icon)
- Color scheme: Deep purple/blue gradient (#667eea to #764ba2) with white
- Clean, professional, trustworthy appearance
- Suitable for medical equipment industry
- Transparent or white background
- High contrast, scalable vector-style design
- Sophisticated and premium look`;

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        });
    });
}

function makeRequest(url, options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`API Error: ${res.statusCode}`));
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function generateLogo() {
    console.log('🎨 Generating professional logo for Davidov Beauty & Care...\n');

    const formData = `prompt=${encodeURIComponent(LOGO_PROMPT)}&style=realistic&aspect_ratio=1:1&seed=42`;

    try {
        console.log('📡 Calling Imagine.art API...');

        const data = await makeRequest(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, formData);

        console.log('✅ Logo generated successfully!');
        console.log('📥 Downloading image...\n');

        // Download the generated image
        const imageUrl = data.data?.[0]?.url || data.url;
        if (!imageUrl) {
            throw new Error('No image URL in response');
        }

        const imageBuffer = await downloadImage(imageUrl);

        // Save to assets/images/
        const logoPath = path.join(__dirname, '../assets/images/logo.png');
        const backupPath = path.join(__dirname, '../assets/images/logo-old.png');

        // Backup old logo
        if (fs.existsSync(logoPath)) {
            console.log('💾 Backing up old logo to logo-old.png...');
            fs.copyFileSync(logoPath, backupPath);
        }

        // Save new logo
        fs.writeFileSync(logoPath, imageBuffer);

        const stats = fs.statSync(logoPath);
        const fileSizeKB = (stats.size / 1024).toFixed(2);

        console.log('✨ SUCCESS! New logo saved:\n');
        console.log(`   📁 Location: assets/images/logo.png`);
        console.log(`   📊 Size: ${fileSizeKB} KB`);
        console.log(`   🔗 Image URL: ${imageUrl}\n`);
        console.log('🚀 Ready to commit and deploy!');

        return {
            success: true,
            path: logoPath,
            url: imageUrl,
            size: fileSizeKB
        };

    } catch (error) {
        console.error('❌ Logo generation failed:', error.message);
        throw error;
    }
}

// Run the generator
generateLogo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
