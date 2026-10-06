const path = require('path');
const fs = require('fs');
let content = fs.readFileSync(path.join(__dirname, '../src/controllers/admissionController.js'), 'utf8');

content += `
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
`;

fs.writeFileSync(path.join(__dirname, '../src/controllers/admissionController.js'), content);
