const express = require('express');
const router = express.Router();
const { getCourseRecommendations } = require('../controllers/gptController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Only authenticated students can request course recommendations
router.post('/recommend', authenticate, authorize('student'), getCourseRecommendations);

module.exports = router;
