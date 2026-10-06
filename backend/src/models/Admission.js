const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  temporaryRegistrationNumber: { type: String, unique: true },
  admissionDate: { type: Date, default: Date.now },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
