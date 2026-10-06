const Staff = require('../models/Staff');
const User = require('../models/User');
const Subject = require('../models/Subject');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new staff
// @route   POST /api/staff
// @access  Private/Admin
exports.createStaff = async (req, res) => {
  try {
    const { name, email, employeeId, department, designation, contactNumber } = req.body;

    const roleToCreate = req.body.role || 'Staff';
    if (!['Staff', 'Admission', 'Finance'].includes(roleToCreate)) {
      return res.status(400).json({ success: false, message: 'Invalid role for staff account' });
    }
    
    const generatedPassword = Math.random().toString(36).slice(-8);

    // 1. Create User account first
    const user = await User.create({
      name,
      email,
      password: generatedPassword,
      role: roleToCreate,
      isTemporaryPassword: true // By default force password change
    });

    // 2. Create Staff profile linked to the User
    const staff = await Staff.create({
      user: user._id,
      employeeId,
      department,
      designation,
      contactNumber,
    });
    
    // 3. Send email to the staff
    const message = `
      <h1>Welcome to CampuSync</h1>
      <p>Dear ${name},</p>
      <p>Your ${roleToCreate} account has been created successfully.</p>
      <p>Your login credentials are:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
      <p>You will be required to change your password upon your first login.</p>
      <p>Best Regards,<br>CampuSync Team</p>
    `;

    await sendEmail({
      to: email,
      subject: 'CampuSync - Account Created',
      html: message,
    });

    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_CREATED', 'Created staff ' + staff.employeeId);
    res.status(201).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Staff profile by themselves
// @route   PUT /api/staff/profile
// @access  Private/Staff
exports.updateStaffProfile = async (req, res) => {
  try {
    const { dateOfBirth, bloodGroup, gender, contactNumber, address } = req.body;
    let staff = await Staff.findOne({ user: req.user.id });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }

    staff = await Staff.findByIdAndUpdate(
      staff._id,
      { 
        dateOfBirth, 
        bloodGroup, 
        gender, 
        contactNumber, 
        address,
        ...(req.file && { profilePhoto: `/uploads/certificates/${req.file.filename}` })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private/Admin
exports.getStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find().populate('user', 'name email role isActive').populate('subjects', 'name code');
    res.status(200).json({
      success: true,
      count: staffs.length,
      data: staffs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in staff profile
// @route   GET /api/staff/me
// @access  Private/Staff
exports.getMeStaff = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user.id })
      .populate('user', 'name email role')
      .populate('subjects', 'name code');
      
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single staff
// @route   GET /api/staff/:id
// @access  Private/Admin or Staff (self)
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('user', 'name email role').populate('subjects', 'name code');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff profile
// @route   PUT /api/staff/:id
// @access  Private/Admin
exports.updateStaff = async (req, res) => {
  try {
    const { department, designation, contactNumber, address } = req.body;
    
    let staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { department, designation, contactNumber, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign subject to staff
// @route   PUT /api/staff/:id/subjects
// @access  Private/Admin
exports.assignSubject = async (req, res) => {
  try {
    const { subjectId } = req.body;

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Check if subject already assigned
    if (staff.subjects.includes(subjectId)) {
      return res.status(400).json({ success: false, message: 'Subject already assigned to this staff' });
    }

    staff.subjects.push(subjectId);
    await staff.save();

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle staff active status (soft delete)
// @route   DELETE /api/staff/:id
// @access  Private/Admin
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const user = await User.findById(staff.user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();
    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_STATUS_TOGGLE', 'Toggled staff ' + staff.employeeId);

    res.status(200).json({
      success: true,
      data: { isActive: user.isActive }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset staff password
// @route   PUT /api/staff/:id/reset-password
// @access  Private/Admin
exports.resetPassword = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    
    const user = await User.findById(staff.user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.password = 'password123'; // Default reset password
    user.isTemporaryPassword = true;
    await user.save();
    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_PASSWORD_RESET', 'Reset password for staff ' + staff.employeeId);
    
    res.status(200).json({ success: true, message: 'Password reset to default (password123)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
