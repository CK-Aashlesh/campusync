const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Section', sectionSchema);