const mongoose = require('mongoose');
const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description, and content are required' });
    }

    const course = await Course.create({
      title,
      description,
      content,
      instructor: req.user.userId,
    });

    return res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

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
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCourseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(req.params.id).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    const { title, description, content } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    if (content) course.content = content;

    const updated = await course.save();
    return res.status(200).json({ message: 'Course updated successfully', course: updated });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };
