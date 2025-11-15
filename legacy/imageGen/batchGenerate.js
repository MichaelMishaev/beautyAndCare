import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenerativeAI, toImageGenerationResponse } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Missing GEMINI_API_KEY in .env file');

const client = new GoogleGenerativeAI({ apiKey });

// Identify missing images in the site and generate replacements
const missingImages = {
  // Missing logo
  'logo.png': {
    prompt: `Professional medical logo for Davidov Beauty Care, modern minimalist design, blue and white color scheme, Hebrew and English text, medical aesthetic equipment company, clean typography, trustworthy appearance, transparent background`,
    category: 'branding',
    size: '150x50'
  },

  // Missing avatars
  'client-1-sm.jpg': {
    prompt: `Professional headshot of satisfied Israeli beauty clinic owner, woman in her 40s, warm smile, medical professional attire, modern clinic background, successful businesswoman, confident expression, professional portrait lighting`,
    category: 'avatars',
    size: '80x80'
  },

  'client-2-sm.jpg': {
    prompt: `Professional headshot of happy beauty therapist, Israeli woman in her 30s, white medical uniform, friendly smile, professional appearance, clinic setting, medical professional portrait`,
    category: 'avatars', 
    size: '80x80'
  },

  'client-3-sm.jpg': {
    prompt: `Professional headshot of satisfied male clinic owner, Israeli businessman in his 50s, suit and tie, confident smile, modern office background, successful entrepreneur portrait`,
    category: 'avatars',
    size: '80x80'
  },

  // Missing background
  'bg-parallax-1.jpg': {
    prompt: `Modern beauty clinic interior background, soft focus blur, professional medical environment, clean white and blue color scheme, elegant treatment rooms, natural lighting, premium healthcare facility, architectural photography`,
    category: 'backgrounds',
    size: '1920x1080'
  },

  // Missing project images (already exist but need better quality)
  'project-hero-1.png': {
    prompt: `Professional diode laser hair removal system, front 3/4 view, clinic-grade medical equipment, sleek white and blue design, touchscreen display, multiple handpieces, pristine condition, product photography, white background`,
    category: 'projects',
    size: '600x450'
  },

  'project-hero-2.png': {
    prompt: `Modern beauty clinic treatment room, professional laser equipment setup, comfortable medical chair, clean sterile environment, soft lighting, Israeli clinic setting, medical excellence`,
    category: 'projects',
    size: '600x450'
  },

  'project-hero-3.png': {
    prompt: `Happy Israeli client after successful laser treatment, natural smile, smooth skin results, professional medical photography, testimonial photo quality, authentic satisfaction`,
    category: 'projects',
    size: '600x450'
  },

  // Missing blog images
  'blog-hero-1.jpg': {
    prompt: `Professional article illustration about laser hair removal technology, medical infographic style, clean design, blue and white color scheme, educational visual, modern healthcare`,
    category: 'blog',
    size: '400x300'
  },

  'blog-hero-2.jpg': {
    prompt: `Beauty treatment consultation illustration, professional medical setting, doctor-patient interaction, modern clinic environment, educational healthcare visual`,
    category: 'blog',
    size: '400x300'
  },

  'blog-hero-3.jpg': {
    prompt: `Professional training and education illustration, beauty equipment learning, hands-on instruction, medical education visual, professional development`,
    category: 'blog',
    size: '400x300'
  },

  // Brand logos for trust section
  'davidov-logo-main.png': {
    prompt: `Davidov Beauty Care main logo, elegant medical equipment company branding, Hebrew and English text, blue and gold color scheme, professional medical aesthetic, transparent background`,
    category: 'branding',
    size: '200x100'
  }
};

async function generateMissingImage(filename, imageConfig) {
  try {
    const model = 'gemini-2.5-flash-image-preview';
    
    console.log(`🎨 Generating missing image: ${filename}`);
    console.log(`📝 Category: ${imageConfig.category} | Size: ${imageConfig.size}`);
    console.log(`📄 Prompt: ${imageConfig.prompt.substring(0, 100)}...`);
    
    const res = await client.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: imageConfig.prompt }]}],
    });

    const images = toImageGenerationResponse(res);
    if (!images?.images?.length) {
      throw new Error('No images returned from API');
    }
    
    const png = images.images[0].data;
    
    // Create output directories
    fs.mkdirSync('out', { recursive: true });
    fs.mkdirSync(`out/missing`, { recursive: true });
    fs.mkdirSync(`out/missing/${imageConfig.category}`, { recursive: true });
    
    const outputPath = `out/missing/${imageConfig.category}/${filename}`;
    fs.writeFileSync(outputPath, Buffer.from(png));
    
    console.log(`✅ Generated: ${outputPath}`);
    
    // Also save to the main assets directory if we can
    const assetsPath = `../assets/images/${filename}`;
    try {
      fs.mkdirSync(path.dirname(assetsPath), { recursive: true });
      fs.writeFileSync(assetsPath, Buffer.from(png));
      console.log(`📁 Also saved to: ${assetsPath}`);
    } catch (error) {
      console.log(`⚠️ Could not save to assets: ${error.message}`);
    }
    
    return outputPath;
    
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return null;
  }
}

async function copyToAssetsDirectory() {
  const sourceDir = 'out/missing';
  const targetDir = '../assets/images';
  
  if (!fs.existsSync(sourceDir)) {
    console.log('⚠️ No missing images directory found');
    return;
  }
  
  console.log('\n📁 Copying generated images to assets directory...');
  
  function copyRecursive(src, dest) {
    const items = fs.readdirSync(src);
    
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        console.log(`📋 Copied: ${item} to assets`);
      }
    }
  }
  
  try {
    copyRecursive(sourceDir, targetDir);
    console.log('✅ All images copied to assets directory');
  } catch (error) {
    console.error('❌ Error copying to assets:', error.message);
  }
}

async function generateAllMissing() {
  console.log('🚀 Starting generation of missing images for Davidov Beauty Care...\n');
  console.log(`📊 Total images to generate: ${Object.keys(missingImages).length}\n`);
  
  const results = [];
  let successful = 0;
  let failed = 0;
  
  for (const [filename, config] of Object.entries(missingImages)) {
    const result = await generateMissingImage(filename, config);
    results.push({ filename, result, config });
    
    if (result) {
      successful++;
    } else {
      failed++;
    }
    
    // Add delay between generations to avoid rate limiting
    console.log('⏳ Waiting 3 seconds before next generation...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🎉 Batch generation completed!');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}\n`);
  
  // Copy to assets directory
  await copyToAssetsDirectory();
  
  console.log('\n📁 Generated images are available in:');
  console.log('  • ./out/missing/ (organized by category)');
  console.log('  • ../assets/images/ (ready to use)\n');
  
  return results;
}

async function main() {
  try {
    await generateAllMissing();
    console.log('✨ All missing images generated successfully!');
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();