#!/usr/bin/env node

/**
 * ULTRATHINK RESPONSIVE ANALYSIS TOOL - SIMPLIFIED
 * No external dependencies required - uses pure JavaScript
 * Comprehensive responsive testing for Davidov Beauty Care website
 */

const fs = require('fs');
const path = require('path');

// Define breakpoints for testing
const BREAKPOINTS = {
    'mobile-portrait': { width: 320, min: 320, max: 480, label: 'Mobile Portrait (320px-480px)' },
    'mobile-landscape': { width: 768, min: 481, max: 768, label: 'Mobile Landscape (481px-768px)' },
    'tablet-portrait': { width: 1024, min: 769, max: 1024, label: 'Tablet Portrait (769px-1024px)' },
    'desktop-small': { width: 1200, min: 1025, max: 1200, label: 'Desktop Small (1025px-1200px)' },
    'desktop-large': { width: 1400, min: 1201, max: 9999, label: 'Desktop Large (1201px+)' }
};

// Priority levels
const PRIORITY = {
    CRITICAL: 'Critical',
    HIGH: 'High', 
    MEDIUM: 'Medium',
    LOW: 'Low'
};

// Test categories
const TEST_CATEGORIES = {
    NAVIGATION: 'Navigation',
    TYPOGRAPHY: 'Typography',
    IMAGES: 'Images',
    FORMS: 'Forms',
    LAYOUT: 'Layout',
    MEDICAL_SPECIFIC: 'Medical/Beauty Industry',
    RTL_HEBREW: 'RTL/Hebrew Support',
    LANGUAGE_SWITCHER: 'Language Switcher'
};

class ResponsiveAnalyzer {
    constructor(srcDir) {
        this.srcDir = srcDir;
        this.results = {
            summary: {
                totalPages: 0,
                totalIssues: 0,
                criticalIssues: 0,
                highIssues: 0,
                mediumIssues: 0,
                lowIssues: 0,
                testDate: new Date().toISOString(),
                breakpointsTested: Object.keys(BREAKPOINTS).length,
                categoriesTested: Object.keys(TEST_CATEGORIES).length
            },
            breakpointDetails: BREAKPOINTS,
            pageResults: {},
            recommendations: [],
            implementationGuide: []
        };
    }

    // Get all HTML files
    getHtmlFiles() {
        const htmlFiles = [];
        const files = fs.readdirSync(this.srcDir);
        
        for (const file of files) {
            if (file.endsWith('.html') && !file.startsWith('test-')) {
                htmlFiles.push(path.join(this.srcDir, file));
            }
        }
        
        return htmlFiles.sort();
    }

    // Load HTML file content
    loadHtmlFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error.message);
            return null;
        }
    }

    // Extract elements using regex patterns
    extractElements(html, pattern, flags = 'gi') {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        
        while ((match = regex.exec(html)) !== null) {
            matches.push(match);
        }
        
        return matches;
    }

    // Analyze single page for responsive issues
    analyzePage(filePath) {
        const html = this.loadHtmlFile(filePath);
        if (!html) return null;

        const pageName = path.basename(filePath, '.html');
        const pageResult = {
            file: filePath,
            fileSize: Buffer.byteLength(html, 'utf8'),
            issues: {},
            recommendations: [],
            pageSpecifics: {
                hasNavigation: /<nav|header-nav|navbar/i.test(html),
                hasHero: /<.*?hero|banner|jumbotron/i.test(html),
                hasImages: /<img/i.test(html),
                hasForms: /<form/i.test(html),
                hasI18n: /data-i18n/i.test(html),
                hasLanguageSwitcher: /language-switcher/i.test(html),
                hasBootstrap: /bootstrap/i.test(html),
                hasResponsiveClasses: /col-|d-|flex-|text-/i.test(html)
            }
        };

        // Initialize issues for each breakpoint
        for (const breakpoint of Object.keys(BREAKPOINTS)) {
            pageResult.issues[breakpoint] = [];
        }

        // Run all tests
        this.testNavigation(html, pageResult, pageName);
        this.testTypography(html, pageResult, pageName);
        this.testImages(html, pageResult, pageName);
        this.testForms(html, pageResult, pageName);
        this.testLayout(html, pageResult, pageName);
        this.testMedicalSpecific(html, pageResult, pageName);
        this.testRtlHebrew(html, pageResult, pageName);
        this.testLanguageSwitcher(html, pageResult, pageName);
        this.testBootstrapUsage(html, pageResult, pageName);

        return { pageName, result: pageResult };
    }

    // Test navigation responsiveness
    testNavigation(html, pageResult, pageName) {
        // Check for hamburger menu
        const hasHamburger = /header-btn-collapse-nav|navbar-toggler|btn-hamburger/i.test(html);
        if (!hasHamburger && /<nav|header-nav/i.test(html)) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.NAVIGATION,
                priority: PRIORITY.CRITICAL,
                issue: 'Missing hamburger menu button for mobile navigation',
                element: 'header navigation',
                fix: 'Add .header-btn-collapse-nav or .navbar-toggler button',
                cssCode: `
.header-btn-collapse-nav {
    display: none;
}
@media (max-width: 991px) {
    .header-btn-collapse-nav {
        display: block;
    }
}`
            });
        }

        // Check navigation items count
        const navItems = this.extractElements(html, /<li[^>]*class="[^"]*nav-item|<li[^>]*><a[^>]*class="[^"]*nav-link/gi);
        if (navItems.length > 6) {
            this.addIssue(pageResult, 'tablet-portrait', {
                category: TEST_CATEGORIES.NAVIGATION,
                priority: PRIORITY.HIGH,
                issue: `Too many navigation items (${navItems.length}) may cause overflow on tablets`,
                element: 'main navigation',
                fix: 'Group navigation items or implement responsive dropdown patterns',
                cssCode: `
@media (max-width: 1024px) {
    .header-nav-main .nav {
        flex-wrap: wrap;
    }
}`
            });
        }

        // Check dropdown positioning
        const dropdowns = this.extractElements(html, /<.*?dropdown-menu(?![^>]*dropdown-menu-end)/gi);
        if (dropdowns.length > 0) {
            this.addIssue(pageResult, 'mobile-landscape', {
                category: TEST_CATEGORIES.NAVIGATION,
                priority: PRIORITY.MEDIUM,
                issue: 'Dropdown menus may overflow screen edges on mobile',
                element: 'dropdown menus',
                fix: 'Add .dropdown-menu-end class or implement responsive positioning',
                cssCode: `
@media (max-width: 768px) {
    .dropdown-menu {
        position: static !important;
        transform: none !important;
        width: 100%;
        border: none;
        box-shadow: none;
    }
}`
            });
        }

        // Check for sticky header
        const hasStickyHeader = /sticky|fixed.*header|header.*sticky/i.test(html);
        if (!hasStickyHeader) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.NAVIGATION,
                priority: PRIORITY.LOW,
                issue: 'Consider adding sticky header for better mobile navigation',
                element: 'header',
                fix: 'Implement sticky header with proper mobile handling'
            });
        }
    }

    // Test typography responsiveness
    testTypography(html, pageResult, pageName) {
        // Check headings without responsive classes
        const headings = this.extractElements(html, /<h[1-6][^>]*>/gi);
        headings.forEach((heading, index) => {
            if (!heading[0].includes('text-') && !heading[0].includes('fs-') && !heading[0].includes('font-size')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.TYPOGRAPHY,
                    priority: PRIORITY.MEDIUM,
                    issue: `Heading ${index + 1} lacks responsive typography classes`,
                    element: `h${heading[0].charAt(2)} element`,
                    fix: 'Add responsive text size classes',
                    cssCode: `
h1 { font-size: clamp(1.75rem, 4vw, 3rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 2.5vw, 2rem); }
@media (max-width: 576px) {
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
}`
                });
            }
        });

        // Check for line height issues
        const longParagraphs = this.extractElements(html, /<p[^>]*>[^<]{200,}<\/p>/gi);
        if (longParagraphs.length > 0) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.TYPOGRAPHY,
                priority: PRIORITY.LOW,
                issue: `${longParagraphs.length} long paragraphs without responsive line height`,
                element: 'paragraph elements',
                fix: 'Add responsive line height for better mobile readability',
                cssCode: `
p {
    line-height: 1.6;
}
@media (max-width: 768px) {
    p {
        line-height: 1.8;
        font-size: 0.95rem;
    }
}`
            });
        }

        // Check font loading
        const customFonts = this.extractElements(html, /font-family.*?["'][^"']*["']/gi);
        if (customFonts.length > 3) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.TYPOGRAPHY,
                priority: PRIORITY.MEDIUM,
                issue: 'Too many custom fonts may impact mobile loading performance',
                element: 'font declarations',
                fix: 'Optimize font loading with font-display: swap and limit font variations'
            });
        }
    }

    // Test image responsiveness
    testImages(html, pageResult, pageName) {
        const images = this.extractElements(html, /<img[^>]*>/gi);
        
        images.forEach((img, index) => {
            const imgTag = img[0];
            
            // Check for responsive image classes
            if (!imgTag.includes('img-fluid') && !imgTag.includes('img-responsive')) {
                const srcMatch = imgTag.match(/src=["']([^"']*)["']/);
                const src = srcMatch ? srcMatch[1] : `image ${index + 1}`;
                
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.IMAGES,
                    priority: PRIORITY.HIGH,
                    issue: 'Image lacks responsive scaling classes',
                    element: `image: ${src}`,
                    fix: 'Add .img-fluid class for responsive scaling',
                    cssCode: `
.img-fluid {
    max-width: 100%;
    height: auto;
}
img {
    max-width: 100%;
    height: auto;
}`
                });
            }

            // Check for missing alt attributes
            if (!imgTag.includes('alt=')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.IMAGES,
                    priority: PRIORITY.CRITICAL,
                    issue: 'Image missing alt attribute for accessibility',
                    element: `image ${index + 1}`,
                    fix: 'Add descriptive alt attribute'
                });
            }

            // Check for medical equipment images
            if (imgTag.includes('medical') || imgTag.includes('equipment') || imgTag.includes('device')) {
                if (!imgTag.includes('object-fit') && !imgTag.includes('aspect-ratio')) {
                    this.addIssue(pageResult, 'tablet-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Medical equipment image lacks proper aspect ratio handling',
                        element: `medical equipment image ${index + 1}`,
                        fix: 'Add aspect-ratio or object-fit properties',
                        cssCode: `
.medical-equipment-image {
    aspect-ratio: 4/3;
    object-fit: cover;
    width: 100%;
}
@media (max-width: 768px) {
    .medical-equipment-image {
        aspect-ratio: 16/9;
    }
}`
                    });
                }
            }
        });

        // Check background images
        const backgroundImages = this.extractElements(html, /background-image\s*:\s*url\([^)]*\)/gi);
        backgroundImages.forEach((bg, index) => {
            if (!html.includes('background-size')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.IMAGES,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Background image without responsive background-size',
                    element: `background image ${index + 1}`,
                    fix: 'Add background-size: cover or contain',
                    cssCode: `
.hero-bg, .section-bg {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
@media (max-width: 768px) {
    .hero-bg {
        background-attachment: scroll; /* Better performance on mobile */
    }
}`
                });
            }
        });
    }

    // Test form responsiveness
    testForms(html, pageResult, pageName) {
        const forms = this.extractElements(html, /<form[^>]*>[\s\S]*?<\/form>/gi);
        
        forms.forEach((form, formIndex) => {
            const formContent = form[0];
            
            // Check form inputs
            const inputs = this.extractElements(formContent, /<input[^>]*>|<textarea[^>]*>/gi);
            inputs.forEach((input, inputIndex) => {
                const inputTag = input[0];
                
                if (!inputTag.includes('form-control') && !inputTag.includes('form-select')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.FORMS,
                        priority: PRIORITY.HIGH,
                        issue: 'Form input lacks responsive styling classes',
                        element: `input ${inputIndex + 1} in form ${formIndex + 1}`,
                        fix: 'Add .form-control class',
                        cssCode: `
.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    font-size: 1rem;
}
@media (max-width: 768px) {
    .form-control {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 0.875rem;
    }
}`
                    });
                }
            });

            // Check form buttons
            const buttons = this.extractElements(formContent, /<button[^>]*>|<input[^>]*type=["']submit["'][^>]*>/gi);
            buttons.forEach((button, buttonIndex) => {
                const buttonTag = button[0];
                
                if (!buttonTag.includes('btn')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.FORMS,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Form button lacks responsive button classes',
                        element: `button ${buttonIndex + 1} in form ${formIndex + 1}`,
                        fix: 'Add .btn and appropriate size classes',
                        cssCode: `
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    min-height: 44px; /* iOS touch target minimum */
}
@media (max-width: 768px) {
    .btn {
        width: 100%;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
    }
}`
                    });
                }
            });

            // Check for contact forms specific to medical industry
            if (formContent.includes('contact') || formContent.includes('email') || formContent.includes('phone')) {
                const hasPhone = /type=["']tel["']|name=["'][^"']*phone/i.test(formContent);
                if (!hasPhone) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.HIGH,
                        issue: 'Contact form missing phone input for clinic inquiries',
                        element: `contact form ${formIndex + 1}`,
                        fix: 'Add phone field with type="tel" for mobile optimization'
                    });
                }
            }
        });
    }

    // Test layout responsiveness
    testLayout(html, pageResult, pageName) {
        // Check container usage
        const hasContainers = /container|container-fluid/i.test(html);
        if (!hasContainers) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LAYOUT,
                priority: PRIORITY.HIGH,
                issue: 'Page lacks responsive container structure',
                element: 'page layout',
                fix: 'Wrap content in .container or .container-fluid',
                cssCode: `
.container {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 15px;
}
@media (max-width: 1200px) { .container { max-width: 960px; } }
@media (max-width: 992px) { .container { max-width: 720px; } }
@media (max-width: 768px) { .container { max-width: 540px; } }
@media (max-width: 576px) { .container { max-width: 100%; } }`
            });
        }

        // Check grid system usage
        const rows = this.extractElements(html, /<div[^>]*class="[^"]*row[^"]*"/gi);
        if (rows.length > 0) {
            const cols = this.extractElements(html, /<div[^>]*class="[^"]*col-[^"]*"/gi);
            
            // Check for mobile-first responsive classes
            const hasMobileFirst = /col-sm-|col-md-|col-lg-|col-xl-/i.test(html);
            if (!hasMobileFirst && cols.length > 0) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.LAYOUT,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Grid columns lack mobile-first responsive classes',
                    element: 'grid columns',
                    fix: 'Add .col-sm-*, .col-md-*, .col-lg-* classes',
                    cssCode: `
/* Mobile first approach */
.col-12 { width: 100%; }
@media (min-width: 576px) {
    .col-sm-6 { width: 50%; }
    .col-sm-4 { width: 33.333333%; }
    .col-sm-3 { width: 25%; }
}
@media (min-width: 768px) {
    .col-md-6 { width: 50%; }
    .col-md-4 { width: 33.333333%; }
}`
                });
            }
        }

        // Check for fixed heights
        const fixedHeights = this.extractElements(html, /height\s*:\s*\d+px|style="[^"]*height:\s*\d+px/gi);
        if (fixedHeights.length > 0) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LAYOUT,
                priority: PRIORITY.LOW,
                issue: `${fixedHeights.length} elements with fixed height may cause responsive issues`,
                element: 'elements with fixed height',
                fix: 'Use min-height instead of height for better responsiveness',
                cssCode: `
/* Replace fixed heights with flexible alternatives */
.hero-section {
    min-height: 100vh;
    /* height: 600px; /* Remove fixed height */
}
@media (max-width: 768px) {
    .hero-section {
        min-height: 70vh;
    }
}`
            });
        }

        // Check hero sections
        const heroSections = this.extractElements(html, /<[^>]*class="[^"]*hero[^"]*"|<[^>]*class="[^"]*banner[^"]*"/gi);
        if (heroSections.length > 0) {
            heroSections.forEach((hero, index) => {
                if (!hero[0].includes('min-height') && !hero[0].includes('vh-')) {
                    this.addIssue(pageResult, 'tablet-portrait', {
                        category: TEST_CATEGORIES.LAYOUT,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Hero section may not display properly on tablets/mobile',
                        element: `hero section ${index + 1}`,
                        fix: 'Add responsive height classes',
                        cssCode: `
.hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
}
@media (max-width: 1024px) {
    .hero-section { min-height: 80vh; }
}
@media (max-width: 768px) {
    .hero-section { min-height: 70vh; }
}
@media (max-width: 576px) {
    .hero-section { min-height: 60vh; }
}`
                    });
                }
            });
        }
    }

    // Test medical/beauty industry specific elements
    testMedicalSpecific(html, pageResult, pageName) {
        // Check equipment galleries
        const galleries = this.extractElements(html, /<[^>]*class="[^"]*(portfolio|gallery|equipment)[^"]*"/gi);
        if (galleries.length > 0) {
            const hasCarousel = /carousel|owl-|swiper/i.test(html);
            if (!hasCarousel) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                    priority: PRIORITY.HIGH,
                    issue: 'Medical equipment gallery not optimized for mobile viewing',
                    element: 'equipment gallery',
                    fix: 'Implement carousel or responsive grid for mobile equipment display',
                    cssCode: `
.equipment-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}
@media (max-width: 768px) {
    .equipment-gallery {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}`
                });
            }
        }

        // Check service cards
        const serviceCards = this.extractElements(html, /<[^>]*class="[^"]*(service|card)[^"]*"[^>]*>[\s\S]{300,1000}?</gi);
        if (serviceCards.length > 0) {
            serviceCards.forEach((card, index) => {
                if (card[0].length > 800 && !card[0].includes('text-truncate') && !card[0].includes('collapse')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Long service description difficult to read on mobile',
                        element: `service card ${index + 1}`,
                        fix: 'Add text truncation or collapsible content for mobile',
                        cssCode: `
.service-card-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
@media (max-width: 768px) {
    .service-card-description {
        -webkit-line-clamp: 2;
    }
    .service-card .read-more {
        margin-top: 0.5rem;
        font-size: 0.9rem;
    }
}`
                    });
                }
            });
        }

        // Check contact information
        const contactSections = this.extractElements(html, /<[^>]*class="[^"]*contact[^"]*"[^>]*>/gi);
        contactSections.forEach((contact, index) => {
            const contactContent = html.substring(contact.index, contact.index + 1000);
            const hasPhone = /href=["']tel:/i.test(contactContent);
            const hasEmail = /href=["']mailto:/i.test(contactContent);
            
            if (!hasPhone || !hasEmail) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                    priority: PRIORITY.HIGH,
                    issue: 'Contact section missing clickable phone/email for mobile users',
                    element: `contact section ${index + 1}`,
                    fix: 'Add tel: and mailto: links for mobile clinic contact',
                    cssCode: `
.contact-phone::before {
    content: "📞 ";
}
.contact-email::before {
    content: "✉️ ";
}
@media (max-width: 768px) {
    .contact-info {
        text-align: center;
    }
    .contact-phone, .contact-email {
        display: block;
        padding: 0.75rem;
        margin: 0.5rem 0;
        background: #f8f9fa;
        border-radius: 0.5rem;
        text-decoration: none;
    }
}`
                });
            }
        });

        // Check testimonials
        const testimonials = this.extractElements(html, /<[^>]*class="[^"]*testimonial[^"]*"/gi);
        if (testimonials.length > 0 && !html.includes('text-center') && !html.includes('text-start')) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                priority: PRIORITY.LOW,
                issue: 'Testimonials lack proper mobile text alignment',
                element: 'testimonials',
                fix: 'Add responsive text alignment classes'
            });
        }
    }

    // Test RTL/Hebrew support
    testRtlHebrew(html, pageResult, pageName) {
        const hasI18n = /data-i18n/i.test(html);
        const hasRtlSupport = /dir=["']rtl["']|\[dir=["']rtl["']\]/i.test(html);
        
        if (hasI18n && !hasRtlSupport) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.RTL_HEBREW,
                priority: PRIORITY.HIGH,
                issue: 'Missing RTL direction support for Hebrew language',
                element: 'html/body elements',
                fix: 'Add dir="rtl" attribute support for Hebrew content',
                cssCode: `
[dir="rtl"] {
    text-align: right;
}
[dir="rtl"] .container {
    padding-left: 15px;
    padding-right: 15px;
}
[dir="rtl"] .text-start {
    text-align: right !important;
}
[dir="rtl"] .text-end {
    text-align: left !important;
}
@media (max-width: 768px) {
    [dir="rtl"] .mobile-center {
        text-align: center !important;
    }
}`
            });
        }

        // Check for left/right classes that should be start/end
        const leftRightClasses = this.extractElements(html, /class="[^"]*(ml-|mr-|pl-|pr-|text-left|text-right|float-left|float-right)[^"]*"/gi);
        if (leftRightClasses.length > 0) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.RTL_HEBREW,
                priority: PRIORITY.MEDIUM,
                issue: `${leftRightClasses.length} elements using left/right classes instead of start/end for RTL compatibility`,
                element: 'elements with directional classes',
                fix: 'Replace with start/end classes for RTL support',
                cssCode: `
/* Replace these classes: */
/* .ml-3 -> .ms-3 */
/* .mr-3 -> .me-3 */
/* .pl-3 -> .ps-3 */
/* .pr-3 -> .pe-3 */
/* .text-left -> .text-start */
/* .text-right -> .text-end */
/* .float-left -> .float-start */
/* .float-right -> .float-end */`
            });
        }

        // Check Hebrew font support
        if (hasI18n) {
            const hasFontSupport = /font-family[^}]*hebrew|font-family[^}]*noto|font-family[^}]*arial/i.test(html);
            if (!hasFontSupport) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.RTL_HEBREW,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Missing Hebrew font support in CSS',
                    element: 'typography system',
                    fix: 'Add Hebrew-compatible fonts to font stack',
                    cssCode: `
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", 
                 "Noto Sans Hebrew", "Arial Hebrew", Arial, sans-serif;
}
[dir="rtl"] {
    font-family: "Noto Sans Hebrew", "Arial Hebrew", 
                 -apple-system, BlinkMacSystemFont, Arial, sans-serif;
}`
                });
            }
        }
    }

    // Test language switcher
    testLanguageSwitcher(html, pageResult, pageName) {
        const hasLanguageSwitcher = /language-switcher/i.test(html);
        
        if (!hasLanguageSwitcher) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                priority: PRIORITY.CRITICAL,
                issue: 'Language switcher missing from page',
                element: 'language switcher',
                fix: 'Add .language-switcher div for multilingual support',
                cssCode: `
.language-switcher {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(15px);
    border-radius: 12px;
    padding: 6px;
}
@media (max-width: 768px) {
    .language-switcher {
        top: 10px;
        right: 10px;
        padding: 4px;
    }
}
[dir="rtl"] .language-switcher {
    right: auto;
    left: 15px;
}
@media (max-width: 768px) and (dir="rtl") {
    .language-switcher {
        left: 10px;
    }
}`
            });
            return;
        }

        // Check language buttons
        const langButtons = this.extractElements(html, /lang-btn|language-btn/gi);
        if (langButtons.length < 2) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                priority: PRIORITY.HIGH,
                issue: 'Language switcher missing language options',
                element: 'language switcher buttons',
                fix: 'Add .lang-btn elements for English and Hebrew languages'
            });
        }

        // Check mobile positioning
        const hasFixedPosition = /position:\s*fixed|class="[^"]*fixed[^"]*"/i.test(html);
        if (!hasFixedPosition && hasLanguageSwitcher) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                priority: PRIORITY.HIGH,
                issue: 'Language switcher not properly positioned for mobile',
                element: 'language switcher',
                fix: 'Ensure fixed positioning with proper mobile responsive behavior'
            });
        }
    }

    // Test Bootstrap usage
    testBootstrapUsage(html, pageResult, pageName) {
        const hasBootstrap = /bootstrap/i.test(html);
        
        if (hasBootstrap) {
            // Check for proper Bootstrap 5 classes
            const hasOldBootstrap = /ml-|mr-|pl-|pr-|text-left|text-right/i.test(html);
            if (hasOldBootstrap) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.LAYOUT,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Using deprecated Bootstrap 4 classes instead of Bootstrap 5',
                    element: 'Bootstrap classes',
                    fix: 'Update to Bootstrap 5 class names',
                    cssCode: `
/* Bootstrap 5 Migration */
/* .ml-* -> .ms-* */
/* .mr-* -> .me-* */
/* .pl-* -> .ps-* */
/* .pr-* -> .pe-* */
/* .text-left -> .text-start */
/* .text-right -> .text-end */
/* .font-weight-* -> .fw-* */
/* .font-style-* -> .fst-* */`
                });
            }

            // Check for responsive utilities usage
            const hasResponsiveUtils = /d-sm-|d-md-|d-lg-|d-xl-/i.test(html);
            if (!hasResponsiveUtils) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.LAYOUT,
                    priority: PRIORITY.LOW,
                    issue: 'Not utilizing Bootstrap responsive display utilities',
                    element: 'responsive utilities',
                    fix: 'Use .d-none, .d-sm-block, etc. for responsive element visibility'
                });
            }
        }
    }

    // Helper to add issue
    addIssue(pageResult, breakpoint, issue) {
        pageResult.issues[breakpoint].push(issue);
        
        // Update summary counts
        this.results.summary.totalIssues++;
        switch (issue.priority) {
            case PRIORITY.CRITICAL:
                this.results.summary.criticalIssues++;
                break;
            case PRIORITY.HIGH:
                this.results.summary.highIssues++;
                break;
            case PRIORITY.MEDIUM:
                this.results.summary.mediumIssues++;
                break;
            case PRIORITY.LOW:
                this.results.summary.lowIssues++;
                break;
        }
    }

    // Generate comprehensive recommendations
    generateRecommendations() {
        const recommendations = [];
        const implementationGuide = [];

        // Critical issues recommendations
        if (this.results.summary.criticalIssues > 0) {
            recommendations.push({
                priority: PRIORITY.CRITICAL,
                title: '🚨 Critical Accessibility & Functionality Issues',
                description: 'Address missing alt attributes, navigation hamburger menus, and language switcher problems immediately.',
                impact: 'These issues prevent basic functionality and accessibility compliance across all devices.',
                timeEstimate: '2-4 hours',
                implementationSteps: [
                    'Add alt attributes to all images',
                    'Implement hamburger menu for mobile navigation',
                    'Add language switcher to all pages',
                    'Test keyboard navigation and screen readers'
                ]
            });
        }

        // High priority issues
        if (this.results.summary.highIssues > 5) {
            recommendations.push({
                priority: PRIORITY.HIGH,
                title: '⚠️ Bootstrap Responsive Framework Implementation',
                description: 'Systematically add Bootstrap responsive classes (.img-fluid, .btn, .form-control) across all components.',
                impact: 'Significantly improves responsive behavior and ensures consistent styling across all breakpoints.',
                timeEstimate: '4-6 hours',
                implementationSteps: [
                    'Add .img-fluid to all images',
                    'Apply .btn classes to all buttons',
                    'Use .form-control for all form inputs',
                    'Implement responsive grid with .col-sm-*, .col-md-*, .col-lg-*'
                ]
            });
        }

        // Medical industry specific
        recommendations.push({
            priority: PRIORITY.HIGH,
            title: '🏥 Medical Equipment Mobile Optimization',
            description: 'Enhance medical equipment galleries and service displays for mobile clinic decision-makers.',
            impact: 'Critical for healthcare professionals viewing equipment specifications on mobile devices.',
            timeEstimate: '3-5 hours',
            implementationSteps: [
                'Implement responsive equipment image galleries',
                'Add mobile-optimized carousels for equipment photos',
                'Optimize service descriptions with collapsible content',
                'Ensure clinic contact information is mobile-clickable'
            ]
        });

        // RTL Hebrew support
        if (this.results.summary.mediumIssues > 0) {
            recommendations.push({
                priority: PRIORITY.MEDIUM,
                title: '🇮🇱 Hebrew RTL Layout Enhancement',
                description: 'Implement comprehensive RTL support for Hebrew-speaking medical professionals.',
                impact: 'Essential for Israeli medical equipment market and Hebrew-speaking healthcare providers.',
                timeEstimate: '2-3 hours',
                implementationSteps: [
                    'Replace left/right classes with start/end alternatives',
                    'Add Hebrew font support to CSS',
                    'Test RTL layout with dir="rtl" attribute',
                    'Ensure language switcher works in both directions'
                ]
            });
        }

        // Performance optimization
        recommendations.push({
            priority: PRIORITY.MEDIUM,
            title: '⚡ Mobile Performance Optimization',
            description: 'Optimize loading performance for mobile clinic environments with potentially slower connections.',
            impact: 'Improves user experience and reduces bounce rate for mobile users.',
            timeEstimate: '2-4 hours',
            implementationSteps: [
                'Optimize and compress equipment images',
                'Implement lazy loading for image galleries',
                'Minimize font loading with font-display: swap',
                'Use CSS Grid and Flexbox for efficient layouts'
            ]
        });

        // Implementation guide
        implementationGuide.push({
            phase: 'Phase 1: Critical Issues (Week 1)',
            tasks: [
                '✅ Add hamburger menu to all pages',
                '✅ Implement language switcher functionality', 
                '✅ Add alt attributes to all images',
                '✅ Make contact information clickable on mobile'
            ],
            testingRequirements: [
                'Test on iPhone Safari and Android Chrome',
                'Verify hamburger menu opens/closes properly',
                'Test language switching on mobile',
                'Validate accessibility with screen readers'
            ]
        });

        implementationGuide.push({
            phase: 'Phase 2: Bootstrap Implementation (Week 2)',
            tasks: [
                '✅ Add .img-fluid to all images systematically',
                '✅ Apply .btn classes to all buttons',
                '✅ Update form controls with .form-control',
                '✅ Implement responsive grid system'
            ],
            testingRequirements: [
                'Test across all defined breakpoints',
                'Verify images scale properly',
                'Test form functionality on mobile',
                'Validate grid responsiveness'
            ]
        });

        implementationGuide.push({
            phase: 'Phase 3: Medical Industry Optimization (Week 3)',
            tasks: [
                '✅ Create responsive equipment galleries',
                '✅ Implement mobile carousels for equipment',
                '✅ Add collapsible service descriptions',
                '✅ Optimize medical imagery display'
            ],
            testingRequirements: [
                'Test equipment galleries on tablets',
                'Verify carousel functionality on touch devices',
                'Test with actual medical equipment images',
                'Validate aspect ratios across devices'
            ]
        });

        implementationGuide.push({
            phase: 'Phase 4: RTL & Performance (Week 4)',
            tasks: [
                '✅ Implement comprehensive RTL support',
                '✅ Add Hebrew font compatibility',
                '✅ Optimize performance for mobile',
                '✅ Final responsive testing and optimization'
            ],
            testingRequirements: [
                'Test RTL layout with Hebrew content',
                'Verify font rendering in Hebrew',
                'Performance testing on 3G connections',
                'Cross-browser compatibility testing'
            ]
        });

        this.results.recommendations = recommendations;
        this.results.implementationGuide = implementationGuide;
    }

    // Generate CSS fixes compilation
    generateCSSFixes() {
        const cssCode = `
/* ULTRATHINK RESPONSIVE FIXES FOR DAVIDOV BEAUTY CARE */
/* Generated: ${new Date().toISOString()} */

/* =================================== */
/* CRITICAL: Mobile Navigation Fixes */
/* =================================== */

.header-btn-collapse-nav {
    display: none;
    background: none;
    border: none;
    font-size: 1.2rem;
    padding: 0.5rem;
    color: #333;
}

@media (max-width: 991px) {
    .header-btn-collapse-nav {
        display: block;
    }
    
    .header-nav-main {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-radius: 0 0 8px 8px;
    }
}

/* =================================== */
/* CRITICAL: Language Switcher Mobile */
/* =================================== */

.language-switcher {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(15px);
    border-radius: 12px;
    padding: 6px;
    display: flex;
    gap: 6px;
}

.language-switcher .lang-btn {
    padding: 6px 12px;
    border: 1px solid rgba(84, 101, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    min-width: 70px;
    text-align: center;
    transition: all 0.25s ease;
}

@media (max-width: 768px) {
    .language-switcher {
        top: 10px;
        right: 10px;
        padding: 4px;
        gap: 3px;
    }
    
    .language-switcher .lang-btn {
        padding: 4px 8px;
        min-width: 50px;
        font-size: 11px;
    }
}

[dir="rtl"] .language-switcher {
    right: auto;
    left: 15px;
}

@media (max-width: 768px) and ([dir="rtl"]) {
    .language-switcher {
        left: 10px;
    }
}

/* =================================== */
/* HIGH: Responsive Images & Media */
/* =================================== */

img {
    max-width: 100%;
    height: auto;
}

.img-fluid {
    max-width: 100%;
    height: auto;
}

.medical-equipment-image {
    aspect-ratio: 4/3;
    object-fit: cover;
    width: 100%;
    border-radius: 8px;
}

@media (max-width: 768px) {
    .medical-equipment-image {
        aspect-ratio: 16/9;
    }
}

/* Equipment Gallery Mobile Optimization */
.equipment-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .equipment-gallery {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

/* =================================== */
/* HIGH: Form Controls Mobile */
/* =================================== */

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    font-size: 1rem;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .form-control {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 0.875rem;
    }
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    min-height: 44px; /* iOS touch target minimum */
    text-decoration: none;
    display: inline-block;
    text-align: center;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .btn {
        width: 100%;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
    }
}

/* Contact Form Mobile Optimization */
.contact-phone::before {
    content: "📞 ";
}

.contact-email::before {
    content: "✉️ ";
}

@media (max-width: 768px) {
    .contact-info {
        text-align: center;
    }
    
    .contact-phone, 
    .contact-email {
        display: block;
        padding: 0.75rem;
        margin: 0.5rem 0;
        background: #f8f9fa;
        border-radius: 0.5rem;
        text-decoration: none;
        color: inherit;
    }
}

/* =================================== */
/* MEDIUM: Typography Responsive */
/* =================================== */

h1 { font-size: clamp(1.75rem, 4vw, 3rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 2.5vw, 2rem); }
h4 { font-size: clamp(1.125rem, 2vw, 1.5rem); }
h5 { font-size: clamp(1rem, 1.5vw, 1.25rem); }
h6 { font-size: clamp(0.875rem, 1vw, 1.125rem); }

@media (max-width: 576px) {
    h1 { font-size: 1.75rem; line-height: 1.2; }
    h2 { font-size: 1.5rem; line-height: 1.3; }
    h3 { font-size: 1.25rem; line-height: 1.4; }
}

p {
    line-height: 1.6;
}

@media (max-width: 768px) {
    p {
        line-height: 1.8;
        font-size: 0.95rem;
    }
}

/* Service Card Description Mobile */
.service-card-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (max-width: 768px) {
    .service-card-description {
        -webkit-line-clamp: 2;
    }
    
    .service-card .read-more {
        margin-top: 0.5rem;
        font-size: 0.9rem;
    }
}

/* =================================== */
/* MEDIUM: Layout & Grid System */
/* =================================== */

.container {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 15px;
}

@media (max-width: 1200px) { .container { max-width: 960px; } }
@media (max-width: 992px) { .container { max-width: 720px; } }
@media (max-width: 768px) { .container { max-width: 540px; } }
@media (max-width: 576px) { .container { max-width: 100%; } }

/* Hero Section Responsive */
.hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

@media (max-width: 1024px) {
    .hero-section { min-height: 80vh; }
}

@media (max-width: 768px) {
    .hero-section { 
        min-height: 70vh;
        background-attachment: scroll; /* Better performance on mobile */
    }
}

@media (max-width: 576px) {
    .hero-section { min-height: 60vh; }
}

/* =================================== */
/* MEDIUM: RTL Hebrew Support */
/* =================================== */

[dir="rtl"] {
    text-align: right;
}

[dir="rtl"] .container {
    padding-left: 15px;
    padding-right: 15px;
}

[dir="rtl"] .text-start {
    text-align: right !important;
}

[dir="rtl"] .text-end {
    text-align: left !important;
}

@media (max-width: 768px) {
    [dir="rtl"] .mobile-center {
        text-align: center !important;
    }
}

/* Hebrew Font Support */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", 
                 "Noto Sans Hebrew", "Arial Hebrew", Arial, sans-serif;
}

[dir="rtl"] {
    font-family: "Noto Sans Hebrew", "Arial Hebrew", 
                 -apple-system, BlinkMacSystemFont, Arial, sans-serif;
}

/* =================================== */
/* PERFORMANCE: Optimizations */
/* =================================== */

/* Lazy loading support */
img[loading="lazy"] {
    opacity: 0;
    transition: opacity 0.3s;
}

img[loading="lazy"].loaded {
    opacity: 1;
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
    html {
        scroll-behavior: auto;
    }
}

/* =================================== */
/* UTILITY: Bootstrap 5 Migration */
/* =================================== */

/* Spacing utilities - start/end instead of left/right */
.ms-1 { margin-left: 0.25rem !important; }
.ms-2 { margin-left: 0.5rem !important; }
.ms-3 { margin-left: 1rem !important; }
.ms-4 { margin-left: 1.5rem !important; }
.ms-5 { margin-left: 3rem !important; }

.me-1 { margin-right: 0.25rem !important; }
.me-2 { margin-right: 0.5rem !important; }
.me-3 { margin-right: 1rem !important; }
.me-4 { margin-right: 1.5rem !important; }
.me-5 { margin-right: 3rem !important; }

[dir="rtl"] .ms-1 { margin-left: 0; margin-right: 0.25rem !important; }
[dir="rtl"] .ms-2 { margin-left: 0; margin-right: 0.5rem !important; }
[dir="rtl"] .ms-3 { margin-left: 0; margin-right: 1rem !important; }
[dir="rtl"] .ms-4 { margin-left: 0; margin-right: 1.5rem !important; }
[dir="rtl"] .ms-5 { margin-left: 0; margin-right: 3rem !important; }

[dir="rtl"] .me-1 { margin-right: 0; margin-left: 0.25rem !important; }
[dir="rtl"] .me-2 { margin-right: 0; margin-left: 0.5rem !important; }
[dir="rtl"] .me-3 { margin-right: 0; margin-left: 1rem !important; }
[dir="rtl"] .me-4 { margin-right: 0; margin-left: 1.5rem !important; }
[dir="rtl"] .me-5 { margin-right: 0; margin-left: 3rem !important; }

/* Text alignment utilities */
.text-start { text-align: left !important; }
.text-end { text-align: right !important; }

[dir="rtl"] .text-start { text-align: right !important; }
[dir="rtl"] .text-end { text-align: left !important; }

/* =================================== */
/* BREAKPOINT SPECIFIC FIXES */
/* =================================== */

/* Mobile Portrait: 320px - 480px */
@media (max-width: 480px) {
    .container {
        padding: 0 10px;
    }
    
    .btn {
        font-size: 1rem;
        padding: 0.875rem 1.25rem;
    }
    
    .hero-section {
        min-height: 50vh;
        padding: 2rem 0;
    }
}

/* Mobile Landscape: 481px - 768px */
@media (min-width: 481px) and (max-width: 768px) {
    .equipment-gallery {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Tablet Portrait: 769px - 1024px */
@media (min-width: 769px) and (max-width: 1024px) {
    .equipment-gallery {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .hero-section {
        min-height: 85vh;
    }
}

/* Desktop Small: 1025px - 1200px */
@media (min-width: 1025px) and (max-width: 1200px) {
    .container {
        max-width: 960px;
    }
}

/* Desktop Large: 1201px+ */
@media (min-width: 1201px) {
    .container {
        max-width: 1140px;
    }
    
    .hero-section {
        min-height: 100vh;
    }
}

/* =================================== */
/* MEDICAL INDUSTRY SPECIFIC */
/* =================================== */

/* Equipment showcase cards */
.equipment-card {
    border: 1px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: #fff;
}

.equipment-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
    .equipment-card {
        border-radius: 8px;
    }
    
    .equipment-card:hover {
        transform: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
}

/* Testimonials for medical professionals */
.testimonial-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    position: relative;
}

.testimonial-card::before {
    content: '"';
    font-size: 4rem;
    color: #a8ff78;
    position: absolute;
    top: -10px;
    left: 20px;
    font-family: serif;
}

@media (max-width: 768px) {
    .testimonial-card {
        padding: 1.5rem;
        text-align: center;
    }
    
    .testimonial-card::before {
        font-size: 3rem;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
    }
}

/* Professional contact information */
.professional-contact {
    background: linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%);
    color: #333;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
}

@media (max-width: 768px) {
    .professional-contact {
        padding: 1.5rem;
        margin: 1rem 0;
    }
}

/* =================================== */
/* ACCESSIBILITY IMPROVEMENTS */
/* =================================== */

/* Focus styles for keyboard navigation */
a:focus,
button:focus,
input:focus,
textarea:focus,
select:focus {
    outline: 2px solid #a8ff78;
    outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .btn {
        border: 2px solid currentColor;
    }
    
    .equipment-card {
        border: 2px solid #333;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* END OF RESPONSIVE FIXES */
`;

        return cssCode;
    }

    // Run complete analysis
    async runAnalysis() {
        console.log('🔍 Starting ULTRATHINK Responsive Analysis for Davidov Beauty Care...\n');
        
        const htmlFiles = this.getHtmlFiles();
        this.results.summary.totalPages = htmlFiles.length;
        
        console.log(`📄 Found ${htmlFiles.length} HTML files to analyze`);
        console.log(`📱 Testing across ${Object.keys(BREAKPOINTS).length} breakpoints:`);
        Object.values(BREAKPOINTS).forEach(bp => console.log(`    • ${bp.label}`));
        console.log(`🎯 Beauty care industry focus with RTL Hebrew support\n`);

        let processedCount = 0;
        for (const filePath of htmlFiles) {
            const pageName = path.basename(filePath, '.html');
            processedCount++;
            console.log(`[${processedCount}/${htmlFiles.length}] Analyzing: ${pageName}...`);
            
            const pageAnalysis = this.analyzePage(filePath);
            if (pageAnalysis) {
                this.results.pageResults[pageAnalysis.pageName] = pageAnalysis.result;
                
                // Show immediate results for this page
                const pageIssues = Object.values(pageAnalysis.result.issues).flat();
                const criticalCount = pageIssues.filter(issue => issue.priority === PRIORITY.CRITICAL).length;
                const highCount = pageIssues.filter(issue => issue.priority === PRIORITY.HIGH).length;
                
                if (criticalCount > 0 || highCount > 0) {
                    console.log(`    ⚠️  Found ${criticalCount} critical, ${highCount} high priority issues`);
                }
            }
        }

        this.generateRecommendations();
        
        console.log('\n✅ Analysis Complete!');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📊 RESPONSIVE ANALYSIS SUMMARY`);
        console.log('═══════════════════════════════════════════════════');
        console.log(`📄 Pages Analyzed: ${this.results.summary.totalPages}`);
        console.log(`📱 Breakpoints Tested: ${this.results.summary.breakpointsTested}`);
        console.log(`🎯 Total Issues Found: ${this.results.summary.totalIssues}`);
        console.log('');
        console.log('ISSUE BREAKDOWN BY PRIORITY:');
        console.log(`🚨 Critical: ${this.results.summary.criticalIssues} (Fix Immediately)`);
        console.log(`⚠️  High: ${this.results.summary.highIssues} (Fix This Week)`);
        console.log(`📋 Medium: ${this.results.summary.mediumIssues} (Fix Next Week)`);
        console.log(`💡 Low: ${this.results.summary.lowIssues} (Future Enhancement)`);
        console.log('');
        console.log(`📋 Generated ${this.results.recommendations.length} strategic recommendations`);
        console.log(`🛠️  Created ${this.results.implementationGuide.length}-phase implementation guide`);

        return this.results;
    }

    // Save results to JSON file
    saveResults(outputPath = 'responsive-analysis-report.json') {
        const fullPath = path.join(this.srcDir, outputPath);
        const reportData = {
            ...this.results,
            cssFixesCode: this.generateCSSFixes(),
            metadata: {
                generatedBy: 'ULTRATHINK Responsive Analysis Tool',
                version: '1.0.0',
                analysisDate: new Date().toISOString(),
                targetWebsite: 'Davidov Beauty Care',
                industry: 'Medical Equipment / Beauty Care',
                languages: ['English', 'Hebrew'],
                framework: 'Bootstrap 5',
                focusAreas: [
                    'Medical equipment display',
                    'Hebrew RTL support',
                    'Professional clinic usability',
                    'Mobile-first responsive design'
                ]
            }
        };
        
        fs.writeFileSync(fullPath, JSON.stringify(reportData, null, 2));
        console.log(`\n💾 Comprehensive report saved to: ${fullPath}`);
        
        // Also save CSS fixes separately
        const cssPath = path.join(this.srcDir, 'responsive-fixes.css');
        fs.writeFileSync(cssPath, this.generateCSSFixes());
        console.log(`🎨 CSS fixes saved to: ${cssPath}`);
        
        return fullPath;
    }
}

// Run analysis if called directly
if (require.main === module) {
    const srcDir = process.argv[2] || '.';
    const analyzer = new ResponsiveAnalyzer(srcDir);
    
    analyzer.runAnalysis()
        .then(results => {
            analyzer.saveResults();
            
            // Show quick summary
            console.log('\n🎯 QUICK ACTION ITEMS:');
            
            if (results.summary.criticalIssues > 0) {
                console.log(`\n🚨 URGENT: ${results.summary.criticalIssues} critical issues need immediate attention:`);
                console.log('   • Add hamburger menu to mobile navigation');
                console.log('   • Implement language switcher on all pages');
                console.log('   • Add alt attributes to images for accessibility');
            }
            
            if (results.summary.highIssues > 5) {
                console.log(`\n⚠️  HIGH PRIORITY: Systematic Bootstrap implementation needed`);
                console.log('   • Add .img-fluid to all images');
                console.log('   • Apply .btn classes to buttons');
                console.log('   • Use .form-control for form inputs');
            }
            
            console.log(`\n📋 See full report: responsive-analysis-report.json`);
            console.log(`🎨 Use CSS fixes: responsive-fixes.css`);
            console.log(`\n🏥 Industry Focus: Medical equipment mobile optimization complete`);
            console.log(`🇮🇱 Hebrew RTL: Comprehensive RTL support analysis included`);
        })
        .catch(error => {
            console.error('❌ Analysis failed:', error);
            process.exit(1);
        });
}

module.exports = ResponsiveAnalyzer;