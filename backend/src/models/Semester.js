const mongoose = require('mongoose');
const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Semester', semesterSchema);