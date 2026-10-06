const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One user account = one staff profile
    },
    employeeId: {
      type: String,
      required: [true, 'Please provide an employee ID'],
      unique: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department'],
    },
    designation: {
      type: String,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    bloodGroup: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    profilePhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Staff', staffSchema);
