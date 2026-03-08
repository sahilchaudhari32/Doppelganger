/**
 * Vision Service - Together AI (Llama-3.2-90B-Vision)
 * Analyzes uploaded fashion images and extracts style metadata
 * into a structured JSON prompt for image generation.
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const VISION_MODEL = 'meta-llama/Llama-Vision-Free';

/**
 * Converts a local image file to a base64 data URI
 */
const imageToBase64 = (filePath) => {
  const absolutePath = path.resolve(filePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase().replace('.', '');
  const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
};

/**
 * Analyzes multiple fashion images using Together AI's Vision model.
 * Returns a structured JSON with detected styles, colors, and a generation prompt.
 *
 * @param {Array} inspirationFiles - Array of multer file objects for style inspirations
 * @param {Array} purchaseFiles - Array of multer file objects for past purchases
 * @returns {Object} { detected_styles, color_palette, materials, generation_prompt }
 */
const analyzeImages = async (inspirationFiles = [], purchaseFiles = []) => {
  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ TOGETHER_API_KEY not set. Returning mock analysis.');
    return getMockAnalysis();
  }

  try {
    // Build the image content array for the vision model
    const imageContent = [];

    // Add inspiration images
    inspirationFiles.forEach((file, i) => {
      imageContent.push({
        type: 'text',
        text: `Style Inspiration Image ${i + 1}:`
      });
      imageContent.push({
        type: 'image_url',
        image_url: { url: imageToBase64(file.path) }
      });
    });

    // Add purchase images
    purchaseFiles.forEach((file, i) => {
      imageContent.push({
        type: 'text',
        text: `Past Purchase Image ${i + 1}:`
      });
      imageContent.push({
        type: 'image_url',
        image_url: { url: imageToBase64(file.path) }
      });
    });

    // Add the analysis instruction
    imageContent.push({
      type: 'text',
      text: `You are a world-class fashion AI analyst. Analyze ALL the images above carefully.

Some images are "Style Inspirations" (the aesthetic the user wants) and some are "Past Purchases" (clothes the user already owns and likes).

Your task: Combine the visual DNA of these images into a single cohesive fashion concept.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "detected_styles": ["style1", "style2", "style3"],
  "color_palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "materials": ["material1", "material2"],
  "garment_type": "the type of clothing to generate (e.g. jacket, dress, full outfit)",
  "generation_prompt": "A highly detailed 2-3 sentence description of a novel, stunning fashion piece that perfectly blends the aesthetic of all images. Include colors, textures, silhouette, and vibe. This will be used as an image generation prompt."
}`
    });

    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: imageContent
          }
        ],
        max_tokens: 512,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const rawText = response.data.choices[0].message.content.trim();

    // Parse the JSON from the response (handle potential markdown wrapping)
    let jsonStr = rawText;
    if (rawText.includes('```')) {
      jsonStr = rawText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const analysis = JSON.parse(jsonStr);
    console.log('✅ Vision analysis complete:', analysis.detected_styles);
    return analysis;

  } catch (error) {
    console.error('❌ Vision Service Error:', error.response?.data || error.message);
    console.warn('⚠️ Falling back to mock analysis.');
    return getMockAnalysis();
  }
};

/**
 * Returns a mock analysis for development/demo when no API key is set
 */
const getMockAnalysis = () => ({
  detected_styles: ['cyber-chrome', 'Y2K futurism', 'streetwear'],
  color_palette: ['#0B0B0F', '#00F0FF', '#7B61FF', '#FF2EA6'],
  materials: ['metallic nylon', 'reflective mesh'],
  garment_type: 'futuristic jacket',
  generation_prompt: 'A sleek cyber-chrome bomber jacket with reflective metallic nylon panels and neon cyan piping along the seams. The silhouette is oversized with a cropped hem, featuring holographic mesh inserts on the sleeves and a high-collar design reminiscent of Y2K futurism. The color palette blends deep black with electric cyan and violet accents.'
});

module.exports = { analyzeImages };
