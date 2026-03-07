const { detectStyle } = require('../services/aiService');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }

    const imagePath = `/${req.file.path.replace(/\\/g, '/')}`; // Ensure normal slashes
    
    // Call AI Service
    const tags = await detectStyle(imagePath);

    res.status(200).json({
      message: 'Image uploaded successfully',
      imagePath,
      tags,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
