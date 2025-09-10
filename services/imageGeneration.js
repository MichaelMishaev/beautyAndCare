/**
 * Image Generation Service
 * Integrates with Imagine.art API for AI-powered image generation
 * Optimized for Davidov Beauty Care medical aesthetic imagery
 */

class ImageGenerationService {
    constructor() {
        this.apiUrl = 'https://api.vyro.ai/v2/image/generations';
        this.apiKey = 'Bearer vk-St6iIHZ2rwAaDhuqBJus3FMUoCfiaZunkSyt8KqOQeAoc';
        this.defaultStyle = 'realistic';
        
        // Image dimensions based on usage
        this.dimensions = {
            hero: { width: 1920, height: 1080, ratio: '16:9' },
            device: { width: 800, height: 600, ratio: '4:3' },
            service: { width: 600, height: 400, ratio: '3:2' },
            badge: { width: 200, height: 200, ratio: '1:1' },
            blog: { width: 400, height: 300, ratio: '4:3' },
            project: { width: 600, height: 450, ratio: '4:3' }
        };

        // Professional medical-aesthetic prompts based on content analysis
        this.prompts = {
            hero: [
                {
                    prompt: "Professional diode laser hair removal system in modern Israeli beauty clinic, sleek white medical equipment with touchscreen display showing Hebrew interface, clean minimalist interior, soft professional lighting, photorealistic",
                    seed: "1",
                    category: "hero"
                },
                {
                    prompt: "Beautiful Israeli woman receiving painless laser hair removal treatment, professional beauty therapist operating advanced diode laser equipment, modern clinic setting, satisfied expression, medical aesthetic environment",
                    seed: "2",
                    category: "hero"
                },
                {
                    prompt: "State-of-the-art beauty clinic reception area in Tel Aviv, modern white interior design, Davidov professional equipment visible, Hebrew signage, welcoming atmosphere, natural lighting",
                    seed: "3",
                    category: "hero"
                }
            ],
            devices: [
                {
                    prompt: "Triple wavelength diode laser hair removal machine, professional medical device, 810nm 940nm 1064nm display, cooling handpiece attachment, white and blue color scheme, product photography style",
                    seed: "4",
                    category: "device"
                },
                {
                    prompt: "Professional laser handpiece with sapphire cooling tip, medical grade equipment close-up, blue LED indicators, ergonomic design, white background product shot",
                    seed: "5",
                    category: "device"
                },
                {
                    prompt: "Touch screen control panel showing Hebrew interface for laser parameters, modern medical UI design, real-time skin temperature monitoring display, professional equipment",
                    seed: "6",
                    category: "device"
                }
            ],
            services: [
                {
                    prompt: "Professional beauty therapist performing laser hair removal on client leg, modern treatment room, advanced cooling system visible, comfortable medical chair, clinical setting",
                    seed: "7",
                    category: "service"
                },
                {
                    prompt: "Skin analysis consultation with dermatologist using advanced imaging technology, professional examination, modern clinic, Hebrew documentation visible, caring interaction",
                    seed: "8",
                    category: "service"
                },
                {
                    prompt: "Professional training session for beauty clinic staff, Davidov equipment demonstration, Hebrew instruction materials, hands-on learning, modern training facility",
                    seed: "9",
                    category: "service"
                }
            ],
            projects: [
                {
                    prompt: "Before and after laser hair removal results, smooth skin transformation, professional medical photography, subtle elegant presentation",
                    seed: "10",
                    category: "project"
                },
                {
                    prompt: "Modern beauty clinic interior showcasing multiple treatment rooms, Davidov equipment installation, professional medical aesthetic design, Israeli clinic",
                    seed: "11",
                    category: "project"
                },
                {
                    prompt: "Happy clinic owner standing next to new Davidov laser equipment, successful business, professional portrait, modern clinic background",
                    seed: "12",
                    category: "project"
                }
            ],
            trust: [
                {
                    prompt: "24/7 customer support icon with Hebrew text, professional badge design, blue and white colors, trust symbol, transparent background",
                    seed: "13",
                    category: "badge"
                },
                {
                    prompt: "Transparent pricing guarantee badge, Israeli shekel symbol, professional seal design, trustworthy appearance, clean graphics",
                    seed: "14",
                    category: "badge"
                },
                {
                    prompt: "Same day service icon for Tel Aviv area, delivery truck symbol, Hebrew text, professional badge, blue accent color",
                    seed: "15",
                    category: "badge"
                }
            ]
        };
    }

    /**
     * Generate a single image using Imagine.art API
     */
    async generateImage(prompt, aspectRatio = '16:9', seed = '1', style = null) {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('style', style || this.defaultStyle);
        formData.append('aspect_ratio', aspectRatio);
        formData.append('seed', seed);

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.apiKey
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                imageUrl: data.imageUrl,
                prompt: prompt,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Image generation failed:', error);
            return {
                success: false,
                error: error.message,
                prompt: prompt
            };
        }
    }

    /**
     * Generate all images for a category
     */
    async generateCategoryImages(category) {
        const prompts = this.prompts[category];
        if (!prompts) {
            console.error(`Category ${category} not found`);
            return [];
        }

        const dimensions = this.dimensions[prompts[0].category] || this.dimensions.hero;
        const results = [];

        for (const promptData of prompts) {
            console.log(`Generating ${category} image: ${promptData.seed}`);
            const result = await this.generateImage(
                promptData.prompt,
                dimensions.ratio,
                promptData.seed
            );
            results.push({
                ...result,
                category: promptData.category,
                seed: promptData.seed
            });
            
            // Add delay to avoid rate limiting
            await this.delay(2000);
        }

        return results;
    }

    /**
     * Generate all missing images for the site
     */
    async generateAllImages() {
        const categories = Object.keys(this.prompts);
        const allResults = {};

        for (const category of categories) {
            console.log(`Processing category: ${category}`);
            allResults[category] = await this.generateCategoryImages(category);
        }

        return allResults;
    }

    /**
     * Download and save image locally
     */
    async downloadImage(imageUrl, fileName, directory = 'generated') {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            
            // Create object URL for local usage
            const objectUrl = URL.createObjectURL(blob);
            
            // Store reference for later use
            this.storeImageReference(fileName, objectUrl, directory);
            
            return objectUrl;
        } catch (error) {
            console.error('Failed to download image:', error);
            return null;
        }
    }

    /**
     * Store image reference in localStorage for persistence
     */
    storeImageReference(fileName, url, directory) {
        const storage = localStorage.getItem('generatedImages') || '{}';
        const images = JSON.parse(storage);
        
        images[fileName] = {
            url: url,
            directory: directory,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('generatedImages', JSON.stringify(images));
    }

    /**
     * Replace broken images in DOM
     */
    async replaceBrokenImages() {
        const images = document.querySelectorAll('img');
        const brokenImages = [];

        images.forEach(img => {
            img.onerror = async () => {
                const alt = img.alt || 'professional beauty equipment';
                const width = img.width || 600;
                const height = img.height || 400;
                const aspectRatio = `${width}:${height}`;

                // Generate contextual prompt based on alt text and location
                const prompt = this.generateContextualPrompt(alt, img.src);
                
                // Generate replacement image
                const result = await this.generateImage(prompt, aspectRatio);
                
                if (result.success) {
                    img.src = result.imageUrl;
                    console.log(`Replaced broken image: ${img.alt}`);
                }
            };
        });
    }

    /**
     * Generate contextual prompt based on image context
     */
    generateContextualPrompt(altText, originalSrc) {
        const context = {
            'project': 'Modern beauty clinic project showcase, Davidov equipment installation, professional photography',
            'blog': 'Beauty treatment article illustration, professional medical aesthetic, informative visual',
            'avatar': 'Professional headshot of satisfied clinic owner, Israeli business person, friendly expression',
            'brand': 'Professional beauty equipment brand logo, clean design, medical aesthetic',
            'background': 'Modern beauty clinic interior, soft lighting, professional atmosphere'
        };

        // Determine context from src path
        let promptContext = 'Professional beauty clinic equipment, medical aesthetic, high quality';
        
        for (const [key, value] of Object.entries(context)) {
            if (originalSrc.includes(key)) {
                promptContext = value;
                break;
            }
        }

        return `${altText}, ${promptContext}, photorealistic, professional photography`;
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Initialize image generation on page load
     */
    async init() {
        console.log('Initializing Image Generation Service...');
        
        // Check for broken images and replace them
        await this.replaceBrokenImages();
        
        // Generate any missing category images
        const storage = localStorage.getItem('generatedImages');
        if (!storage) {
            console.log('No cached images found. Generating initial set...');
            // Uncomment to generate all images on first load
            // await this.generateAllImages();
        }
        
        console.log('Image Generation Service initialized');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageGenerationService;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageGenerator = new ImageGenerationService();
        window.imageGenerator.init();
    });
}