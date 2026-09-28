const mongoose = require('mongoose');

// Course schema referencing the User model for instructor
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Course content is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('Course', courseSchema);
