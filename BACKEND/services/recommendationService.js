const { cosineSimilarity } = require('../utils/similarity');
const { checkBodyTypeMatch } = require('../utils/bodyType');
const { rankProducts } = require('../utils/rankingAlgorithm');
const Design = require('../models/designModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

const getRecommendations = async (userId, tags) => {
  try {
    // 1. Load user for body type matching
    let user;
    try {
      user = await User.findById(userId);
    } catch (dbError) {
      console.warn('Database user lookup failed, using default user profile');
    }
    if (!user) user = { body_type: 'rectangle', biometrics_weight: null };

    // 2. Load products (MongoDB with JSON fallback)
    let products;
    try {
      products = await Design.find();
    } catch (dbError) {
      console.warn('MongoDB design lookup failed, falling back to JSON data');
      const dataPath = path.join(__dirname, '../data/products.json');
      const productsData = fs.readFileSync(dataPath, 'utf-8');
      products = JSON.parse(productsData);
    }

    // 3. Style + body type pre-scoring (enriches data before antigravity pass)
    const enriched = products.map(product => {
      let styleSimilarity = 0;
      if (product.aesthetic_vector && product.aesthetic_vector.length > 0) {
        // Use cosine similarity if embedding available
        const mockUserEmbedding = [0.1, 0.2, 0.3, 0.4];
        styleSimilarity = cosineSimilarity(mockUserEmbedding, product.aesthetic_vector);
      } else {
        styleSimilarity = tags.includes(product.style) ? 1.0 : 0.2;
      }

      const bodyTypeMultiplier = checkBodyTypeMatch(user.body_type, product.category || 'shirt');

      // Attach as recent_interactions proxy so antigravity algo can use it
      return {
        ...product,
        recent_interactions: Math.round(styleSimilarity * bodyTypeMultiplier * 10),
        total_interactions: product.total_interactions || (product.popularity_score || 5) * 2
      };
    });

    // 4. Apply antigravity ranking (time-decay + velocity + style match)
    const ranked = rankProducts(enriched, tags);

    return ranked.slice(0, 10);

  } catch (error) {
    console.error('Recommendation Error:', error.message);
    throw error;
  }
};

module.exports = { getRecommendations };

