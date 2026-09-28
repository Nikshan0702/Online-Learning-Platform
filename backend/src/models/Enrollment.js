const mongoose = require('mongoose');

// Enrollment schema linking Student and Course
const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  status: {
    type: String,
    enum: ['active'],
    default: 'active',
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a student cannot enroll twice in the same course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
