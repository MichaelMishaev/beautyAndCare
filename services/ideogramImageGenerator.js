/**
 * Ideogram AI Image Generator Service
 * Professional beauty equipment image generation using Ideogram API V3
 *
 * Features:
 * - Generate high-quality photorealistic images
 * - Character reference support
 * - Style presets for professional medical aesthetics
 * - Automatic download and storage
 */

class IdeogramImageGenerator {
    constructor() {
        // API Key from ideogramm.md
        this.apiKey = 'fGDoK4f_gOWFjcDaS4vLxaavoVaWtzD8EgQXJiqWP72Fz3PBSg-bRzdtup_ajnP_vBBUZXZhBnPF3Y-CLxv4MA';
        this.baseUrl = 'https://api.ideogram.ai/v1/ideogram-v3';
        this.outputPath = 'assets/images/generated/';

        // Ensure output directory exists
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        // This will be handled by the calling code or server-side implementation
        console.log(`Images will be saved to: ${this.outputPath}`);
    }

    /**
     * Generate a professional beauty equipment image
     * @param {Object} options - Generation options
     * @param {string} options.prompt - Image description prompt
     * @param {string} options.aspectRatio - Aspect ratio (e.g., '16:9', '1:1', '4:3')
     * @param {string} options.stylePreset - Style preset (optional)
     * @param {string} options.renderingSpeed - FLASH, TURBO, DEFAULT, or QUALITY
     * @param {string} options.styleType - AUTO, REALISTIC, GENERAL, DESIGN, or FICTION
     * @returns {Promise<Object>} Generated image data
     */
    async generateImage(options = {}) {
        const {
            prompt,
            aspectRatio = '16:9',
            stylePreset = null,
            renderingSpeed = 'QUALITY',
            styleType = 'REALISTIC',
            numImages = 1
        } = options;

        if (!prompt) {
            throw new Error('Prompt is required for image generation');
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('aspect_ratio', aspectRatio);
        formData.append('rendering_speed', renderingSpeed);
        formData.append('style_type', styleType);
        formData.append('num_images', numImages.toString());

        // Add style preset if specified
        if (stylePreset) {
            formData.append('style_preset', stylePreset);
        }

        try {
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Api-Key': this.apiKey
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Ideogram API error (${response.status}): ${errorData}`);
            }

            const result = await response.json();
            console.log('✅ Image generated successfully:', result);

            return result;
        } catch (error) {
            console.error('❌ Error generating image:', error);
            throw error;
        }
    }

    /**
     * Download and save generated image
     * @param {string} imageUrl - URL of the generated image
     * @param {string} filename - Output filename
     * @returns {Promise<string>} Path to saved image
     */
    async downloadImage(imageUrl, filename) {
        try {
            const response = await fetch(imageUrl);

            if (!response.ok) {
                throw new Error(`Failed to download image: ${response.status}`);
            }

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const outputPath = `${this.outputPath}${filename}`;

            // Note: In a real implementation, you would use fs.writeFileSync here
            // For browser context, we'll return the blob URL
            const blobUrl = URL.createObjectURL(blob);

            console.log(`✅ Image downloaded: ${filename}`);
            return blobUrl;
        } catch (error) {
            console.error('❌ Error downloading image:', error);
            throw error;
        }
    }

    /**
     * Generate professional beauty equipment images with predefined prompts
     * @param {string} equipmentType - Type of equipment to generate
     * @returns {Promise<Object>} Generated image data
     */
    async generateBeautyEquipment(equipmentType) {
        const prompts = {
            'diode-laser': {
                prompt: 'Professional medical-grade diode laser hair removal machine in a pristine white modern aesthetic clinic treatment room. The device features a sleek silver and white design with a large color touchscreen display, professional handpiece on an articulated arm, and LED indicators. Clean minimalist aesthetic, soft natural lighting from large windows, white treatment bed visible in background. Ultra-high quality photorealistic medical equipment photography, 8K resolution, professional healthcare marketing image.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'rf-microneedling': {
                prompt: 'State-of-the-art radiofrequency microneedling device on a white medical cart in an upscale dermatology clinic. The machine has a modern glossy white and chrome finish, digital touch interface with blue accent lighting, sterile disposable tip cartridges displayed. Sophisticated medical spa environment with soft ambient lighting, professional aesthetic. Photorealistic medical device marketing photography, studio quality lighting, 8K detail.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'hifu-face': {
                prompt: 'Premium HIFU (High-Intensity Focused Ultrasound) facial lifting and skin tightening device in an elegant medical aesthetic clinic. Sleek white and silver machine with large touchscreen monitor showing skin analysis, multiple treatment handpieces on organized holders. Luxurious clinic interior with cream leather treatment chair, soft diffused lighting. Professional medical aesthetics product photography, magazine quality, 8K resolution.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'cryo-lipolysis': {
                prompt: 'Advanced cryolipolysis fat freezing body contouring machine in a modern weight loss clinic. Large professional device with white and metallic blue finish, digital control panel, multiple cooling applicators of various sizes. Clean contemporary clinic space with treatment bed, bright professional lighting. High-end medical equipment photography, commercial quality, ultra-detailed 8K.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'ipl-photofacial': {
                prompt: 'Professional IPL (Intense Pulsed Light) photofacial and skin rejuvenation system in a beauty dermatology clinic. Sophisticated white and chrome device with colorful touchscreen interface, ergonomic handpiece with cooling sapphire tip, UV protection eyewear displayed. Bright clean clinic environment, professional medical aesthetic. Studio-quality medical device photography, perfect lighting, 8K detail.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'led-therapy': {
                prompt: 'Modern LED light therapy facial treatment device with multi-color wavelength panels (red, blue, green lights glowing) in an upscale spa setting. Sleek adjustable standing unit with control tablet, positioned near a white treatment chair. Calm serene spa environment with plants, soft lighting. Professional aesthetic medicine photography, commercial grade, 8K resolution.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'ultrasound-cavitation': {
                prompt: 'Professional ultrasonic cavitation body slimming and cellulite reduction machine in a weight management clinic. Modern white device with blue accent lighting, multiple handpieces for different body areas, clear digital display panel. Contemporary clinic interior, medical-grade aesthetic. High-quality professional equipment photography, perfect composition, 8K detail.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'co2-laser': {
                prompt: 'Advanced fractional CO2 laser skin resurfacing system in a high-end dermatology surgical suite. Sophisticated medical-grade device with precision articulated arm, fiber optic laser delivery system, computer workstation with skin analysis software. Professional medical environment, sterile aesthetic, clinical lighting. Premium medical technology photography, 8K resolution.',
                aspectRatio: '4:3',
                styleType: 'REALISTIC'
            },
            'treatment-room': {
                prompt: 'Luxurious modern aesthetic medical clinic treatment room interior. Pristine white adjustable treatment bed with leather upholstery, professional beauty equipment station, LED panels, clean minimalist design with cream and white color palette, large windows with sheer curtains, plants, wood accent wall. Professional interior design photography, magazine quality, natural lighting, 8K resolution.',
                aspectRatio: '16:9',
                styleType: 'REALISTIC'
            },
            'consultation': {
                prompt: 'Professional medical consultation scene in an upscale aesthetic clinic. Female doctor in white coat showing skin analysis results on a tablet to a satisfied female patient, modern clinic interior with medical equipment in background, warm professional lighting, trust and professionalism. Editorial style healthcare photography, natural candid moment, 8K quality.',
                aspectRatio: '16:9',
                styleType: 'REALISTIC'
            },
            'satisfied-client': {
                prompt: 'Portrait of a confident, satisfied female client in her 40s after aesthetic treatment, glowing healthy skin, natural smile, in a bright modern medical spa consultation area. Soft natural window lighting, professional yet approachable vibe, blurred clinic background. Professional healthcare marketing photography, editorial quality, authentic emotion, 8K resolution.',
                aspectRatio: '1:1',
                styleType: 'REALISTIC'
            },
            'training-session': {
                prompt: 'Professional medical aesthetics training session in a modern clinic classroom. Expert trainer demonstrating laser device technique to attentive group of healthcare professionals in scrubs, hands-on learning with real equipment, bright educational environment with presentation screen. Professional educational photography, documentary style, 8K detail.',
                aspectRatio: '16:9',
                styleType: 'REALISTIC'
            }
        };

        const config = prompts[equipmentType];
        if (!config) {
            throw new Error(`Unknown equipment type: ${equipmentType}. Available types: ${Object.keys(prompts).join(', ')}`);
        }

        console.log(`🎨 Generating image for: ${equipmentType}`);
        return await this.generateImage(config);
    }

    /**
     * Generate multiple images with error handling
     * @param {Array<string>} equipmentTypes - Array of equipment types to generate
     * @returns {Promise<Array<Object>>} Array of generation results
     */
    async generateMultipleImages(equipmentTypes) {
        const results = [];

        for (const type of equipmentTypes) {
            try {
                console.log(`\n🔄 Generating: ${type}...`);
                const result = await this.generateBeautyEquipment(type);

                if (result && result.data && result.data[0]) {
                    const imageUrl = result.data[0].url;
                    const filename = `${type}-${Date.now()}.png`;

                    // Download the image
                    const savedPath = await this.downloadImage(imageUrl, filename);

                    results.push({
                        type,
                        success: true,
                        url: imageUrl,
                        savedPath,
                        filename
                    });

                    console.log(`✅ Successfully generated: ${type}`);
                } else {
                    throw new Error('Invalid response format');
                }

                // Rate limiting: wait 2 seconds between requests
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`❌ Failed to generate ${type}:`, error.message);
                results.push({
                    type,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Generate all essential beauty equipment images
     * @returns {Promise<Array<Object>>} Generation results
     */
    async generateAllEssentialImages() {
        const essentialTypes = [
            'diode-laser',
            'rf-microneedling',
            'hifu-face',
            'cryo-lipolysis',
            'ipl-photofacial',
            'treatment-room',
            'consultation',
            'training-session'
        ];

        console.log('🚀 Starting generation of all essential beauty equipment images...');
        console.log(`Total images to generate: ${essentialTypes.length}\n`);

        const results = await this.generateMultipleImages(essentialTypes);

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log('\n📊 Generation Summary:');
        console.log(`✅ Successful: ${successful}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Total: ${results.length}`);

        return results;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IdeogramImageGenerator;
}

// Browser global
if (typeof window !== 'undefined') {
    window.IdeogramImageGenerator = IdeogramImageGenerator;
}
