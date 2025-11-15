#!/usr/bin/env node

/**
 * About Page Image Generation Script
 * Generates professional images for the About Us page using Ideogram AI
 *
 * Usage:
 *   node scripts/generateAboutImages.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class AboutImageGenerator {
    constructor() {
        this.apiKey = 'fGDoK4f_gOWFjcDaS4vLxaavoVaWtzD8EgQXJiqWP72Fz3PBSg-bRzdtup_ajnP_vBBUZXZhBnPF3Y-CLxv4MA';
        this.baseUrl = 'https://api.ideogram.ai/v1/ideogram-v3';
        this.outputDir = path.join(__dirname, '..', 'assets', 'images', 'about');

        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            console.log(`📁 Created directory: ${this.outputDir}`);
        }
    }

    /**
     * Make multipart/form-data request
     */
    async makeMultipartRequest(url, fields) {
        return new Promise((resolve, reject) => {
            const boundary = '----IdeogramBoundary' + Date.now();
            let body = '';

            // Build multipart body
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

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(new Error(`Failed to parse response: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`API error (${res.statusCode}): ${data}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.write(body);
            req.end();
        });
    }

    /**
     * Download image from URL
     */
    async downloadImage(imageUrl, outputPath) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(imageUrl);
            const protocol = urlObj.protocol === 'https:' ? https : http;

            const file = fs.createWriteStream(outputPath);

            protocol.get(imageUrl, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: ${response.statusCode}`));
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

    /**
     * Generate image using Ideogram API
     */
    async generateImage(prompt, options = {}) {
        const {
            aspectRatio = '16x9',
            renderingSpeed = 'QUALITY',
            styleType = 'REALISTIC',
            numImages = 1
        } = options;

        console.log(`🎨 Generating image...`);
        console.log(`   Prompt: ${prompt.substring(0, 100)}...`);

        const fields = {
            prompt,
            aspect_ratio: aspectRatio,
            rendering_speed: renderingSpeed,
            style_type: styleType,
            num_images: numImages.toString()
        };

        try {
            const result = await this.makeMultipartRequest(`${this.baseUrl}/generate`, fields);
            return result;
        } catch (error) {
            console.error(`❌ Generation failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * About page image prompts
     */
    getImagePrompts() {
        return {
            'company-story': {
                prompt: 'Modern professional medical aesthetic equipment distribution company headquarters. Bright spacious office with medical devices on display, large windows with natural light, professional team working at desks with computers, sleek white and purple branding, welcoming reception area. Upscale corporate interior design photography, 8K resolution, professional business marketing image.',
                aspectRatio: '16x9',
                filename: 'company-story.jpg'
            },
            'service-distribution': {
                prompt: 'Professional warehouse and showroom for medical aesthetic equipment. Multiple advanced laser machines, body contouring devices, and beauty equipment displayed professionally on white pedestals, excellent LED lighting, clean modern industrial space with purple accent lighting. High-end product photography, 8K quality, corporate catalog style.',
                aspectRatio: '4x3',
                filename: 'service-distribution.jpg'
            },
            'service-installation': {
                prompt: 'Professional technicians installing medical aesthetic laser equipment in a pristine white clinic treatment room. Technical expert in branded polo shirt carefully setting up sophisticated beauty device, using tools and laptop for calibration, clean professional environment. Documentary style corporate photography, natural lighting, 8K detail.',
                aspectRatio: '4x3',
                filename: 'service-installation.jpg'
            },
            'service-training': {
                prompt: 'Expert medical aesthetics training session in modern clinic classroom. Professional trainer in white coat demonstrating laser device operation to attentive group of healthcare professionals, large screen displaying technical information, hands-on learning environment, bright educational setting. Professional corporate training photography, 8K quality.',
                aspectRatio: '4x3',
                filename: 'service-training.jpg'
            },
            'service-support': {
                prompt: 'Professional technical support team providing maintenance service for medical aesthetic equipment. Friendly technician in company uniform examining advanced beauty device with diagnostic tools, tablet showing technical data, modern clinic environment. Professional service photography, trustworthy atmosphere, 8K resolution.',
                aspectRatio: '4x3',
                filename: 'service-support.jpg'
            }
        };
    }

    /**
     * Generate specific image
     */
    async generateAboutImage(imageType) {
        const prompts = this.getImagePrompts();
        const config = prompts[imageType];

        if (!config) {
            throw new Error(`Unknown image type: ${imageType}\nAvailable: ${Object.keys(prompts).join(', ')}`);
        }

        console.log(`\n🚀 Generating: ${imageType}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        try {
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
                console.log(`   URL: ${imageUrl}`);

                return {
                    success: true,
                    type: imageType,
                    url: imageUrl,
                    path: outputPath,
                    filename: config.filename
                };
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
            return {
                success: false,
                type: imageType,
                error: error.message
            };
        }
    }

    /**
     * Generate all about page images
     */
    async generateAllImages() {
        const prompts = this.getImagePrompts();
        const types = Object.keys(prompts);

        console.log(`\n🎬 Starting About Page Image Generation`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📊 Total images: ${types.length}`);
        console.log(`🎯 Output directory: ${this.outputDir}\n`);

        const results = [];

        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            console.log(`\n[${i + 1}/${types.length}] Processing: ${type}`);

            const result = await this.generateAboutImage(type);
            results.push(result);

            // Rate limiting: wait 3 seconds between requests
            if (i < types.length - 1) {
                console.log(`⏳ Waiting 3 seconds before next request...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        // Summary
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`\n\n📊 Generation Summary`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅ Successful: ${successful}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Total: ${results.length}`);

        if (successful > 0) {
            console.log(`\n✨ Successfully generated images:`);
            results.filter(r => r.success).forEach(r => {
                console.log(`   ✓ ${r.filename}`);
            });
        }

        if (failed > 0) {
            console.log(`\n❌ Failed items:`);
            results.filter(r => !r.success).forEach(r => {
                console.log(`   - ${r.type}: ${r.error}`);
            });
        }

        return results;
    }
}

// CLI execution
if (require.main === module) {
    const generator = new AboutImageGenerator();

    console.log(`\n🎨 About Page Image Generator`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    generator.generateAllImages()
        .then((results) => {
            console.log(`\n✨ All done!`);
            console.log(`\n📝 Next steps:`);
            console.log(`   1. Check generated images in: assets/images/about/`);
            console.log(`   2. Update pages/about.html to use these images`);
            console.log(`   3. Commit and deploy to GitHub Pages`);
            process.exit(0);
        })
        .catch((error) => {
            console.error(`\n💥 Fatal error: ${error.message}`);
            process.exit(1);
        });
}

module.exports = AboutImageGenerator;
