const { chromium } = require('playwright');

async function testLanguageSwitcher() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Navigate to the page
        await page.goto('file:///Users/michaelmishayev/Desktop/Boria/beautyCare/src/index.html');
        
        // Wait for the language switcher to load
        await page.waitForSelector('.language-switcher', { timeout: 10000 });
        
        // Take a screenshot of current state
        await page.screenshot({ path: 'language-switcher-current.png', fullPage: false });
        
        // Check if language switcher elements exist
        const switcherExists = await page.isVisible('.language-switcher');
        console.log('Language switcher visible:', switcherExists);
        
        // Check for language buttons
        const buttons = await page.$$('.lang-btn');
        console.log('Number of language buttons found:', buttons.length);
        
        // Get button text content
        for (let i = 0; i < buttons.length; i++) {
            const text = await buttons[i].textContent();
            const lang = await buttons[i].getAttribute('data-lang');
            const isActive = await buttons[i].evaluate(el => el.classList.contains('active'));
            console.log(`Button ${i + 1}: "${text}" (lang: ${lang}, active: ${isActive})`);
        }
        
        // Check computed styles of the switcher container
        const switcherStyles = await page.evaluate(() => {
            const switcher = document.querySelector('.language-switcher');
            if (!switcher) return null;
            
            const computed = window.getComputedStyle(switcher);
            return {
                position: computed.position,
                top: computed.top,
                right: computed.right,
                display: computed.display,
                background: computed.background,
                zIndex: computed.zIndex,
                padding: computed.padding,
                borderRadius: computed.borderRadius
            };
        });
        
        console.log('Language switcher styles:', switcherStyles);
        
        // Check if CSS file is loaded
        const cssLoaded = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            return links.some(link => link.href.includes('language-switcher.css'));
        });
        
        console.log('Language switcher CSS loaded:', cssLoaded);
        
        // Check for any console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('Console error:', msg.text());
            }
        });
        
        // Test clicking English button
        const englishBtn = await page.$('[data-lang="en"]');
        if (englishBtn) {
            await englishBtn.click();
            await page.waitForTimeout(1000);
            
            // Take screenshot after clicking
            await page.screenshot({ path: 'language-switcher-english-clicked.png', fullPage: false });
        }
        
        // Test clicking Hebrew button
        const hebrewBtn = await page.$('[data-lang="he"]');
        if (hebrewBtn) {
            await hebrewBtn.click();
            await page.waitForTimeout(1000);
            
            // Take screenshot after clicking Hebrew
            await page.screenshot({ path: 'language-switcher-hebrew-clicked.png', fullPage: false });
        }
        
    } catch (error) {
        console.error('Error testing language switcher:', error);
    } finally {
        await browser.close();
    }
}

testLanguageSwitcher();