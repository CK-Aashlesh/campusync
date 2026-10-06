const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One user account = one student profile
    },
    enrollmentNumber: {
      type: String,
      required: [true, 'Please provide an enrollment number'],
      unique: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    currentSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
    currentMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    dateOfBirth: {
      type: Date,
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    guardianName: {
      type: String,
    },
    guardianContact: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    academicStatus: {
      type: String,
      enum: ['Active', 'Graduated', 'Dropped'],
      default: 'Active',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
