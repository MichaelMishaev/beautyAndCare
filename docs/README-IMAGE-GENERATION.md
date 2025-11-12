# Image Generation Guide

## Generate Contextual Image for "Why Choose Us" Section

### Prerequisites

1. **Get Ideogram API Key**:
   - Sign up at https://ideogram.ai
   - Go to API settings
   - Generate an API key

2. **Set Environment Variable Securely**:

   **For macOS/Linux:**
   ```bash
   export IDEOGRAM_API_KEY="your_api_key_here"
   ```

   **For Windows (PowerShell):**
   ```powershell
   $env:IDEOGRAM_API_KEY="your_api_key_here"
   ```

   **For Windows (CMD):**
   ```cmd
   set IDEOGRAM_API_KEY=your_api_key_here
   ```

   **⚠️ SECURITY IMPORTANT:**
   - Never hardcode API keys in your code
   - Never commit API keys to git
   - Use environment variables only
   - The ideogram.md file is in .gitignore for security

### Generate the Image

```bash
# Run the generation script
node generate-why-section-image.js
```

### What Happens

1. Script sends a contextual prompt to Ideogram API
2. AI generates a professional medical equipment image
3. Image is downloaded and saved to: `assets/images/generated/why-section-equipment.png`
4. home2.html automatically uses this image

### Prompt Details

The script generates an image based on your "Why Choose Us" section context:
- Professional medical aesthetic equipment
- Modern clinic environment
- Advanced laser and body contouring devices
- Clean, clinical, professional aesthetic
- Photorealistic style

### Cost

- **Ideogram Free Tier**: 10 images per day
- **Turbo Mode**: Faster generation (used in script)
- Each generation = 1 credit

### Troubleshooting

**Error: API Key not found**
```bash
# Make sure you export the API key first
export IDEOGRAM_API_KEY="your_actual_key"
```

**Error: 429 Rate Limit**
- Wait 1 minute and try again
- Free tier has limits

**Error: Network timeout**
- Check your internet connection
- Try again in a few moments

### Alternative: Use Placeholder

If you don't have an API key yet, temporarily use:
```html
<img src="https://source.unsplash.com/800x600/?medical,equipment,clinic" alt="Medical Equipment">
```

### Output Example

```
🎨 Generating contextual image with Ideogram API...
📝 Prompt: Professional medical aesthetic equipment in modern clinic...

✅ Image generated successfully!
🔗 Image URL: https://ideogram.ai/api/images/...
📐 Resolution: 1024x768
✨ Enhanced Prompt: Professional medical aesthetic equipment...

📥 Downloading image...
✅ Image saved successfully!
📁 File location: /assets/images/generated/why-section-equipment.png

🎉 Done!
```
