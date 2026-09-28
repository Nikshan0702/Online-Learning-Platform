const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const { getEnrolledStudents } = require('../controllers/enrollmentController');

// All course routes require authentication
router.use(authenticate);

// Public / Authenticated user routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Instructor-only routes
router.post('/', authorize('instructor'), createCourse);
router.put('/:id', authorize('instructor'), updateCourse);
router.delete('/:id', authorize('instructor'), deleteCourse);
router.get('/:courseId/students', authorize('instructor'), getEnrolledStudents);

module.exports = router;

