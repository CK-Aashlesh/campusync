const mongoose = require('mongoose');

const attendanceReasonSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  attendancePercentage: { type: Number, required: true },
  reason: { type: String, required: true },
  remarks: { type: String },
  certificateUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceReason', attendanceReasonSchema);
