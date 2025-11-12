# i18n RTL Support - Hebrew & English

## Setup Complete ✅

The web app now has full RTL (Right-to-Left) support and Hebrew language translations.

## Files Added

1. **Translation Files:**
   - `assets/locales/en.json` - English translations
   - `assets/locales/he.json` - Hebrew translations

2. **JavaScript i18n System:**
   - `assets/js/i18n.js` - Complete internationalization system

3. **RTL Styles:**
   - `assets/css/rtl.css` - Comprehensive RTL styling

4. **Demo File:**
   - `i18n-demo.html` - Working demo showing all features

## How to Use

### 1. Add i18n Script to Your HTML
```html
<!-- Add before closing </head> tag -->
<script src="assets/js/i18n.js"></script>
```

### 2. Add Language Switcher
```html
<!-- Add after <body> tag -->
<div class="language-switcher"></div>
```

### 3. Add Translation Attributes

Use `data-i18n` attributes on elements you want to translate:

```html
<!-- Text content -->
<h1 data-i18n="hero.title">Welcome</h1>
<p data-i18n="hero.description">Description text</p>
<button data-i18n="common.submit">Submit</button>

<!-- Placeholders -->
<input type="text" data-i18n-placeholder="contact.name">

<!-- Titles (tooltips) -->
<button data-i18n-title="common.close">X</button>

<!-- Alt text for images -->
<img src="logo.png" data-i18n-alt="common.logo">
```

## Features

### Automatic Features
- **Browser Language Detection**: Automatically detects if user's browser is in Hebrew
- **RTL Layout**: Automatically switches to RTL when Hebrew is selected
- **Persistent Selection**: Language choice is saved in localStorage
- **Font Support**: Uses system fonts that support Hebrew characters

### Language Switcher
- Visual toggle between English 🇬🇧 and Hebrew 🇮🇱
- Fixed position for easy access
- Loading indicator during language switch
- Active state shows current language

### RTL Support Includes
- Text alignment reversal
- Flexbox direction reversal
- Margin/padding swapping
- Navigation menu RTL support
- Form input RTL support
- Button icon positioning
- Dropdown menu alignment
- Carousel control positioning
- Breadcrumb reversal
- Pagination reversal

## Translation Key Structure

Translations use nested JSON with dot notation:
```javascript
// Access via: data-i18n="nav.home"
{
  "nav": {
    "home": "Home"
  }
}
```

## JavaScript API

```javascript
// Get current language
const currentLang = i18n.getCurrentLanguage(); // 'en' or 'he'

// Check if RTL
const isRTL = i18n.isRTL(); // true/false

// Switch language programmatically
i18n.switchLanguage('he');

// Get translation
const translation = i18n.t('nav.home');

// Listen for language changes
document.addEventListener('languageChanged', (e) => {
  console.log('Language changed to:', e.detail.language);
});
```

## Testing

1. Open `i18n-demo.html` in your browser
2. Click the language switcher to toggle between English and Hebrew
3. Notice:
   - Text changes to Hebrew
   - Layout switches to RTL
   - Forms align right
   - Navigation reverses

## Adding New Translations

1. Edit `assets/locales/en.json` for English
2. Edit `assets/locales/he.json` for Hebrew
3. Add matching keys in both files
4. Use the key with `data-i18n` attribute in HTML

## Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers fully supported
- IE11 partial support (may need polyfills)

## Notes
- Hebrew font renders properly with system fonts
- RTL CSS is only loaded when Hebrew is active
- Language preference persists across sessions
- All Bootstrap components work correctly in RTL mode