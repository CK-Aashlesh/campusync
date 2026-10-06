const User = require('../models/User');
const Student = require('../models/Student');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { buildStudentWelcomeEmail } = require('../utils/campusyncWelcomeEmail');

// @desc    Admit a new student
// @route   POST /api/admission
// @access  Private/Admission Staff or Admin
exports.admitStudent = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      enrollmentNumber, 
      contactNumber 
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Check if enrollment number exists
    const studentExists = await Student.findOne({ enrollmentNumber });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student with this enrollment number already exists' });
    }

    // Generate a temporary password (e.g. 8 random hex characters)
    const temporaryPassword = crypto.randomBytes(4).toString('hex');

    // 1. Create User account
    const user = await User.create({
      name,
      email,
      password: temporaryPassword,
      role: 'Student',
      isTemporaryPassword: true
    });

    // 2. Create Student profile (Barebones, they will complete it later)
    const student = await Student.create({
      user: user._id,
      enrollmentNumber,
      contactNumber
    });

    // 3. Send email to student with login credentials
    const { subject, html } = buildStudentWelcomeEmail({
        studentName: name,
        studentEmail: email,
        temporaryPassword,
        loginUrl: process.env.FRONTEND_URL || 'http://localhost:3000/login',
        heroImageUrl: 'https://res.cloudinary.com/qzdfihlt/image/upload/v1791006241/campusync-welcome-hero.png'
      });

      await sendEmail({
        to: email,
        subject: subject,
        html: html
      });
    
    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STUDENT_ADMITTED', 'Admitted student: ' + student.enrollmentNumber);
      res.status(201).json({
      success: true,
      data: student,
      message: 'Student admitted and email sent successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all admitted students
// @route   GET /api/admission/students
// @access  Private/Admission Staff or Admin
exports.getAdmittedStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email isActive')
      .populate('course', 'name code')
      .populate('batch', 'name')
      .populate('currentSemester', 'number')
      .populate('section', 'name');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Toggle student active status
// @route   DELETE /api/admission/students/:id
// @access  Private/Admin
exports.toggleStudentStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const user = await User.findById(student.user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.isActive = !user.isActive;
    await user.save();
    
    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STUDENT_STATUS_TOGGLE', 'Toggled student ' + student.enrollmentNumber);
    res.status(200).json({ success: true, data: { isActive: user.isActive } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset student password
// @route   PUT /api/admission/students/:id/reset-password
// @access  Private/Admin
exports.resetStudentPassword = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const user = await User.findById(student.user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.password = 'password123';
    user.isTemporaryPassword = true;
    await user.save();
    
    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STUDENT_PASSWORD_RESET', 'Reset password for student ' + student.enrollmentNumber);
    res.status(200).json({ success: true, message: 'Password reset to default (password123)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile (Admin)
// @route   PUT /api/admission/students/:id
// @access  Private/Admin
exports.updateStudentByAdmin = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STUDENT_UPDATED', 'Updated student ' + student.enrollmentNumber);
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


