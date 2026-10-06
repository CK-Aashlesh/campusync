const mongoose = require('mongoose');
const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Batch', batchSchema);