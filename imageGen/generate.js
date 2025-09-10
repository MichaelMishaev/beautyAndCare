import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Missing GEMINI_API_KEY in .env file');

const client = new GoogleGenerativeAI({ apiKey });

// Professional beauty equipment prompts for Davidov Beauty Care
const beautyEquipmentPrompts = {
  // Hero Images (1920x1080)
  hero: [
    `Ultra-modern beauty clinic interior with professional diode laser equipment, Israeli clinic setting, clean white walls, soft professional lighting, contemporary furniture, medical-grade equipment visible, welcoming atmosphere, high-end photography, 8k detail, photorealistic`,
    
    `Professional Israeli beauty therapist performing laser hair removal treatment on client, modern treatment room, advanced diode laser machine with cooling system, comfortable medical chair, professional interaction, clinical excellence, natural lighting, catalog quality`,
    
    `Elegant beauty clinic reception in Tel Aviv, modern minimalist design, Davidov equipment brochures visible, Hebrew signage, professional atmosphere, natural light, contemporary interior, premium clinic feel, architectural photography`
  ],

  // Device Showcase (800x600)  
  devices: [
    `Professional diode laser hair removal machine, clinic-grade equipment, sleek white and blue design, touchscreen display showing Hebrew interface, cooling handpieces attached, pristine condition, studio lighting, product photography, white background with soft shadows, 8k detail`,
    
    `Triple wavelength laser handpiece close-up, sapphire cooling tip, professional medical device, ergonomic design, blue LED indicators active, premium build quality, macro photography, shallow depth of field, product catalog style`,
    
    `Advanced laser control panel and touchscreen interface, Hebrew language display, treatment parameters visible, skin temperature monitoring readout, professional medical UI, modern design, clear readable text, studio lighting`,
    
    `Complete diode laser system setup, main unit with multiple handpieces, professional trolley, organized cables, clinical environment, side angle view, professional product photography, medical equipment catalog style`,
    
    `Professional beauty equipment comparison, multiple laser devices side by side, Davidov branding visible, size comparison, clean studio setup, catalog presentation, premium medical equipment, professional lighting`
  ],

  // Service Images (600x400)
  services: [
    `Professional laser hair removal treatment in progress, therapist's hands operating handpiece, client comfort visible, advanced cooling system in use, clinical precision, natural interaction, soft professional lighting`,
    
    `Comprehensive skin analysis consultation, Israeli dermatologist examining client with advanced imaging technology, modern equipment, Hebrew documentation visible, professional medical consultation, caring interaction`,
    
    `Professional training session for beauty clinic staff, hands-on instruction with Davidov equipment, Hebrew training materials, modern training facility, educational environment, group learning`,
    
    `Before and after results display, smooth skin transformation showcased, professional medical photography, subtle presentation, clinical documentation, professional results gallery`,
    
    `Technical support visit, Davidov technician servicing equipment, professional maintenance, local Hebrew-speaking support, same-day service, technical expertise, professional service`
  ],

  // Client/Avatar Images (200x200)
  avatars: [
    `Professional headshot of satisfied Israeli clinic owner, friendly smile, medical professional attire, modern clinic background, successful business owner, confident expression, professional portrait lighting`,
    
    `Happy beauty therapist headshot, Israeli professional, white medical uniform, warm smile, professional appearance, clinic setting, medical professional portrait`,
    
    `Satisfied client testimonial photo, natural smile, professional setting, authentic happiness, Israeli customer, testimonial photo quality`
  ],

  // Backgrounds (1920x1080)
  backgrounds: [
    `Abstract medical technology background, soft blue and white gradient, subtle geometric patterns, professional healthcare aesthetic, clean modern design, subtle texture, medical industry style`,
    
    `Modern clinic interior background, blurred depth of field, soft lighting, professional atmosphere, medical equipment silhouettes, clean aesthetic, healthcare environment`,
    
    `Subtle technology pattern background, hexagonal medical motifs, light blue and white color scheme, professional presentation backdrop, modern healthcare design`
  ],

  // Trust/Badge Icons (200x200)
  badges: [
    `Professional certification badge icon, 24/7 Hebrew support symbol, blue and white Israeli colors, medical certification seal, trustworthy design, professional badge`,
    
    `Transparent pricing guarantee badge, Israeli shekel symbol prominent, clean design, professional trust seal, honest pricing icon, business ethics badge`,
    
    `Same-day service delivery icon, Tel Aviv area coverage, local service badge, rapid response symbol, professional service guarantee, Israeli business emblem`,
    
    `Full warranty protection badge, comprehensive coverage symbol, professional guarantee seal, security and trust icon, medical equipment warranty, reliable service badge`
  ]
};

async function generateImage(prompt, filename, category = 'general') {
  try {
    const model = 'gemini-2.5-flash-image-preview'; // nano-banana
    
    console.log(`🎨 Generating ${category}: ${filename}...`);
    console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);
    
    const res = await client.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
    });

    // Check response and extract image data
    if (!res.response || !res.response.candidates || res.response.candidates.length === 0) {
      throw new Error('No candidates returned from API');
    }
    
    const candidate = res.response.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('No content parts in response');
    }
    
    const part = candidate.content.parts[0];
    if (!part.inlineData || !part.inlineData.data) {
      throw new Error('No image data in response');
    }
    
    // Convert base64 to buffer
    const imageData = Buffer.from(part.inlineData.data, 'base64');
    fs.mkdirSync('out', { recursive: true });
    fs.mkdirSync(`out/${category}`, { recursive: true });
    
    const outputPath = `out/${category}/${filename}`;
    fs.writeFileSync(outputPath, imageData);
    
    console.log(`✅ Saved: ${outputPath}`);
    return outputPath;
    
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return null;
  }
}

async function generateSingleImage(promptKey, index = 0) {
  const category = promptKey;
  const prompts = beautyEquipmentPrompts[category];
  
  if (!prompts || prompts.length === 0) {
    console.error(`❌ No prompts found for category: ${category}`);
    return;
  }
  
  const prompt = prompts[index] || prompts[0];
  const filename = `${category}-${index + 1}.png`;
  
  return await generateImage(prompt, filename, category);
}

async function generateCategory(category) {
  const prompts = beautyEquipmentPrompts[category];
  if (!prompts) {
    console.error(`❌ Category not found: ${category}`);
    return;
  }
  
  console.log(`\n🚀 Starting generation for category: ${category.toUpperCase()}`);
  console.log(`📊 Total images to generate: ${prompts.length}`);
  
  const results = [];
  
  for (let i = 0; i < prompts.length; i++) {
    const filename = `${category}-${i + 1}.png`;
    const result = await generateImage(prompts[i], filename, category);
    results.push(result);
    
    // Add delay to avoid rate limiting
    if (i < prompts.length - 1) {
      console.log('⏳ Waiting 2 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎨 Davidov Beauty Care - Image Generator

Usage:
  npm run gen <category> [index]     Generate specific category or single image
  npm run gen all                    Generate all categories
  npm run gen hero                   Generate all hero images
  npm run gen devices 2              Generate device image #2

Available categories:
  • hero        - Hero/banner images (3 images)
  • devices     - Equipment showcase (5 images) 
  • services    - Service/treatment photos (5 images)
  • avatars     - People/testimonials (3 images)
  • backgrounds - Abstract backgrounds (3 images)
  • badges      - Trust/certification badges (4 images)

Examples:
  npm run gen hero          # Generate all hero images
  npm run gen devices 1     # Generate first device image
  npm run gen all           # Generate everything
    `);
    return;
  }
  
  const [category, indexStr] = args;
  
  if (category === 'all') {
    console.log('🚀 Starting batch generation for ALL categories...\n');
    
    for (const cat of Object.keys(beautyEquipmentPrompts)) {
      await generateCategory(cat);
      console.log(`\n✅ Completed category: ${cat}`);
      
      // Longer delay between categories
      if (cat !== Object.keys(beautyEquipmentPrompts).slice(-1)[0]) {
        console.log('⏳ Waiting 5 seconds before next category...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    console.log('\n🎉 All categories completed!');
    console.log('📁 Check the ./out/ directory for generated images');
    return;
  }
  
  if (indexStr) {
    // Generate single image
    const index = parseInt(indexStr) - 1; // Convert to 0-based
    if (isNaN(index) || index < 0) {
      console.error('❌ Invalid index. Use positive numbers (1, 2, 3...)');
      return;
    }
    
    await generateSingleImage(category, index);
  } else {
    // Generate entire category
    await generateCategory(category);
  }
  
  console.log('\n✨ Generation completed!');
  console.log('📁 Check the ./out/ directory for your images');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});