const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existing = await Enrollment.findOne({ student: req.user.userId, course: courseId });
    if (existing) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user.userId,
      course: courseId,
      status: 'active',
    });

    return res.status(201).json({ message: 'Successfully enrolled in the course', enrollment });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.userId })
      .populate({
        path: 'course',
        select: 'title description content instructor createdAt',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort({ enrolledAt: -1 });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 });

    const students = enrollments.map((item) => ({
      id: item.student?._id,
      name: item.student?.name || 'Unknown',
      email: item.student?.email || 'Unknown',
      status: item.status,
      enrolledAt: item.enrolledAt,
    }));

    return res.status(200).json(students);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { enrollCourse, getMyCourses, getEnrolledStudents };
