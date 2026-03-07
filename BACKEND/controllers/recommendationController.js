const { getRecommendations } = require('../services/recommendationService');

const recommendProducts = (req, res, next) => {
  try {
    const { tags } = req.body;

    if (!tags || !Array.isArray(tags)) {
      res.status(400);
      throw new Error('Please provide an array of style tags');
    }

    const recommended = getRecommendations(tags);

    res.status(200).json(recommended);
  } catch (error) {
    next(error);
  }
};

module.exports = { recommendProducts };
