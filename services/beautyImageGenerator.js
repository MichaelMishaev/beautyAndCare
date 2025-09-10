/**
 * Beauty Equipment Image Generation Service
 * Generates professional medical equipment and clinic images using AI
 */

class BeautyImageGenerator {
    constructor() {
        this.apiKey = 'demo-mode'; // In production, this would be a real API key
        this.isDemo = true; // Set to false in production
        this.generatedImages = new Map();
        this.imageQueue = [];
        this.isGenerating = false;
        
        // Image generation templates
        this.templates = {
            // Equipment categories
            'laser_hair_removal': {
                prompt: "Professional diode laser hair removal machine, medical device, modern clinic setting, high-tech equipment, clean white background, professional lighting, medical grade device, 4K resolution",
                style: "medical-professional"
            },
            'body_contouring': {
                prompt: "Advanced body contouring machine, aesthetic medical device, modern spa equipment, professional medical technology, clean clinical environment, high-end medical device, 4K resolution",
                style: "medical-professional"
            },
            'skin_treatment': {
                prompt: "Professional skin treatment device, dermatology equipment, medical aesthetic machine, modern clinic technology, clean medical setting, professional grade equipment, 4K resolution",
                style: "medical-professional"
            },
            
            // Clinic environments
            'treatment_room': {
                prompt: "Modern medical spa treatment room, professional clinic interior, clean medical environment, treatment bed, medical equipment, professional lighting, luxurious medical spa, 4K resolution",
                style: "interior-medical"
            },
            'consultation_room': {
                prompt: "Professional medical consultation room, doctor consultation space, modern clinic interior, medical office, professional medical environment, clean design, 4K resolution",
                style: "interior-medical"
            },
            'reception_area': {
                prompt: "Modern medical spa reception area, professional clinic waiting room, luxury medical center lobby, contemporary medical office design, 4K resolution",
                style: "interior-medical"
            },
            
            // Training and staff
            'training_session': {
                prompt: "Professional medical training session, doctor training on equipment, medical education, professional learning environment, modern clinic setting, 4K resolution",
                style: "professional-medical"
            },
            'medical_staff': {
                prompt: "Professional medical staff in clinic, doctor in white coat, medical professionals, modern clinic environment, professional medical setting, 4K resolution",
                style: "professional-medical"
            },
            
            // Equipment details
            'device_closeup': {
                prompt: "Close-up of professional medical device interface, high-tech medical equipment screen, modern medical technology, professional medical device, 4K resolution",
                style: "product-medical"
            },
            'clinic_overview': {
                prompt: "Modern medical spa overview, professional clinic interior, multiple treatment rooms, luxury medical facility, contemporary design, 4K resolution",
                style: "architectural-medical"
            }
        };
    }

    /**
     * Initialize the image generation service
     */
    async init() {
        console.log('Beauty Image Generator initialized');
        
        if (this.isDemo) {
            console.log('Running in demo mode - using placeholder images');
            this.createDemoImages();
        }
        
        // Auto-generate missing images on page load
        this.autoGenerateImages();
        
        return true;
    }

    /**
     * Generate an image for a specific category and device
     */
    async generateImage(category, deviceId = null, customPrompt = null) {
        const cacheKey = `${category}_${deviceId || 'default'}`;
        
        // Check if already generated
        if (this.generatedImages.has(cacheKey)) {
            return this.generatedImages.get(cacheKey);
        }

        // Add to generation queue
        return new Promise((resolve) => {
            this.imageQueue.push({
                category,
                deviceId,
                customPrompt,
                cacheKey,
                resolve
            });
            
            this.processQueue();
        });
    }

    /**
     * Process the image generation queue
     */
    async processQueue() {
        if (this.isGenerating || this.imageQueue.length === 0) {
            return;
        }

        this.isGenerating = true;

        while (this.imageQueue.length > 0) {
            const item = this.imageQueue.shift();
            
            try {
                const imageUrl = await this.generateSingleImage(item);
                this.generatedImages.set(item.cacheKey, imageUrl);
                item.resolve(imageUrl);
            } catch (error) {
                console.error('Error generating image:', error);
                // Fallback to placeholder
                const placeholderUrl = this.createPlaceholder(item.category);
                this.generatedImages.set(item.cacheKey, placeholderUrl);
                item.resolve(placeholderUrl);
            }
            
            // Small delay between generations
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.isGenerating = false;
    }

    /**
     * Generate a single image
     */
    async generateSingleImage(item) {
        if (this.isDemo) {
            return this.createDemoImage(item.category, item.deviceId);
        }

        // In production, this would call a real image generation API
        const template = this.templates[item.category] || this.templates['device_closeup'];
        const prompt = item.customPrompt || template.prompt;

        // Placeholder for actual API call
        // const response = await fetch('/api/generate-image', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ prompt, style: template.style })
        // });
        
        // return response.json().imageUrl;
        
        return this.createDemoImage(item.category, item.deviceId);
    }

    /**
     * Create demo images with SVG placeholders
     */
    createDemoImages() {
        console.log('Creating demo images...');
        
        // Generate demo images for each category
        Object.keys(this.templates).forEach(category => {
            const imageUrl = this.createDemoImage(category);
            this.generatedImages.set(category, imageUrl);
        });
    }

    /**
     * Create a professional-looking SVG placeholder
     */
    createDemoImage(category, deviceId = null) {
        const template = this.templates[category] || this.templates['device_closeup'];
        const width = 800;
        const height = 600;
        
        // Color schemes for different categories
        const colorSchemes = {
            'medical-professional': { bg: '#f8f9fa', primary: '#007bff', secondary: '#6c757d' },
            'interior-medical': { bg: '#ffffff', primary: '#28a745', secondary: '#17a2b8' },
            'professional-medical': { bg: '#e9ecef', primary: '#ffc107', secondary: '#fd7e14' },
            'product-medical': { bg: '#f1f3f4', primary: '#6f42c1', secondary: '#e83e8c' },
            'architectural-medical': { bg: '#fff3cd', primary: '#856404', secondary: '#721c24' }
        };
        
        const colors = colorSchemes[template.style] || colorSchemes['medical-professional'];
        
        // Get category icon
        const icon = this.getCategoryIcon(category);
        
        const svgContent = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad${category}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.1" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                    </filter>
                </defs>
                
                <!-- Background -->
                <rect width="100%" height="100%" fill="url(#grad${category})"/>
                
                <!-- Grid pattern -->
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.secondary}" stroke-width="1" opacity="0.1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <!-- Main icon -->
                <circle cx="${width/2}" cy="${height/2 - 50}" r="80" fill="${colors.primary}" opacity="0.2" filter="url(#shadow)"/>
                <text x="${width/2}" y="${height/2 - 35}" font-family="Arial, sans-serif" font-size="60" fill="${colors.primary}" text-anchor="middle">${icon}</text>
                
                <!-- Category label -->
                <rect x="${width/2 - 150}" y="${height/2 + 50}" width="300" height="60" rx="30" fill="white" opacity="0.9" filter="url(#shadow)"/>
                <text x="${width/2}" y="${height/2 + 85}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${colors.secondary}" text-anchor="middle">${this.formatCategoryName(category)}</text>
                
                <!-- Professional badge -->
                <rect x="20" y="20" width="120" height="30" rx="15" fill="${colors.primary}" opacity="0.8"/>
                <text x="80" y="40" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">PROFESSIONAL</text>
                
                <!-- Resolution badge -->
                <rect x="${width - 80}" y="${height - 40}" width="60" height="20" rx="10" fill="${colors.secondary}" opacity="0.7"/>
                <text x="${width - 50}" y="${height - 27}" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">4K READY</text>
            </svg>
        `;
        
        // Convert SVG to data URL
        const encodedSvg = encodeURIComponent(svgContent);
        return `data:image/svg+xml,${encodedSvg}`;
    }

    /**
     * Get icon for category
     */
    getCategoryIcon(category) {
        const icons = {
            'laser_hair_removal': '⚡',
            'body_contouring': '💎',
            'skin_treatment': '✨',
            'treatment_room': '🏥',
            'consultation_room': '👨‍⚕️',
            'reception_area': '🏢',
            'training_session': '📚',
            'medical_staff': '👩‍⚕️',
            'device_closeup': '🔬',
            'clinic_overview': '🏨'
        };
        return icons[category] || '🔧';
    }

    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        return category
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Auto-generate images for missing elements
     */
    autoGenerateImages() {
        // Find all img elements that need generated images
        const images = document.querySelectorAll('img[src*="assets/images"]');
        
        images.forEach(img => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            
            // Check if image needs generation
            if (this.shouldGenerateImage(src, alt)) {
                const category = this.detectCategory(src, alt);
                if (category) {
                    this.generateImage(category).then(generatedUrl => {
                        img.src = generatedUrl;
                        img.setAttribute('data-generated', 'true');
                    });
                }
            }
        });
    }

    /**
     * Determine if an image should be generated
     */
    shouldGenerateImage(src, alt) {
        // Skip if already generated
        if (src.startsWith('data:image/svg+xml')) return false;
        
        // Generate for missing or placeholder images
        return src.includes('device-main') || 
               src.includes('treatment-room') || 
               src.includes('service-consultation') ||
               src.includes('training-session') ||
               alt.toLowerCase().includes('equipment') ||
               alt.toLowerCase().includes('device') ||
               alt.toLowerCase().includes('clinic') ||
               alt.toLowerCase().includes('treatment');
    }

    /**
     * Detect category from image source and alt text
     */
    detectCategory(src, alt) {
        const text = (src + ' ' + alt).toLowerCase();
        
        if (text.includes('laser') || text.includes('hair')) return 'laser_hair_removal';
        if (text.includes('body') || text.includes('contouring')) return 'body_contouring';
        if (text.includes('skin') || text.includes('treatment')) return 'skin_treatment';
        if (text.includes('consultation')) return 'consultation_room';
        if (text.includes('training')) return 'training_session';
        if (text.includes('device') || text.includes('equipment')) return 'device_closeup';
        if (text.includes('clinic') || text.includes('room')) return 'treatment_room';
        
        return 'device_closeup';
    }

    /**
     * Generate images for catalog items
     */
    async generateCatalogImages(devices) {
        const promises = devices.map(async device => {
            const imageUrl = await this.generateImage(device.category, device.id);
            return {
                deviceId: device.id,
                imageUrl: imageUrl
            };
        });
        
        return Promise.all(promises);
    }

    /**
     * Create simple placeholder for fallback
     */
    createPlaceholder(category) {
        const width = 400;
        const height = 300;
        const icon = this.getCategoryIcon(category);
        
        const svgContent = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                <circle cx="${width/2}" cy="${height/2}" r="50" fill="#dee2e6"/>
                <text x="${width/2}" y="${height/2 + 8}" font-family="Arial" font-size="40" text-anchor="middle">${icon}</text>
            </svg>
        `;
        
        return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    }

    /**
     * Replace broken images with generated ones
     */
    replaceBrokenImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.onerror = () => {
                const category = this.detectCategory(img.src, img.alt || '');
                const placeholder = this.createPlaceholder(category);
                img.src = placeholder;
            };
        });
    }
}

// Initialize and expose globally
window.beautyImageGenerator = new BeautyImageGenerator();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.beautyImageGenerator.init();
    });
} else {
    window.beautyImageGenerator.init();
}

console.log('Beauty Image Generator service loaded');