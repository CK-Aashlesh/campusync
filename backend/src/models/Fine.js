const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  reason: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paymentDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Fine', fineSchema);
