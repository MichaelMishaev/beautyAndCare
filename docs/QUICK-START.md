# Quick Start: Generate Contextual Image

## 🚀 Generate Your Custom Image (2 Steps!)

### Step 1: Set Your API Key Securely

```bash
# Export API key as environment variable (secure method)
export IDEOGRAM_API_KEY="your_api_key_here"
```

**Get your API key from:** https://ideogram.ai

**Important:** Never commit API keys to git! The key should only be in your environment variables.

### Step 2: Run Generation Script

```bash
npm run generate-image
```

Or directly:
```bash
node generate-why-section-image.js
```

### Step 3: Refresh Page
Open `home2.html` in your browser - the new image will appear in the "למה דוידוב?" section!

---

## 📋 What Gets Generated

**Contextual AI Image of:**
- Professional medical aesthetic equipment
- Modern clinic environment
- Advanced laser machines and devices
- Clean, professional aesthetic
- Photorealistic quality

**Saved to:** `assets/images/generated/why-section-equipment.png`

---

## 🎨 Current Setup

✅ **Script created:** `generate-why-section-image.js`
✅ **Directory created:** `assets/images/generated/`
✅ **home2.html updated:** Points to generated image
✅ **Fallback configured:** Uses Unsplash if generation fails

---

## 💡 No API Key? No Problem!

The page currently uses a fallback image from Unsplash API. You can:

1. **Keep the fallback** - Random medical/tech images (dynamic)
2. **Use a static placeholder** - Upload your own image
3. **Generate with AI** - Follow steps above for custom contextual image

---

## 🔧 Customization

Want to change the generated image? Edit the prompt in `generate-why-section-image.js`:

```javascript
const prompt = `YOUR CUSTOM PROMPT HERE,
photorealistic, professional quality, 4:3`;
```

Then re-run: `npm run generate-image`

---

## 📊 Image Specs

- **Aspect Ratio:** 4:3 (optimal for product display)
- **Style:** Realistic, photorealistic
- **Model:** Ideogram V_3 (latest)
- **Speed:** Turbo mode (fast generation)
- **Enhancement:** AUTO (AI enhances your prompt)

---

## ❓ Troubleshooting

**Image not showing?**
- Check if file exists: `ls assets/images/generated/`
- Check browser console for errors
- Fallback image should load automatically

**Script fails?**
- Verify API key is set: `echo $IDEOGRAM_API_KEY`
- Check internet connection
- See full guide: `cat README-IMAGE-GENERATION.md`

---

## 🎯 Next Steps

1. Generate your custom image ✨
2. Customize other sections (optional)
3. Deploy your site! 🚀

**Need help?** See `README-IMAGE-GENERATION.md` for detailed guide.
