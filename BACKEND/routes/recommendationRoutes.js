const express = require('express');
const router = express.Router();
const { recommendProducts } = require('../controllers/recommendationController');

// POST /api/recommend
router.post('/', recommendProducts);

module.exports = router;
