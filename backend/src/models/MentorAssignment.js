const mongoose = require('mongoose');

const mentorAssignmentSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  academicYear: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MentorAssignment', mentorAssignmentSchema);
