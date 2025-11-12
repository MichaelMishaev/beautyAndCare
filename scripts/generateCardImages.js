#!/usr/bin/env node

/**
 * Generate specific images for clinic and device cards
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class CardImageGenerator {
    constructor() {
        this.apiKey = 'fGDoK4f_gOWFjcDaS4vLxaavoVaWtzD8EgQXJiqWP72Fz3PBSg-bRzdtup_ajnP_vBBUZXZhBnPF3Y-CLxv4MA';
        this.baseUrl = 'https://api.ideogram.ai/v1/ideogram-v3';
        this.outputDir = path.join(__dirname, '..', 'assets', 'images', 'cards');

        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            console.log(`📁 Created directory: ${this.outputDir}`);
        }
    }

    async makeMultipartRequest(url, fields) {
        return new Promise((resolve, reject) => {
            const boundary = '----IdeogramBoundary' + Date.now();
            let body = '';

            for (const [key, value] of Object.entries(fields)) {
                body += `------${boundary}\r\n`;
                body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
                body += `${value}\r\n`;
            }
            body += `------${boundary}--\r\n`;

            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || 443,
                path: urlObj.pathname,
                method: 'POST',
                headers: {
                    'Api-Key': this.apiKey,
                    'Content-Type': `multipart/form-data; boundary=----${boundary}`,
                    'Content-Length': Buffer.byteLength(body)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try { resolve(JSON.parse(data)); }
                        catch (e) { reject(new Error(`Parse error: ${e.message}`)); }
                    } else {
                        reject(new Error(`API error (${res.statusCode}): ${data}`));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(body);
            req.end();
        });
    }

    async downloadImage(imageUrl, outputPath) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(imageUrl);
            const protocol = urlObj.protocol === 'https:' ? https : require('http');
            const file = fs.createWriteStream(outputPath);

            protocol.get(imageUrl, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Download failed: ${response.statusCode}`));
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(outputPath);
                });
                file.on('error', (err) => {
                    fs.unlink(outputPath, () => {});
                    reject(err);
                });
            }).on('error', (err) => {
                fs.unlink(outputPath, () => {});
                reject(err);
            });
        });
    }

    async generateImage(prompt, options = {}) {
        const {
            aspectRatio = '4x3',
            renderingSpeed = 'QUALITY',
            styleType = 'REALISTIC',
        } = options;

        console.log(`🎨 Generating: ${prompt.substring(0, 80)}...`);

        const fields = {
            prompt,
            aspect_ratio: aspectRatio,
            rendering_speed: renderingSpeed,
            style_type: styleType,
            num_images: '1'
        };

        const result = await this.makeMultipartRequest(`${this.baseUrl}/generate`, fields);
        return result;
    }

    async generateCardImages() {
        const images = {
            'clinic-card': {
                prompt: 'Luxurious modern aesthetic medical clinic interior. Pristine white reception area with elegant curved desk, comfortable cream leather seating, large windows with natural light, minimalist decor with plants, professional medical spa atmosphere, clean lines, contemporary design. Wide angle professional interior photography, architectural digest style, 8K quality, perfect lighting.',
                aspectRatio: '16x9',
                filename: 'clinic-professional-card.jpg'
            },
            'device-card': {
                prompt: 'Professional medical-grade aesthetic laser device on white background. Modern sleek silver and white design, large touchscreen display, professional handpiece visible, LED indicators, clinical medical equipment photography style. Studio lighting, product photography, ultra-high detail, 8K resolution, commercial quality, isolated on white background.',
                aspectRatio: '1x1',
                filename: 'device-professional-card.png'
            }
        };

        console.log(`\n🎬 Generating Card Images`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        const results = [];

        for (const [type, config] of Object.entries(images)) {
            try {
                console.log(`\n🚀 Processing: ${type}`);
                console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

                const result = await this.generateImage(config.prompt, {
                    aspectRatio: config.aspectRatio,
                    renderingSpeed: 'QUALITY',
                    styleType: 'REALISTIC'
                });

                if (result && result.data && result.data[0]) {
                    const imageUrl = result.data[0].url;
                    const outputPath = path.join(this.outputDir, config.filename);

                    console.log(`⬇️  Downloading image...`);
                    await this.downloadImage(imageUrl, outputPath);

                    console.log(`✅ Success! Saved to: ${outputPath}`);
                    console.log(`   Resolution: ${result.data[0].resolution}`);

                    results.push({
                        success: true,
                        type,
                        path: outputPath,
                        filename: config.filename,
                        url: imageUrl
                    });
                } else {
                    throw new Error('Invalid API response');
                }

                // Wait 3 seconds between requests
                if (type !== 'device-card') {
                    console.log(`⏳ Waiting 3 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

            } catch (error) {
                console.error(`❌ Failed: ${error.message}`);
                results.push({
                    success: false,
                    type,
                    error: error.message
                });
            }
        }

        // Summary
        const successful = results.filter(r => r.success).length;
        console.log(`\n\n📊 Generation Summary`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅ Successful: ${successful}/2`);

        return results;
    }
}

// Execute
if (require.main === module) {
    const generator = new CardImageGenerator();

    console.log(`\n🎨 Card Image Generator`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    generator.generateCardImages()
        .then((results) => {
            console.log(`\n✨ All done!`);

            console.log(`\n📁 Generated files:`);
            results.filter(r => r.success).forEach(r => {
                console.log(`   ${r.filename}`);
            });

            process.exit(0);
        })
        .catch((error) => {
            console.error(`\n💥 Fatal error: ${error.message}`);
            process.exit(1);
        });
}

module.exports = CardImageGenerator;
