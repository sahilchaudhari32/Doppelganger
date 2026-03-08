const express = require('express');
const router = express.Router();
const { createUser, getUserProfile } = require('../controllers/userController');
const { getMe, updateBiometrics, saveDesign, removeSavedDesign } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Auth-protected routes MUST come before /:id wildcard
router.get('/me', protect, getMe);
router.put('/me/biometrics', protect, updateBiometrics);
router.post('/me/saved', protect, saveDesign);
router.delete('/me/saved/:designId', protect, removeSavedDesign);

// Legacy routes (placed AFTER specific routes to avoid wildcard conflict)
// POST /api/users
router.post('/', createUser);
// GET /api/users/:id  — NOTE: keep this LAST
router.get('/:id', getUserProfile);

module.exports = router;

