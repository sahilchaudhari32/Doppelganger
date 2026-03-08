const { analyzeImages } = require('../services/visionService');
const { generateImage } = require('../services/imageGenService');
const db = require('../config/db');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || (!req.files.inspirations && !req.files.purchases)) {
      res.status(400);
      throw new Error('No image files provided for inspirations or purchases');
    }

    const inspirationFiles = req.files.inspirations || [];
    const purchaseFiles = req.files.purchases || [];

    console.log(`📸 Received ${inspirationFiles.length} inspiration(s), ${purchaseFiles.length} purchase(s)`);

    // ── STEP 1: Vision Analysis ──
    // Send all uploaded images to Llama Vision to extract style metadata
    const analysis = await analyzeImages(inspirationFiles, purchaseFiles);

    // ── STEP 2: Image Generation ──
    // Use the vision-generated prompt to create a novel fashion piece via FLUX
    const generatedImage = await generateImage(analysis.generation_prompt);

    // ── STEP 3: Fetch matching products from the catalog ──
    let recommendations = [];
    try {
      const styleTags = analysis.detected_styles || [];
      if (styleTags.length > 0) {
        // Try to find products matching the detected styles
        const placeholders = styleTags.map(() => '?').join(',');
        const [rows] = await db.query(
          `SELECT * FROM products WHERE style IN (${placeholders}) ORDER BY popularity_score DESC LIMIT 10`,
          styleTags
        );
        recommendations = rows || [];
      }
      // Fallback: if no style-matched products, return top products
      if (recommendations.length === 0) {
        const [rows] = await db.query('SELECT * FROM products ORDER BY popularity_score DESC LIMIT 10');
        recommendations = rows || [];
      }
    } catch (dbErr) {
      console.warn('⚠️ DB query for recommendations failed:', dbErr.message);
    }

    // ── RESPONSE ──
    res.status(200).json({
      analysis_result: {
        detected_styles: analysis.detected_styles,
        color_palette: analysis.color_palette,
        materials: analysis.materials,
        garment_type: analysis.garment_type
      },
      generated_design: {
        image_url: generatedImage.image_url,
        prompt_used: analysis.generation_prompt
      },
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
