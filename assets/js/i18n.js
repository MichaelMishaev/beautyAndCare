/**
 * i18n - Internationalization System for HTML
 * Supports English and Hebrew with RTL support
 */

(function() {
    'use strict';

    const i18n = {
        currentLang: 'en',
        translations: {},
        
        /**
         * Initialize the i18n system
         */
        init: async function() {
            // Get saved language or detect from browser
            this.currentLang = localStorage.getItem('selectedLanguage') || this.detectBrowserLanguage();
            
            // Load translations
            await this.loadTranslations(this.currentLang);
            
            // Apply translations to page
            this.applyTranslations();
            
            // Set RTL if needed
            this.setRTL(this.currentLang === 'he');
            
            // Initialize language switcher
            this.initLanguageSwitcher();
        },
        
        /**
         * Detect browser language
         */
        detectBrowserLanguage: function() {
            const browserLang = navigator.language || navigator.userLanguage;
            
            // Check if Hebrew
            if (browserLang.startsWith('he') || browserLang.startsWith('iw')) {
                return 'he';
            }
            
            // Default to English
            return 'en';
        },
        
        /**
         * Load translation file
         */
        loadTranslations: async function(lang) {
            // Check if running from file:// protocol
            if (window.location.protocol === 'file:') {
                this.useEmbeddedTranslations(lang);
                return;
            }
            
            try {
                const response = await fetch(`assets/locales/${lang}.json`);
                if (!response.ok) {
                    this.useEmbeddedTranslations(lang);
                    return;
                }
                this.translations = await response.json();
            } catch (error) {
                this.useEmbeddedTranslations(lang);
            }
        },
        
        /**
         * Use embedded translations when files are not available
         */
        useEmbeddedTranslations: function(lang) {
            const embeddedTranslations = {
                en: {
                    nav: {
                        home: "Home",
                        catalog: "Catalog",
                        services: "Services",
                        about: "About",
                        contact: "Contact",
                        projects: "Projects",
                        pages: "Pages",
                        team: "Our Team",
                        teamDetails: "Team Details",
                        pricing: "Pricing Table",
                        faq: "FAQs Page",
                        digitalAgency: "Digital Agency",
                        creativeAgency: "Creative Agency",
                        designStudio: "Design Studio",
                        startupAgency: "Startup Agency",
                        digitalMarketing: "Digital Marketing",
                        modernAgency: "Modern Agency",
                        creativeStudio: "Creative Studio",
                        personalPortfolio: "Personal Portfolio",
                        photography: "Photography",
                        blogs: "Blogs",
                        blogDetails: "Blog Details",
                        aboutPages: "About Pages",
                        servicesPages: "Services Pages",
                        servicesDetails: "Services Details",
                        errorPage: "404 Error Page",
                        about02: "About 02",
                        digitalStudio: "Digital Studio",
                        projectDetails: "Project Details"
                    },
                    hero: {
                        title: "Advanced Technology for Your Clinic",
                        subtitle: "Professional Beauty Equipment",
                        description: "Transform your clinic with professional beauty equipment. Transparent pricing, local support, and technology that grows with your business.",
                        clients: "We have 500+ satisfied clinics in Israel"
                    },
                    page: {
                        title: "Davidov Beauty Care - Professional Equipment for Clinics"
                    },
                    heroStats: {
                        marketingSpend: "$10M+ Spend in marketing",
                        ambassadorPartner: "1st ambassador partner for marketing in USA",
                        passionatePartner: "10+ passionate partner"
                    },
                    cta: {
                        remarkable: "Let's Make Something Remarkable Together",
                        remarkableDesc: "Your vision deserves world-class execution. Contact us now, and let's turn your ideas into unforgettable experiences.",
                        viewMoreWorks: "View More Works",
                        viewDetails: "View Details"
                    },
                    about: {
                        mainHeading: "Great brands don't happen by accident they're built with intention. Whether you're launching a startup, refreshing your identity, or craving campaigns that actually convert, our team blends strategic thinking with boundary-pushing creativity to deliver results that matter. We're not just designers, writers, or marketers; we're your partners in crafting unforgettable experiences.",
                        description: "Your brand is more than colors and logos it's the soul of your business. We specialize in crafting distinctive identities that tell your story, connect with your audience, and drive real results. From startups to established companies, we build brands that stand the test of time. Ready to make your mark? Let's begin your brand transformation today.",
                        moreAboutUs: "More About Us"
                    },
                    stats: {
                        yearsExperience: "Years of experience",
                        successfulProjects: "Successfully projects",
                        teamMembers: "International team members",
                        clientSatisfaction: "Clients satisfied & retention"
                    },
                    portfolio: {
                        kineticSandscapes: "Kinetic Sandscapes",
                        brooklynBrewery: "Brooklyn Brewery",
                        regenerative: "Regenerative",
                        hopscotchPayments: "Hopscotch Payments",
                        storiesWorthwhile: "Stories Worthwhile",
                        fintechAccelerator: "Fintech Accelerator"
                    },
                    services: {
                        mainHeading: "Where Conventional Thinking Ends",
                        brandStrategy: "Brand Strategy",
                        brandStrategyDesc: "We craft bold brand strategies that define your purpose, differentiate your presence, and build loyalty at every touchpoint.",
                        webDevelopment: "Web Development",
                        webDevelopmentDesc: "From stunning landing pages to dynamic web apps, we code digital experiences that convert and connect seamlessly.",
                        uiuxDesign: "UI/UX Design",
                        uiuxDesignDesc: "We design intuitive, elegant interfaces that enhance usability and keep your users coming back for more.",
                        digitalMarketing: "Digital Marketing",
                        digitalMarketingDesc: "We blend creativity with data to build campaigns that attract, engage, and convert across all digital platforms.",
                        mediaProduction: "Media Production",
                        mediaProductionDesc: "From storyboarding to final cut, we create cinematic visuals and content that bring your brand story to life.",
                        strategyConsulting: "Strategy & Consulting",
                        strategyConsultingDesc: "Need direction? We provide actionable insights, market positioning, and growth strategies tailored for your brand."
                    },
                    testimonials: {
                        mainHeading: "Creativity Without the Pretentiousness",
                        testimonial1: "Working with this team was like finding the missing piece to our brand puzzle. They took our vague ideas and transformed them into a visual identity that feels unmistakably us. The website they built doesn't just look stunning it converts.",
                        client1: "Jessica Doe",
                        testimonial2: "Most agencies talk about innovation these folks actually deliver it. They challenged our assumptions, pushed us out of our comfort zone, and designed a campaign that made our competitors look outdated. The best part? They're ridiculously easy to work with.",
                        client2: "John Doe",
                        testimonial3: "We've hired four agencies over the years. This is the first time we've walked away thinking, Damn, that was worth every penny. From branding to web design, their attention to detail is obsessive in the best way.",
                        client3: "Eric Smith"
                    },
                    companies: {
                        title: "Trusted by great companies like"
                    },
                    blog: {
                        title: "Breaking Creative Boundaries Daily",
                        article1: "Ready to transform your brand into something extraordinary",
                        article2: "Your vision deserves world-class execution",
                        article3: "Don't just compete—dominate. Partner with our creative team",
                        date: "June 2, 2025"
                    },
                    footer: {
                        contactTitle: "Contact",
                        address: "245 West 52nd Street, Apt 7B New York, NY 10019",
                        email: "hello@yoursite.com",
                        phone: "+1 874 414 7890",
                        agency: "Agency",
                        servicesFooter: "Services",
                        rightsReserved: "All rights reserved — 2025 © DesignsNinja"
                    }
                },
                he: {
                    nav: {
                        home: "בית",
                        catalog: "קטלוג",
                        services: "שירותים",
                        about: "אודות",
                        contact: "צור קשר",
                        projects: "פרויקטים",
                        pages: "עמודים",
                        team: "הצוות שלנו",
                        teamDetails: "פרטי הצוות",
                        pricing: "מחירון",
                        faq: "שאלות נפוצות",
                        digitalAgency: "סוכנות דיגיטלית",
                        creativeAgency: "סוכנות יצירתית",
                        designStudio: "סטודיו עיצוב",
                        startupAgency: "סוכנות סטארטאפ",
                        digitalMarketing: "שיווק דיגיטלי",
                        modernAgency: "סוכנות מודרנית",
                        creativeStudio: "סטודיו יצירתי",
                        personalPortfolio: "תיק עבודות אישי",
                        photography: "צילום",
                        blogs: "בלוגים",
                        blogDetails: "פרטי בלוג",
                        aboutPages: "עמודי אודות",
                        servicesPages: "עמודי שירותים",
                        servicesDetails: "פרטי שירותים",
                        errorPage: "עמוד שגיאה 404",
                        about02: "אודות 02",
                        digitalStudio: "סטודיו דיגיטלי",
                        projectDetails: "פרטי פרויקט"
                    },
                    hero: {
                        title: "טכנולוגיה מתקדמת לקליניקה שלך",
                        subtitle: "ציוד יופי מקצועי",
                        description: "שדרג את הקליניקה שלך עם ציוד יופי מקצועי. תמחור שקוף, תמיכה מקומית וטכנולוגיה הגדלה עם העסק שלך.",
                        clients: "יש לנו 500+ קליניקות מרוצות בישראל"
                    },
                    page: {
                        title: "דוידוב טיפוח יופי - ציוד מקצועי לקליניקות"
                    },
                    heroStats: {
                        marketingSpend: "10 מיליון דולר+ השקעה בשיווק",
                        ambassadorPartner: "שותף שגריר ראשון לשיווק בארה״ב",
                        passionatePartner: "10+ שותפים נלהבים"
                    },
                    cta: {
                        remarkable: "בואו ניצור יחד משהו יוצא דופן",
                        remarkableDesc: "החזון שלך ראוי לביצוע ברמה עולמית. צור איתנו קשר עכשיו ובואו נהפוך את הרעיונות שלך לחוויות בלתי נשכחות.",
                        viewMoreWorks: "צפה בעבודות נוספות",
                        viewDetails: "צפה בפרטים"
                    },
                    about: {
                        mainHeading: "מותגים גדולים לא קורים במקרה - הם נבנים בכוונה. בין אם אתם מפתחים סטארטאפ, מרעננים את הזהות שלכם או משתוקקים לקמפיינים שבאמת מתרגמים לתוצאות, הצוות שלנו משלב חשיבה אסטרטגית עם יצירתיות פורצת דרך כדי לספק תוצאות חשובות. אנחנו לא רק מעצבים, כותבים או אנשי שיווק; אנחנו השותפים שלכם ביצירת חוויות בלתי נשכחות.",
                        description: "המותג שלך הוא יותר מצבעים ולוגואים - הוא הנשמה של העסק שלך. אנחנו מתמחים ביצירת זהויות ייחודיות שמספרות את הסיפור שלך, מתחברות לקהל שלך ומניבות תוצאות אמיתיות. מסטארטאפים ועד חברות מבוססות, אנחנו בונים מותגים שעומדים במבחן הזמן. מוכן לעשות את החותם שלך? בואו נתחיל את המהפך של המותג שלך עוד היום.",
                        moreAboutUs: "קרא עוד עלינו"
                    },
                    stats: {
                        yearsExperience: "שנות ניסיון",
                        successfulProjects: "פרויקטים מוצלחים",
                        teamMembers: "חברי צוות בינלאומי",
                        clientSatisfaction: "שביעות רצון לקוחות ושימור"
                    },
                    portfolio: {
                        kineticSandscapes: "נופי חול קינטיים",
                        brooklynBrewery: "מבשלת ברוקלין",
                        regenerative: "רגנרטיבי",
                        hopscotchPayments: "תשלומי הופסקוץ'",
                        storiesWorthwhile: "סיפורים שווים",
                        fintechAccelerator: "מאיץ פינטק"
                    },
                    services: {
                        mainHeading: "היכן שהחשיבה הקונבנציונלית נגמרת",
                        brandStrategy: "אסטרטגיית מותג",
                        brandStrategyDesc: "אנחנו יוצרים אסטרטגיות מותג נועזות שמגדירות את המטרה שלך, מבדילות את הנוכחות שלך ובונות נאמנות בכל נקודת מגע.",
                        webDevelopment: "פיתוח אתרים",
                        webDevelopmentDesc: "מדפי נחיתה מדהימים ועד אפליקציות אינטרנט דינמיות, אנחנו מקודדים חוויות דיגיטליות שמתרגמות ומתחברות בצורה חלקה.",
                        uiuxDesign: "עיצוב UI/UX",
                        uiuxDesignDesc: "אנחנו מעצבים ממשקים אינטואיטיביים ואלגנטיים שמשפרים את השימושיות ומחזירים את המשתמשים שלך שוב ושוב.",
                        digitalMarketing: "שיווק דיגיטלי",
                        digitalMarketingDesc: "אנחנו משלבים יצירתיות עם נתונים כדי לבנות קמפיינים שמושכים, מעסיקים ומתרגמים בכל הפלטפורמות הדיגיטליות.",
                        mediaProduction: "הפקת מדיה",
                        mediaProductionDesc: "מלוח התכנון ועד הגרסה הסופית, אנחנו יוצרים ויזואליים קולנועיים ותוכן שמחיה את סיפור המותג שלך.",
                        strategyConsulting: "אסטרטגיה וייעוץ",
                        strategyConsultingDesc: "צריכים כיוון? אנחנו מספקים תובנות מעשיות, מיקום בשוק ואסטרטגיות צמיחה המותאמות למותג שלכם."
                    },
                    testimonials: {
                        mainHeading: "יצירתיות ללא יוהרה",
                        testimonial1: "העבודה עם הצוות הזה הייתה כמו למצוא את החלק החסר בפאזל המותג שלנו. הם לקחו את הרעיונות המעורפלים שלנו והפכו אותם לזהות ויזואלית שמרגישה באופן חד משמעי שלנו. האתר שהם בנו לא רק נראה מדהים - הוא גם מתרגם.",
                        client1: "ג'סיקה דו",
                        testimonial2: "רוב הסוכנויות מדברות על חדשנות - האנשים האלה באמת מספקים אותה. הם אתגרו את ההנחות שלנו, דחפו אותנו מהאזור הנוח שלנו ועיצבו קמפיין שגרם למתחרים שלנו להיראות מיושנים. החלק הכי טוב? הם מגניבים לעבוד איתם.",
                        client2: "ג'ון דו",
                        testimonial3: "שכרנו ארבע סוכנויות לאורך השנים. זו הפעם הראשונה שיצאנו וחשבנו, לעזאזל, זה היה שווה כל אגורה. מברנדינג ועד עיצוב אתרים, תשומת הלב שלהם לפרטים היא אובססיבית בצורה הכי טובה.",
                        client3: "אריק סמית"
                    },
                    companies: {
                        title: "נבחרנו על ידי חברות מובילות כמו"
                    },
                    blog: {
                        title: "שוברים גבולות יצירתיים מדי יום",
                        article1: "מוכנים להפוך את המותג שלכם למשהו יוצא דופן",
                        article2: "החזון שלכם ראוי לביצוע ברמה עולמית",
                        article3: "אל תסתפקו בתחרות - שלטו. שותפו עם הצוות היצירתי שלנו",
                        date: "2 ביוני, 2025"
                    },
                    footer: {
                        contactTitle: "צור קשר",
                        address: "רחוב 52 מערב 245, דירה 7B ניו יורק, NY 10019",
                        email: "hello@yoursite.com",
                        phone: "+1 874 414 7890",
                        agency: "הסוכנות",
                        servicesFooter: "שירותים",
                        rightsReserved: "כל הזכויות שמורות — 2025 © DesignsNinja"
                    }
                }
            };
            
            this.translations = embeddedTranslations[lang] || embeddedTranslations.en;
        },
        
        /**
         * Get translation by key (supports nested keys with dot notation)
         */
        t: function(key) {
            const keys = key.split('.');
            let value = this.translations;
            
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    console.warn(`Translation key not found: ${key}`);
                    return key;
                }
            }
            
            return value;
        },
        
        /**
         * Apply translations to all elements with data-i18n attribute
         */
        applyTranslations: function() {
            // Translate text content
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.t(key);
                
                if (translation) {
                    element.textContent = translation;
                }
            });
            
            // Translate placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                const translation = this.t(key);
                
                if (translation) {
                    element.placeholder = translation;
                }
            });
            
            // Translate titles
            document.querySelectorAll('[data-i18n-title]').forEach(element => {
                const key = element.getAttribute('data-i18n-title');
                const translation = this.t(key);
                
                if (translation) {
                    element.title = translation;
                }
            });
            
            // Translate alt text
            document.querySelectorAll('[data-i18n-alt]').forEach(element => {
                const key = element.getAttribute('data-i18n-alt');
                const translation = this.t(key);
                
                if (translation) {
                    element.alt = translation;
                }
            });
            
            // Update page title if has data-i18n
            const pageTitle = document.querySelector('title[data-i18n]');
            if (pageTitle) {
                const key = pageTitle.getAttribute('data-i18n');
                const translation = this.t(key);
                if (translation) {
                    pageTitle.textContent = translation;
                }
            }
        },
        
        /**
         * Set RTL mode
         */
        setRTL: function(isRTL) {
            const html = document.documentElement;
            const body = document.body;
            
            if (isRTL) {
                html.setAttribute('dir', 'rtl');
                html.setAttribute('lang', 'he');
                body.classList.add('rtl');
                body.classList.remove('ltr');
                
                // Load RTL CSS if not already loaded
                if (!document.getElementById('rtl-styles')) {
                    const rtlLink = document.createElement('link');
                    rtlLink.id = 'rtl-styles';
                    rtlLink.rel = 'stylesheet';
                    rtlLink.href = 'assets/css/rtl.css';
                    document.head.appendChild(rtlLink);
                }
            } else {
                html.setAttribute('dir', 'ltr');
                html.setAttribute('lang', 'en');
                body.classList.add('ltr');
                body.classList.remove('rtl');
                
                // Remove RTL CSS if exists
                const rtlStyles = document.getElementById('rtl-styles');
                if (rtlStyles) {
                    rtlStyles.remove();
                }
            }
        },
        
        /**
         * Switch language
         */
        switchLanguage: async function(lang) {
            if (lang === this.currentLang) return;
            
            // Show loading indicator if exists
            const switcher = document.querySelector('.language-switcher');
            if (switcher) {
                switcher.classList.add('loading');
            }
            
            // Load new translations
            await this.loadTranslations(lang);
            
            // Update current language
            this.currentLang = lang;
            
            // Save to localStorage
            localStorage.setItem('selectedLanguage', lang);
            
            // Apply translations
            this.applyTranslations();
            
            // Set RTL
            this.setRTL(lang === 'he');
            
            // Update language switcher UI
            this.updateLanguageSwitcherUI();
            
            // Remove loading indicator
            if (switcher) {
                switcher.classList.remove('loading');
            }
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: lang }
            }));
        },
        
        /**
         * Initialize language switcher
         */
        initLanguageSwitcher: function() {
            // Try menu integration first, fallback to floating
            let switcher = document.querySelector('.language-switcher-menu');
            if (!switcher) {
                switcher = document.querySelector('.language-switcher');
            }
            if (!switcher) return;
            
            // Create language buttons if not exists
            if (!switcher.querySelector('.lang-btn')) {
                switcher.innerHTML = `
                    <button class="lang-btn" data-lang="en">
                        <span class="flag-icon">🇬🇧</span>
                        <span class="lang-name">English</span>
                    </button>
                    <button class="lang-btn" data-lang="he">
                        <span class="flag-icon">🇮🇱</span>
                        <span class="lang-name">עברית</span>
                    </button>
                `;
            }
            
            // Add click handlers
            switcher.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = btn.getAttribute('data-lang');
                    this.switchLanguage(lang);
                });
            });
            
            // Update UI
            this.updateLanguageSwitcherUI();
        },
        
        /**
         * Update language switcher UI
         */
        updateLanguageSwitcherUI: function() {
            // Try menu integration first, fallback to floating
            let switcher = document.querySelector('.language-switcher-menu');
            if (!switcher) {
                switcher = document.querySelector('.language-switcher');
            }
            if (!switcher) return;
            
            switcher.querySelectorAll('.lang-btn').forEach(btn => {
                const lang = btn.getAttribute('data-lang');
                if (lang === this.currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        },
        
        /**
         * Get current language
         */
        getCurrentLanguage: function() {
            return this.currentLang;
        },
        
        /**
         * Check if current language is RTL
         */
        isRTL: function() {
            return this.currentLang === 'he';
        }
    };
    
    // Make i18n globally available
    window.i18n = i18n;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => i18n.init());
    } else {
        i18n.init();
    }
})();