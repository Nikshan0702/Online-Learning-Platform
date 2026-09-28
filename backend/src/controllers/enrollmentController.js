const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Enroll in a course (Student only)
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId || req.body.course;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    // 1. Check that the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Check whether the student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    // 3 & 4 & 5. Create enrollment with active status
    const enrollment = new Enrollment({
      student: req.user.userId,
      course: courseId,
      status: 'active',
      enrolledAt: new Date(),
    });

    await enrollment.save();

    return res.status(201).json({
      message: 'Successfully enrolled in the course',
      enrollment,
    });
  } catch (error) {
    console.error('Enroll error:', error.message);
    return res.status(500).json({ message: 'Server error while enrolling in course' });
  }
};

// Get all courses enrolled by the logged-in student
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.userId })
      .populate({
        path: 'course',
        select: 'title description content instructor createdAt',
        populate: {
          path: 'instructor',
          select: 'name email',
        },
      })
      .sort({ enrolledAt: -1 });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Get my courses error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching enrolled courses' });
  }
};

// Get enrolled students for a course (Course owner instructor only)
const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check that logged-in instructor owns this course
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 });

    // Map clean student data (excluding passwords/secrets)
    const students = enrollments.map((item) => ({
      id: item.student ? item.student._id : null,
      name: item.student ? item.student.name : 'Unknown',
      email: item.student ? item.student.email : 'Unknown',
      status: item.status,
      enrolledAt: item.enrolledAt,
    }));

    return res.status(200).json(students);
  } catch (error) {
    console.error('Get enrolled students error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching enrolled students' });
  }
};

module.exports = {
  enrollCourse,
  getMyCourses,
  getEnrolledStudents,
};
