const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
} = require('../controllers/enrollmentController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// All enrollment routes require authentication
router.use(authenticate);

// Student-only enrollment endpoints
router.post('/', authorize('student'), enrollCourse);
router.get('/my-courses', authorize('student'), getMyCourses);

module.exports = router;
