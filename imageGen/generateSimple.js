import 'dotenv/config';
import fs from 'node:fs';

// Use your provided Imagine.art API for image generation
const IMAGINE_API_KEY = "Bearer vk-St6iIHZ2rwAaDhuqBJus3FMUoCfiaZunkSyt8KqOQeAoc";
const API_URL = 'https://api.vyro.ai/v2/image/generations';

// Missing images to generate for Davidov Beauty Care
const missingImages = {
  'logo.png': `Professional medical logo for Davidov Beauty Care, modern minimalist design, blue and white color scheme, Hebrew and English text "דוידוב" and "Davidov", medical aesthetic equipment company, clean typography, trustworthy appearance, transparent background`,

  'hero-clinic.jpg': `Ultra-modern Israeli beauty clinic interior, professional diode laser equipment visible, clean white walls with blue accents, soft professional lighting, contemporary furniture, medical-grade equipment, welcoming atmosphere, Tel Aviv clinic, high-end photography, photorealistic`,

  'device-main.png': `Professional diode laser hair removal machine, clinic-grade equipment, sleek white and blue design, touchscreen display showing Hebrew interface, cooling handpieces attached, pristine condition, studio lighting, product photography, white background with soft shadows`,

  'treatment-room.jpg': `Modern beauty treatment room, professional laser equipment setup, comfortable medical chair, clean sterile environment, soft lighting, Israeli clinic setting, medical excellence, professional healthcare facility`,

  'client-testimonial-1.jpg': `Professional headshot of satisfied Israeli clinic owner, woman in her 40s, warm smile, medical professional attire, modern clinic background, successful businesswoman, confident expression, professional portrait lighting`,

  'bg-medical.jpg': `Abstract medical technology background, soft blue and white gradient, subtle geometric patterns, professional healthcare aesthetic, clean modern design, subtle texture, medical industry style, 1920x1080`,

  'badge-support.png': `Professional certification badge icon, 24/7 Hebrew support symbol, blue and white Israeli colors, medical certification seal, trustworthy design, professional badge, transparent background`,

  'service-consultation.jpg': `Professional skin consultation, Israeli dermatologist examining client with advanced imaging technology, modern equipment, Hebrew documentation visible, professional medical consultation, caring interaction`,

  'training-session.jpg': `Professional training session for beauty clinic staff, hands-on instruction with Davidov equipment, Hebrew training materials, modern training facility, educational environment, group learning`
};

async function generateImage(filename, prompt) {
  try {
    console.log(`🎨 Generating: ${filename}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', 'realistic');
    formData.append('aspect_ratio', '16:9');
    formData.append('seed', Math.floor(Math.random() * 1000).toString());

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': IMAGINE_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    // Check if response is JSON or direct image
    const contentType = response.headers.get('content-type');
    console.log(`📥 Response type: ${contentType}`);
    
    let imageBuffer;
    
    if (contentType && contentType.includes('application/json')) {
      // Response is JSON with image URL
      const result = await response.json();
      console.log('📄 JSON Response received');
      
      const imageUrl = result.image_url || result.url || result.data?.url || result.images?.[0]?.url;
      
      if (!imageUrl) {
        console.error('API Response:', result);
        throw new Error('No image URL found in JSON response');
      }
      
      console.log(`📥 Downloading from: ${imageUrl.substring(0, 50)}...`);
      
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      
      imageBuffer = await imageResponse.arrayBuffer();
    } else {
      // Response is direct image data
      console.log('🖼️  Direct image response received');
      imageBuffer = await response.arrayBuffer();
    }
    
    // Create output directories
    fs.mkdirSync('out', { recursive: true });
    fs.mkdirSync('out/generated', { recursive: true });
    
    const outputPath = `out/generated/${filename}`;
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✅ Saved: ${outputPath}`);
    
    // Also try to save to assets directory
    try {
      const assetsDir = '../assets/images';
      fs.mkdirSync(assetsDir, { recursive: true });
      fs.writeFileSync(`${assetsDir}/${filename}`, Buffer.from(imageBuffer));
      console.log(`📁 Also saved to: ${assetsDir}/${filename}`);
    } catch (error) {
      console.log(`⚠️  Could not save to assets: ${error.message}`);
    }
    
    return outputPath;
    
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return null;
  }
}

async function generateAllImages() {
  console.log('🚀 Starting image generation for Davidov Beauty Care...\n');
  console.log(`📊 Total images to generate: ${Object.keys(missingImages).length}\n`);
  
  const results = [];
  let successful = 0;
  let failed = 0;
  
  for (const [filename, prompt] of Object.entries(missingImages)) {
    const result = await generateImage(filename, prompt);
    results.push({ filename, result });
    
    if (result) {
      successful++;
    } else {
      failed++;
    }
    
    // Add delay between generations to avoid rate limiting
    console.log('⏳ Waiting 3 seconds before next generation...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🎉 Image generation completed!');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}\n`);
  
  console.log('📁 Generated images are available in:');
  console.log('  • ./out/generated/ (all generated images)');
  console.log('  • ../assets/images/ (ready to use in website)\n');
  
  return results;
}

async function generateSingle(filename) {
  if (!missingImages[filename]) {
    console.error(`❌ Image not found: ${filename}`);
    console.log('Available images:', Object.keys(missingImages).join(', '));
    return;
  }
  
  return await generateImage(filename, missingImages[filename]);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎨 Davidov Beauty Care - Simple Image Generator

Usage:
  node generateSimple.js all              Generate all missing images
  node generateSimple.js <filename>       Generate specific image

Available images:
${Object.keys(missingImages).map(name => `  • ${name}`).join('\n')}

Examples:
  node generateSimple.js all
  node generateSimple.js logo.png
  node generateSimple.js device-main.png
    `);
    return;
  }
  
  if (args[0] === 'all') {
    await generateAllImages();
  } else {
    await generateSingle(args[0]);
  }
  
  console.log('✨ Generation completed!');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});