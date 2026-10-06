const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester'
  },
  faculty: { // markedBy
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  timeSlot: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: true,
    default: 'Present'
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Prevent duplicate records for a student for the same subject/date/timeSlot
attendanceSchema.index({ student: 1, subject: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
