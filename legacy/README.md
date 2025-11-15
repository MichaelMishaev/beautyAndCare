# Legacy Files

This directory contains archived/legacy code and files that are no longer actively used in the project but are kept for reference.

## Contents

### beautyCare/
- **Description**: Old project structure from previous version
- **Status**: Archived
- **Date Moved**: November 14, 2025
- **Contains**:
  - `src/services/imageGeneration.js` - Old image generation service

### imageGen/
- **Description**: Standalone Node.js image generation tool using Google Gemini API
- **Status**: Archived (replaced by main project's image service)
- **Date Moved**: November 14, 2025
- **API Used**: Google Generative AI (@google/generative-ai)
- **Contains**:
  - `generate.js` - Main generation script
  - `batchGenerate.js` - Batch image generator
  - `generateSimple.js` - Simplified generation tool
  - `package.json` - Separate Node.js project config
  - `out/` - Generated images output directory
- **Note**: The main website now uses `/services/imageGeneration.js` with Imagine.art API instead

## Active Project Files

The active project uses:
- **Main Entry**: `/index.html` (root directory)
- **Pages**: `/pages/` directory
- **Assets**: `/assets/` directory
- **Data**: `/data/` and `/content/` directories
- **Services**: `/services/` directory (including active image generation service)
- **Package**: `davidov-beauty-care` (root package.json)

## Note

Files in this directory are not used in production and are kept only for historical reference. If you need to restore any functionality, please review and update the code to match current project standards before integrating.
