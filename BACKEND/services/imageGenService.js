/**
 * Image Generation Service - Together AI (FLUX.1-schnell)
 * Takes a text prompt from the Vision Service and generates
 * a novel fashion image using Together AI's FLUX model.
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOGETHER_API_URL = 'https://api.together.xyz/v1/images/generations';
const IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell-Free';

/**
 * Generates a fashion image from a text prompt using Together AI's FLUX model.
 *
 * @param {string} prompt - The detailed fashion description prompt from visionService
 * @param {Object} options - Optional generation parameters
 * @param {number} options.width - Image width (default: 1024)
 * @param {number} options.height - Image height (default: 1024)
 * @param {number} options.steps - Number of diffusion steps (default: 4 for schnell)
 * @param {number} options.n - Number of images to generate (default: 1)
 * @returns {Object} { image_url, image_base64 }
 */
const generateImage = async (prompt, options = {}) => {
  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ TOGETHER_API_KEY not set. Returning mock generated image.');
    return getMockImage();
  }

  const {
    width = 1024,
    height = 1024,
    steps = 4,
    n = 1
  } = options;

  // Enhance the prompt with fashion-specific quality boosters
  const enhancedPrompt = `${prompt}. Professional fashion photography, studio lighting, clean background, high resolution, editorial quality, 8k detail.`;

  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: IMAGE_MODEL,
        prompt: enhancedPrompt,
        width,
        height,
        steps,
        n,
        response_format: 'b64_json'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const imageData = response.data.data[0];
    const base64Image = imageData.b64_json;

    // Save the generated image to the uploads/generated/ directory
    const generatedDir = path.join(__dirname, '..', 'uploads', 'generated');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }

    const filename = `generated-${Date.now()}.png`;
    const filePath = path.join(generatedDir, filename);
    fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));

    const imageUrl = `/uploads/generated/${filename}`;

    console.log('✅ Image generated successfully:', imageUrl);

    return {
      image_url: imageUrl,
      image_base64: `data:image/png;base64,${base64Image}`
    };

  } catch (error) {
    console.error('❌ Image Generation Error:', error.response?.data || error.message);
    console.warn('⚠️ Falling back to mock generated image.');
    return getMockImage();
  }
};

/**
 * Returns a mock generated image for development/demo when no API key is set
 */
const getMockImage = () => ({
  image_url: '/uploads/generated/mock-generated.png',
  image_base64: null,
  mock: true
});

module.exports = { generateImage };
