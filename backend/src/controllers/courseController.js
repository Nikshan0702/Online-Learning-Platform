const mongoose = require('mongoose');
const Course = require('../models/Course');

// Create a new course (Instructor only)
const createCourse = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    // 1. Validate required fields
    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description, and content are required' });
    }

    // 2. Automatically assign logged-in instructor as course owner
    const newCourse = new Course({
      title,
      description,
      content,
      instructor: req.user.userId,
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      message: 'Course created successfully',
      course: savedCourse,
    });
  } catch (error) {
    console.error('Create course error:', error.message);
    return res.status(500).json({ message: 'Server error while creating course' });
  }
};

// Get all courses (supports optional ?mine=true for instructor's own courses)
const getAllCourses = async (req, res) => {
  try {
    const filter = {};
    if (req.query.mine === 'true' && req.user.role === 'instructor') {
      filter.instructor = req.user.userId;
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(courses);
  } catch (error) {
    console.error('Get courses error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

// Get course details by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(id).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error('Get course by ID error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching course details' });
  }
};

// Update course (Instructor owner only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check course ownership
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    // Update fields if provided
    if (title) course.title = title;
    if (description) course.description = description;
    if (content) course.content = content;

    const updatedCourse = await course.save();

    return res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Update course error:', error.message);
    return res.status(500).json({ message: 'Server error while updating course' });
  }
};

// Delete course (Instructor owner only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check course ownership
    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    await Course.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error.message);
    return res.status(500).json({ message: 'Server error while deleting course' });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
