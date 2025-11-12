#!/usr/bin/env node

/**
 * Beauty Equipment Image Generation Script
 * Generates professional beauty equipment images using Ideogram AI
 *
 * Usage:
 *   node scripts/generateBeautyImages.js [equipment-type]
 *   node scripts/generateBeautyImages.js all
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class BeautyImageGenerator {
    constructor() {
        this.apiKey = 'fGDoK4f_gOWFjcDaS4vLxaavoVaWtzD8EgQXJiqWP72Fz3PBSg-bRzdtup_ajnP_vBBUZXZhBnPF3Y-CLxv4MA';
        this.baseUrl = 'https://api.ideogram.ai/v1/ideogram-v3';
        this.outputDir = path.join(__dirname, '..', 'assets', 'images', 'generated');

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
            aspectRatio = '4:3',
            renderingSpeed = 'QUALITY',
            styleType = 'REALISTIC',
            numImages = 1
        } = options;

        console.log(`🎨 Generating image...`);
        console.log(`   Prompt: ${prompt.substring(0, 100)}...`);
        console.log(`   Style: ${styleType}, Speed: ${renderingSpeed}`);

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
     * Equipment presets with professional prompts
     */
    getEquipmentPrompts() {
        return {
            'device-main': {
                prompt: 'Professional medical-grade diode laser hair removal machine in a pristine white modern aesthetic clinic. The device features a sleek silver and white design with a large color touchscreen display, professional handpiece on an articulated arm, LED indicators. Clean minimalist aesthetic, soft natural lighting, white treatment bed visible. Ultra-high quality photorealistic medical equipment photography, 8K resolution, professional healthcare marketing image.',
                aspectRatio: '4x3',
                filename: 'device-main.png'
            },
            'hero-clinic': {
                prompt: 'Luxurious modern aesthetic medical clinic interior panoramic view. Pristine white treatment rooms with state-of-the-art beauty equipment, elegant reception area, large windows with natural light, cream and white color palette, wood accents, professional yet welcoming atmosphere. Wide angle architectural photography, magazine quality, 8K resolution.',
                aspectRatio: '16x9',
                filename: 'hero-clinic.jpg'
            },
            'treatment-room': {
                prompt: 'Premium aesthetic treatment room interior with white leather treatment bed, professional laser equipment on medical cart, LED light panels, minimalist design with cream walls, large window with sheer curtains, potted plants, modern aesthetic. Professional interior design photography, natural lighting, 8K detail.',
                aspectRatio: '16x9',
                filename: 'treatment-room.jpg'
            },
            'service-consultation': {
                prompt: 'Professional medical aesthetic consultation. Female doctor in white coat consulting with satisfied female patient, showing skin analysis on tablet, modern upscale clinic interior, warm professional lighting, trust and expertise. Editorial healthcare photography, natural candid moment, 8K quality.',
                aspectRatio: '16x9',
                filename: 'service-consultation.jpg'
            },
            'training-session': {
                prompt: 'Professional aesthetics training session in modern clinic classroom. Expert trainer demonstrating laser device to attentive group of healthcare professionals, hands-on learning with equipment, bright educational environment with screens. Documentary style professional photography, 8K resolution.',
                aspectRatio: '16x9',
                filename: 'training-session.jpg'
            },
            'client-testimonial-1': {
                prompt: 'Portrait of confident, satisfied female client in her 40s with glowing healthy skin, natural warm smile, professional aesthetic clinic background blurred, soft window lighting. Professional healthcare marketing portrait, authentic emotion, magazine quality, 8K detail.',
                aspectRatio: '1x1',
                filename: 'client-testimonial-1.jpg'
            }
        };
    }

    /**
     * Generate specific equipment image
     */
    async generateEquipmentImage(equipmentType) {
        const prompts = this.getEquipmentPrompts();
        const config = prompts[equipmentType];

        if (!config) {
            throw new Error(`Unknown equipment type: ${equipmentType}\nAvailable: ${Object.keys(prompts).join(', ')}`);
        }

        console.log(`\n🚀 Generating: ${equipmentType}`);
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
                console.log(`   Resolution: ${result.data[0].resolution}`);

                return {
                    success: true,
                    type: equipmentType,
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
                type: equipmentType,
                error: error.message
            };
        }
    }

    /**
     * Generate all equipment images
     */
    async generateAllImages() {
        const prompts = this.getEquipmentPrompts();
        const types = Object.keys(prompts);

        console.log(`\n🎬 Starting batch generation`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📊 Total images: ${types.length}`);
        console.log(`🎯 Output directory: ${this.outputDir}\n`);

        const results = [];

        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            console.log(`\n[${i + 1}/${types.length}] Processing: ${type}`);

            const result = await this.generateEquipmentImage(type);
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
    const args = process.argv.slice(2);
    const generator = new BeautyImageGenerator();

    console.log(`\n🎨 Beauty Equipment Image Generator`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    if (args.length === 0 || args[0] === 'all') {
        generator.generateAllImages()
            .then(() => {
                console.log(`\n✨ All done!`);
                process.exit(0);
            })
            .catch((error) => {
                console.error(`\n💥 Fatal error: ${error.message}`);
                process.exit(1);
            });
    } else {
        const equipmentType = args[0];
        generator.generateEquipmentImage(equipmentType)
            .then(() => {
                console.log(`\n✨ Done!`);
                process.exit(0);
            })
            .catch((error) => {
                console.error(`\n💥 Error: ${error.message}`);
                process.exit(1);
            });
    }
}

module.exports = BeautyImageGenerator;
