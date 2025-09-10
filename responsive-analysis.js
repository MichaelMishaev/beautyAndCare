#!/usr/bin/env node

/**
 * ULTRATHINK RESPONSIVE ANALYSIS TOOL
 * Comprehensive responsive testing for Davidov Beauty Care website
 * Tests all HTML files across multiple breakpoints with beauty care industry focus
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Define breakpoints for testing
const BREAKPOINTS = {
    'mobile-portrait': { width: 320, min: 320, max: 480, label: 'Mobile Portrait' },
    'mobile-landscape': { width: 768, min: 481, max: 768, label: 'Mobile Landscape' },
    'tablet-portrait': { width: 1024, min: 769, max: 1024, label: 'Tablet Portrait' },
    'desktop-small': { width: 1200, min: 1025, max: 1200, label: 'Desktop Small' },
    'desktop-large': { width: 1400, min: 1201, max: 9999, label: 'Desktop Large' }
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
                testDate: new Date().toISOString()
            },
            pageResults: {},
            recommendations: []
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
        
        return htmlFiles;
    }

    // Load and parse HTML file
    loadHtmlFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return cheerio.load(content);
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error.message);
            return null;
        }
    }

    // Analyze single page for responsive issues
    analyzePage(filePath) {
        const $ = this.loadHtmlFile(filePath);
        if (!$ || !$) return null;

        const pageName = path.basename(filePath, '.html');
        const pageResult = {
            file: filePath,
            issues: {},
            recommendations: []
        };

        // Initialize issues for each breakpoint
        for (const breakpoint of Object.keys(BREAKPOINTS)) {
            pageResult.issues[breakpoint] = [];
        }

        // Run all tests
        this.testNavigation($, pageResult);
        this.testTypography($, pageResult);
        this.testImages($, pageResult);
        this.testForms($, pageResult);
        this.testLayout($, pageResult);
        this.testMedicalSpecific($, pageResult);
        this.testRtlHebrew($, pageResult);
        this.testLanguageSwitcher($, pageResult);

        return { pageName, result: pageResult };
    }

    // Test navigation responsiveness
    testNavigation($, pageResult) {
        const nav = $('#header .header-nav-main');
        const hamburger = $('.header-btn-collapse-nav');
        
        // Check if hamburger menu exists
        if (hamburger.length === 0) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.NAVIGATION,
                priority: PRIORITY.CRITICAL,
                issue: 'Missing hamburger menu button for mobile navigation',
                element: 'header navigation',
                fix: 'Add .header-btn-collapse-nav button for mobile menu collapse'
            });
        }

        // Check navigation overflow on small screens
        const navItems = nav.find('nav > ul > li');
        if (navItems.length > 5) {
            this.addIssue(pageResult, 'tablet-portrait', {
                category: TEST_CATEGORIES.NAVIGATION,
                priority: PRIORITY.HIGH,
                issue: 'Too many navigation items may cause horizontal overflow on tablets',
                element: 'main navigation',
                fix: 'Consider using dropdown grouping or responsive navigation patterns'
            });
        }

        // Check dropdown menus
        const dropdowns = nav.find('.dropdown-menu');
        dropdowns.each((i, dropdown) => {
            const $dropdown = $(dropdown);
            if (!$dropdown.hasClass('dropdown-menu-end') && !$dropdown.hasClass('dropdown-menu-start')) {
                this.addIssue(pageResult, 'mobile-landscape', {
                    category: TEST_CATEGORIES.NAVIGATION,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Dropdown menu may overflow screen edges on mobile',
                    element: `dropdown menu ${i + 1}`,
                    fix: 'Add .dropdown-menu-end or proper positioning classes'
                });
            }
        });
    }

    // Test typography responsiveness
    testTypography($, pageResult) {
        const headings = $('h1, h2, h3, h4, h5, h6');
        
        headings.each((i, heading) => {
            const $heading = $(heading);
            const classes = $heading.attr('class') || '';
            
            // Check for responsive typography classes
            if (!classes.includes('text-') && !classes.includes('fs-')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.TYPOGRAPHY,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Heading lacks responsive typography classes',
                    element: `${heading.tagName.toLowerCase()} element`,
                    fix: 'Add responsive text size classes like .text-lg-4 or custom media queries'
                });
            }
        });

        // Check for long text without line height adjustments
        const paragraphs = $('p');
        paragraphs.each((i, p) => {
            const $p = $(p);
            const text = $p.text();
            
            if (text.length > 200 && !$p.attr('class')?.includes('line-height')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.TYPOGRAPHY,
                    priority: PRIORITY.LOW,
                    issue: 'Long paragraph without responsive line height',
                    element: `paragraph ${i + 1}`,
                    fix: 'Add .line-height-5 or custom line-height for better mobile readability'
                });
            }
        });

        // Check Hebrew/RTL text handling
        const rtlText = $('[data-i18n]');
        if (rtlText.length > 0) {
            rtlText.each((i, element) => {
                const $element = $(element);
                if (!$element.closest('[dir="rtl"]').length && !$element.attr('dir')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.RTL_HEBREW,
                        priority: PRIORITY.HIGH,
                        issue: 'Element with i18n attribute lacks RTL direction support',
                        element: `${element.tagName.toLowerCase()} with data-i18n`,
                        fix: 'Add dir="rtl" attribute or ensure proper RTL CSS handling'
                    });
                }
            });
        }
    }

    // Test image responsiveness
    testImages($, pageResult) {
        const images = $('img');
        
        images.each((i, img) => {
            const $img = $(img);
            const classes = $img.attr('class') || '';
            const src = $img.attr('src');
            
            // Check for responsive image classes
            if (!classes.includes('img-fluid') && !classes.includes('img-responsive')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.IMAGES,
                    priority: PRIORITY.HIGH,
                    issue: 'Image lacks responsive scaling classes',
                    element: `image: ${src || 'unnamed'}`,
                    fix: 'Add .img-fluid class for responsive scaling'
                });
            }

            // Check for missing alt attributes
            if (!$img.attr('alt')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.IMAGES,
                    priority: PRIORITY.CRITICAL,
                    issue: 'Image missing alt attribute for accessibility',
                    element: `image: ${src || 'unnamed'}`,
                    fix: 'Add descriptive alt attribute'
                });
            }

            // Check for medical equipment images without proper sizing
            if (src && (src.includes('medical') || src.includes('equipment') || src.includes('device'))) {
                if (!classes.includes('object-fit') && !classes.includes('aspect-ratio')) {
                    this.addIssue(pageResult, 'tablet-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Medical equipment image lacks proper aspect ratio handling',
                        element: `medical image: ${src}`,
                        fix: 'Add .object-fit-cover or aspect-ratio classes for consistent display'
                    });
                }
            }
        });

        // Check background images
        const elementsWithBg = $('[style*="background"], [class*="bg-"]');
        elementsWithBg.each((i, element) => {
            const $element = $(element);
            const style = $element.attr('style') || '';
            
            if (style.includes('background-image') && !style.includes('background-size')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.IMAGES,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Background image without responsive background-size',
                    element: `${element.tagName.toLowerCase()} with background`,
                    fix: 'Add background-size: cover or contain to CSS'
                });
            }
        });
    }

    // Test form responsiveness
    testForms($, pageResult) {
        const forms = $('form');
        
        forms.each((formIndex, form) => {
            const $form = $(form);
            
            // Check form inputs
            const inputs = $form.find('input, textarea, select');
            inputs.each((i, input) => {
                const $input = $(input);
                const classes = $input.attr('class') || '';
                
                // Check for responsive form controls
                if (!classes.includes('form-control') && !classes.includes('form-select')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.FORMS,
                        priority: PRIORITY.HIGH,
                        issue: 'Form input lacks responsive styling classes',
                        element: `${input.tagName.toLowerCase()} in form ${formIndex + 1}`,
                        fix: 'Add .form-control or appropriate Bootstrap form classes'
                    });
                }
            });

            // Check form buttons
            const buttons = $form.find('button, input[type="submit"]');
            buttons.each((i, button) => {
                const $button = $(button);
                const classes = $button.attr('class') || '';
                
                if (!classes.includes('btn')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.FORMS,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Form button lacks responsive button classes',
                        element: `button in form ${formIndex + 1}`,
                        fix: 'Add .btn and appropriate button size classes'
                    });
                }

                // Check button size for touch targets
                if (!classes.includes('btn-lg') && !classes.includes('btn-sm')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.FORMS,
                        priority: PRIORITY.LOW,
                        issue: 'Button may be too small for mobile touch targets',
                        element: `button in form ${formIndex + 1}`,
                        fix: 'Consider adding .btn-lg for better mobile touch targets'
                    });
                }
            });

            // Check for contact/clinic inquiry forms
            const isContactForm = $form.find('[name*="contact"], [name*="email"], [name*="phone"]').length > 0;
            if (isContactForm) {
                const phoneInput = $form.find('[name*="phone"], [type="tel"]');
                if (phoneInput.length === 0) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Contact form missing phone input for clinic inquiries',
                        element: `contact form ${formIndex + 1}`,
                        fix: 'Add phone number field with type="tel" for mobile optimization'
                    });
                }
            }
        });
    }

    // Test layout responsiveness
    testLayout($, pageResult) {
        // Check container usage
        const containers = $('.container, .container-fluid');
        if (containers.length === 0) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LAYOUT,
                priority: PRIORITY.HIGH,
                issue: 'Page lacks responsive container structure',
                element: 'page layout',
                fix: 'Wrap content in .container or .container-fluid'
            });
        }

        // Check grid system usage
        const rows = $('.row');
        rows.each((i, row) => {
            const $row = $(row);
            const cols = $row.find('[class*="col-"]');
            
            // Check if columns have mobile-first responsive classes
            cols.each((j, col) => {
                const $col = $(col);
                const classes = $col.attr('class') || '';
                
                if (!classes.includes('col-sm') && !classes.includes('col-md') && !classes.includes('col-lg')) {
                    if (classes.includes('col-')) {
                        this.addIssue(pageResult, 'mobile-portrait', {
                            category: TEST_CATEGORIES.LAYOUT,
                            priority: PRIORITY.MEDIUM,
                            issue: 'Column lacks mobile-first responsive classes',
                            element: `column in row ${i + 1}`,
                            fix: 'Add .col-sm-*, .col-md-*, .col-lg-* classes for responsive behavior'
                        });
                    }
                }
            });
        });

        // Check for fixed heights that may cause issues
        const fixedHeights = $('[style*="height:"], .h-100, .vh-100');
        fixedHeights.each((i, element) => {
            const $element = $(element);
            const style = $element.attr('style') || '';
            
            if (style.includes('height:') && !style.includes('min-height')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.LAYOUT,
                    priority: PRIORITY.LOW,
                    issue: 'Element with fixed height may cause responsive issues',
                    element: `${element.tagName.toLowerCase()} with fixed height`,
                    fix: 'Consider using min-height instead of height for better responsiveness'
                });
            }
        });

        // Check hero sections
        const heroSections = $('.hero, .banner, [class*="hero-"]');
        heroSections.each((i, hero) => {
            const $hero = $(hero);
            const classes = $hero.attr('class') || '';
            
            if (!classes.includes('min-height') && !classes.includes('vh-')) {
                this.addIssue(pageResult, 'tablet-portrait', {
                    category: TEST_CATEGORIES.LAYOUT,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Hero section may not display properly on tablets/mobile',
                    element: `hero section ${i + 1}`,
                    fix: 'Add responsive height classes like .min-height-15 or .vh-75'
                });
            }
        });
    }

    // Test medical/beauty industry specific elements
    testMedicalSpecific($, pageResult) {
        // Check medical equipment galleries
        const galleries = $('.portfolio, .gallery, [class*="equipment"]');
        galleries.each((i, gallery) => {
            const $gallery = $(gallery);
            const images = $gallery.find('img');
            
            if (images.length > 3) {
                const classes = $gallery.attr('class') || '';
                if (!classes.includes('carousel') && !classes.includes('owl-') && !classes.includes('swiper')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.HIGH,
                        issue: 'Medical equipment gallery not optimized for mobile viewing',
                        element: `equipment gallery ${i + 1}`,
                        fix: 'Implement carousel or responsive grid for mobile equipment display'
                    });
                }
            }
        });

        // Check service descriptions
        const serviceCards = $('.service, [class*="service-"], .card');
        serviceCards.each((i, card) => {
            const $card = $(card);
            const text = $card.text();
            
            if (text.length > 300) {
                const classes = $card.attr('class') || '';
                if (!classes.includes('text-truncate') && !classes.includes('collapse')) {
                    this.addIssue(pageResult, 'mobile-portrait', {
                        category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                        priority: PRIORITY.MEDIUM,
                        issue: 'Long service description may be difficult to read on mobile',
                        element: `service card ${i + 1}`,
                        fix: 'Add text truncation or collapsible content for mobile'
                    });
                }
            }
        });

        // Check testimonials
        const testimonials = $('.testimonial, [class*="testimonial-"]');
        testimonials.each((i, testimonial) => {
            const $testimonial = $(testimonial);
            const classes = $testimonial.attr('class') || '';
            
            if (!classes.includes('text-center') && !classes.includes('text-start')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                    priority: PRIORITY.LOW,
                    issue: 'Testimonial lacks proper mobile text alignment',
                    element: `testimonial ${i + 1}`,
                    fix: 'Add .text-center or .text-start for better mobile readability'
                });
            }
        });

        // Check contact information for clinics
        const contactInfo = $('[class*="contact-"], .contact');
        contactInfo.each((i, contact) => {
            const $contact = $(contact);
            const hasPhone = $contact.find('[href^="tel:"]').length > 0;
            const hasEmail = $contact.find('[href^="mailto:"]').length > 0;
            
            if (!hasPhone || !hasEmail) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.MEDICAL_SPECIFIC,
                    priority: PRIORITY.HIGH,
                    issue: 'Contact section missing clickable phone/email for mobile users',
                    element: `contact section ${i + 1}`,
                    fix: 'Add tel: and mailto: links for mobile clinic contact'
                });
            }
        });
    }

    // Test RTL/Hebrew support
    testRtlHebrew($, pageResult) {
        // Check for RTL direction support
        const htmlDir = $('html').attr('dir');
        const bodyDir = $('body').attr('dir');
        
        if (!htmlDir && !bodyDir) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.RTL_HEBREW,
                priority: PRIORITY.HIGH,
                issue: 'Missing RTL direction support for Hebrew language',
                element: 'html/body',
                fix: 'Add dir="rtl" attribute support for Hebrew content'
            });
        }

        // Check text alignment for RTL
        const textElements = $('p, h1, h2, h3, h4, h5, h6, .text-start, .text-end');
        textElements.each((i, element) => {
            const $element = $(element);
            const classes = $element.attr('class') || '';
            
            if (classes.includes('text-start') && !classes.includes('text-end')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.RTL_HEBREW,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Text alignment not responsive to RTL layout',
                    element: `text element ${i + 1}`,
                    fix: 'Use .text-start and .text-end with RTL considerations'
                });
            }
        });

        // Check margin/padding for RTL
        const spacingElements = $('[class*="ms-"], [class*="me-"], [class*="ps-"], [class*="pe-"]');
        spacingElements.each((i, element) => {
            const $element = $(element);
            const classes = $element.attr('class') || '';
            
            // Check for start/end classes vs left/right
            if (classes.includes('ml-') || classes.includes('mr-') || classes.includes('pl-') || classes.includes('pr-')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.RTL_HEBREW,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Using left/right spacing instead of start/end for RTL compatibility',
                    element: `element with spacing ${i + 1}`,
                    fix: 'Replace ml-/mr- with ms-/me- and pl-/pr- with ps-/pe- for RTL support'
                });
            }
        });
    }

    // Test language switcher
    testLanguageSwitcher($, pageResult) {
        const languageSwitcher = $('.language-switcher');
        
        if (languageSwitcher.length === 0) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                priority: PRIORITY.CRITICAL,
                issue: 'Language switcher missing from page',
                element: 'language switcher',
                fix: 'Add .language-switcher div for multilingual support'
            });
            return;
        }

        // Check positioning on mobile
        const classes = languageSwitcher.attr('class') || '';
        const style = languageSwitcher.attr('style') || '';
        
        if (!classes.includes('fixed') && !style.includes('position: fixed')) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                priority: PRIORITY.HIGH,
                issue: 'Language switcher not properly positioned for mobile',
                element: 'language switcher',
                fix: 'Ensure position: fixed with proper mobile positioning'
            });
        }

        // Check for language buttons
        const langButtons = languageSwitcher.find('.lang-btn');
        if (langButtons.length < 2) {
            this.addIssue(pageResult, 'mobile-portrait', {
                category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                priority: PRIORITY.HIGH,
                issue: 'Language switcher missing language options',
                element: 'language switcher buttons',
                fix: 'Add .lang-btn elements for English and Hebrew languages'
            });
        }

        // Check mobile responsive classes
        langButtons.each((i, button) => {
            const $button = $(button);
            const buttonClasses = $button.attr('class') || '';
            
            if (!buttonClasses.includes('btn') && !buttonClasses.includes('lang-btn')) {
                this.addIssue(pageResult, 'mobile-portrait', {
                    category: TEST_CATEGORIES.LANGUAGE_SWITCHER,
                    priority: PRIORITY.MEDIUM,
                    issue: 'Language button lacks proper styling classes',
                    element: `language button ${i + 1}`,
                    fix: 'Add proper button styling classes for mobile touch targets'
                });
            }
        });
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

    // Generate recommendations
    generateRecommendations() {
        const recommendations = [];

        // Global recommendations based on common issues
        if (this.results.summary.criticalIssues > 0) {
            recommendations.push({
                priority: PRIORITY.CRITICAL,
                title: 'Critical Accessibility Issues',
                description: 'Address missing alt attributes, navigation issues, and language switcher problems immediately.',
                impact: 'These issues affect accessibility and basic functionality across all devices.'
            });
        }

        if (this.results.summary.highIssues > 10) {
            recommendations.push({
                priority: PRIORITY.HIGH,
                title: 'Implement Bootstrap Responsive Classes',
                description: 'Many elements lack proper responsive Bootstrap classes. Add .img-fluid, .btn, .form-control classes.',
                impact: 'Improves responsive behavior across all breakpoints and ensures consistent styling.'
            });
        }

        recommendations.push({
            priority: PRIORITY.MEDIUM,
            title: 'Medical Equipment Image Optimization',
            description: 'Implement responsive image galleries and carousels for medical equipment displays on mobile devices.',
            impact: 'Enhances user experience when viewing equipment on mobile, crucial for clinic decision-makers.'
        });

        recommendations.push({
            priority: PRIORITY.MEDIUM,
            title: 'RTL Hebrew Support Enhancement',
            description: 'Ensure proper RTL layout support with start/end spacing classes and proper text alignment.',
            impact: 'Essential for Hebrew-speaking users and professional medical equipment market in Israel.'
        });

        recommendations.push({
            priority: PRIORITY.LOW,
            title: 'Touch Target Optimization',
            description: 'Increase button sizes and improve spacing for better mobile touch interactions.',
            impact: 'Improves mobile usability for clinic staff accessing equipment information on mobile devices.'
        });

        this.results.recommendations = recommendations;
    }

    // Run complete analysis
    async runAnalysis() {
        console.log('🔍 Starting ULTRATHINK Responsive Analysis...\n');
        
        const htmlFiles = this.getHtmlFiles();
        this.results.summary.totalPages = htmlFiles.length;
        
        console.log(`📄 Found ${htmlFiles.length} HTML files to analyze`);
        console.log(`📱 Testing across ${Object.keys(BREAKPOINTS).length} breakpoints`);
        console.log(`🎯 Focusing on beauty care industry requirements\n`);

        for (const filePath of htmlFiles) {
            const pageName = path.basename(filePath, '.html');
            console.log(`Analyzing: ${pageName}...`);
            
            const pageAnalysis = this.analyzePage(filePath);
            if (pageAnalysis) {
                this.results.pageResults[pageAnalysis.pageName] = pageAnalysis.result;
            }
        }

        this.generateRecommendations();
        
        console.log('\n✅ Analysis Complete!');
        console.log(`📊 Total Issues Found: ${this.results.summary.totalIssues}`);
        console.log(`🚨 Critical: ${this.results.summary.criticalIssues}`);
        console.log(`⚠️  High: ${this.results.summary.highIssues}`);
        console.log(`📋 Medium: ${this.results.summary.mediumIssues}`);
        console.log(`💡 Low: ${this.results.summary.lowIssues}`);

        return this.results;
    }

    // Save results to JSON file
    saveResults(outputPath = 'responsive-analysis-report.json') {
        const fullPath = path.join(this.srcDir, outputPath);
        fs.writeFileSync(fullPath, JSON.stringify(this.results, null, 2));
        console.log(`\n💾 Results saved to: ${fullPath}`);
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
        })
        .catch(error => {
            console.error('❌ Analysis failed:', error);
            process.exit(1);
        });
}

module.exports = ResponsiveAnalyzer;