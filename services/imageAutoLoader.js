/**
 * Automatic Image Loading and Generation Service
 * Detects missing images across the site and generates them automatically
 */

class ImageAutoLoader {
    constructor() {
        this.processedImages = new Set();
        this.imageGenerationEnabled = true;
        this.observer = null;
        
        // Categories for different types of missing images
        this.imageCategories = {
            // Equipment and devices
            'device': ['device', 'equipment', 'machine', 'laser', 'system'],
            'clinic': ['clinic', 'treatment', 'room', 'medical', 'spa'],
            'staff': ['staff', 'doctor', 'professional', 'team', 'consultation'],
            'training': ['training', 'education', 'learning', 'workshop'],
            'service': ['service', 'procedure', 'treatment'],
            'product': ['product', 'brand', 'logo', 'corporate'],
            'testimonial': ['client', 'testimonial', 'customer', 'review'],
            'blog': ['blog', 'article', 'news', 'post']
        };
    }

    /**
     * Initialize the auto-loader
     */
    async init() {
        console.log('Image Auto-Loader initialized');
        
        // Wait for image generator to be ready
        await this.waitForServices();
        
        // Process existing images
        this.processExistingImages();
        
        // Set up observer for dynamically added images
        this.setupImageObserver();
        
        // Set up error handlers for broken images
        this.setupErrorHandlers();
        
        return true;
    }

    /**
     * Wait for required services to be available
     */
    async waitForServices() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.beautyImageGenerator && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.beautyImageGenerator) {
            console.warn('Beauty Image Generator not available - using fallbacks');
            this.imageGenerationEnabled = false;
        }
    }

    /**
     * Process all existing images on the page
     */
    processExistingImages() {
        const images = document.querySelectorAll('img');
        console.log(`Processing ${images.length} existing images`);
        
        images.forEach(img => this.processImage(img));
    }

    /**
     * Set up mutation observer for dynamically added images
     */
    setupImageObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the node itself is an image
                            if (node.tagName === 'IMG') {
                                this.processImage(node);
                            }
                            // Check for images in added subtree
                            const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                            images.forEach(img => this.processImage(img));
                        }
                    });
                }
                
                // Also check for src attribute changes
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    if (mutation.target.tagName === 'IMG') {
                        this.processImage(mutation.target);
                    }
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    /**
     * Set up global error handlers for broken images
     */
    setupErrorHandlers() {
        // Handle existing images that fail to load
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleBrokenImage(e.target);
            }
        }, true);
        
        // Also set up error handlers for images added later
        const originalAddEventListener = HTMLImageElement.prototype.addEventListener;
        HTMLImageElement.prototype.addEventListener = function(event, handler, options) {
            if (event === 'error' || event === 'load') {
                // Let our handler run first
                setTimeout(() => {
                    if (this.naturalWidth === 0 && this.naturalHeight === 0 && this.complete) {
                        window.imageAutoLoader?.handleBrokenImage(this);
                    }
                }, 100);
            }
            return originalAddEventListener.call(this, event, handler, options);
        };
    }

    /**
     * Process a single image element
     */
    async processImage(img) {
        const src = img.src || img.getAttribute('src');
        if (!src || this.processedImages.has(src)) {
            return;
        }

        this.processedImages.add(src);

        // Check if image needs generation
        if (this.shouldGenerateImage(img, src)) {
            await this.generateImageForElement(img);
        }
    }

    /**
     * Determine if an image should be generated
     */
    shouldGenerateImage(img, src) {
        // Skip data URLs (already generated)
        if (src.startsWith('data:')) return false;
        
        // Skip external URLs
        if (src.startsWith('http') && !src.includes(window.location.host)) return false;
        
        // Check for common placeholder patterns
        const placeholderPatterns = [
            'placeholder',
            'missing',
            'not-found',
            '404',
            'blank',
            'default'
        ];
        
        if (placeholderPatterns.some(pattern => src.toLowerCase().includes(pattern))) {
            return true;
        }

        // Check alt text and surrounding context
        const alt = img.getAttribute('alt') || '';
        const category = this.detectImageCategory(src, alt, img);
        
        return category !== null;
    }

    /**
     * Detect image category from context
     */
    detectImageCategory(src, alt, imgElement) {
        const context = (src + ' ' + alt + ' ' + this.getElementContext(imgElement)).toLowerCase();
        
        for (const [category, keywords] of Object.entries(this.imageCategories)) {
            if (keywords.some(keyword => context.includes(keyword))) {
                return category;
            }
        }
        
        // Check if image is actually missing (404, broken)
        return this.isImageMissingOrBroken(imgElement) ? 'device' : null;
    }

    /**
     * Get contextual information around an image element
     */
    getElementContext(imgElement) {
        let context = '';
        
        // Get parent element classes and IDs
        const parent = imgElement.parentElement;
        if (parent) {
            context += parent.className + ' ' + parent.id + ' ';
            
            // Get text content from nearby elements
            const siblings = Array.from(parent.children);
            siblings.forEach(sibling => {
                if (sibling !== imgElement && sibling.textContent) {
                    context += sibling.textContent.substring(0, 100) + ' ';
                }
            });
        }
        
        return context;
    }

    /**
     * Check if an image is missing or broken
     */
    isImageMissingOrBroken(imgElement) {
        // Image hasn't loaded and is complete (meaning it failed)
        if (imgElement.complete && imgElement.naturalWidth === 0) {
            return true;
        }
        
        // Check for common broken image indicators
        const src = imgElement.src;
        if (!src || src.includes('404') || src.includes('missing')) {
            return true;
        }
        
        return false;
    }

    /**
     * Generate image for a specific element
     */
    async generateImageForElement(img) {
        if (!this.imageGenerationEnabled || !window.beautyImageGenerator) {
            console.log('Image generation disabled or service unavailable');
            return;
        }

        const src = img.src || img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        const category = this.detectImageCategory(src, alt, img);
        
        if (!category) return;

        try {
            console.log(`Generating image for category: ${category}`);
            const generatedUrl = await window.beautyImageGenerator.generateImage(category);
            
            // Smoothly replace the image
            this.replaceImageSmoothly(img, generatedUrl);
            
        } catch (error) {
            console.error('Error generating image:', error);
        }
    }

    /**
     * Handle broken images
     */
    async handleBrokenImage(img) {
        console.log('Handling broken image:', img.src);
        
        // Mark as processed to avoid loops
        this.processedImages.add(img.src);
        
        // Generate replacement image
        await this.generateImageForElement(img);
    }

    /**
     * Smoothly replace image with fade effect
     */
    replaceImageSmoothly(img, newSrc) {
        // Add fade out effect
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0.5';
        
        // Create new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            // Replace source and fade in
            img.src = newSrc;
            img.style.opacity = '1';
            
            // Add generated attribute
            img.setAttribute('data-auto-generated', 'true');
            
            console.log('Image replaced successfully');
        };
        
        newImg.onerror = () => {
            // Restore opacity if replacement fails
            img.style.opacity = '1';
            console.error('Failed to load generated image');
        };
        
        newImg.src = newSrc;
    }

    /**
     * Process images in a specific container
     */
    processContainer(container) {
        const images = container.querySelectorAll('img');
        images.forEach(img => this.processImage(img));
    }

    /**
     * Force regenerate all images
     */
    async regenerateAllImages() {
        this.processedImages.clear();
        this.processExistingImages();
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.processedImages.clear();
    }
}

// Initialize and expose globally
window.imageAutoLoader = new ImageAutoLoader();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageAutoLoader.init();
    });
} else {
    window.imageAutoLoader.init();
}

console.log('Image Auto-Loader service loaded');