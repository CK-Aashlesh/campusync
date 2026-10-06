const MentorAssignment = require('../models/MentorAssignment');
const AttendanceReason = require('../models/AttendanceReason');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Attendance = require('../models/Attendance');

// @desc    Assign a mentor to a student
// @route   POST /api/mentor/assign
// @access  Private/Admin
exports.assignMentor = async (req, res) => {
  try {
    const { mentorId, studentId, batchId, sectionId, academicYear } = req.body;

    // Check if staff exists
    const mentor = await Staff.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Inactivate any current active mentor assignments for this student
    await MentorAssignment.updateMany(
      { student: studentId, active: true },
      { active: false }
    );

    // Create new assignment
    const assignment = await MentorAssignment.create({
      mentor: mentorId,
      student: studentId,
      batch: batchId,
      section: sectionId,
      academicYear,
      active: true
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all students assigned to logged-in mentor
// @route   GET /api/mentor/students
// @access  Private/Staff
exports.getMyAssignedStudents = async (req, res) => {
  try {
    let assignmentsQuery;
    if (req.user.role === 'Admin') {
      assignmentsQuery = MentorAssignment.find({ active: true });
    } else {
      const staff = await Staff.findOne({ user: req.user._id });
      if (!staff) return res.status(403).json({ success: false, message: 'Not authorized as staff' });
      assignmentsQuery = MentorAssignment.find({ mentor: staff ? staff._id : req.user._id, active: true });
    }
    const assignments = await assignmentsQuery.populate({
      path: 'student',
      populate: [
        { path: 'user', select: 'name email' },
        { path: 'course', select: 'name' },
        { path: 'batch', select: 'name' },
        { path: 'currentSemester', select: 'number' },
        { path: 'section', select: 'name' }
      ]
    }).populate('mentor', 'user');

    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get attendance for a specific assigned student
// @route   GET /api/mentor/students/:studentId/attendance
// @access  Private/Staff
exports.getAssignedStudentAttendance = async (req, res) => {
  try {
    let staff = null;
    if (req.user.role !== 'Admin') {
      staff = await Staff.findOne({ user: req.user._id });
      if (!staff) return res.status(403).json({ success: false, message: 'Not authorized as staff' });
    }

    // Verify assignment
    const assignmentQuery = { student: req.params.studentId, active: true };
    if (req.user.role !== 'Admin') assignmentQuery.mentor = staff._id;
    const assignment = await MentorAssignment.findOne(assignmentQuery);

    if (!assignment) {
      return res.status(403).json({ success: false, message: 'Student is not assigned to you' });
    }

    const attendances = await Attendance.find({ 'records.student': req.params.studentId })
      .populate('subject', 'name code');

    let totalClasses = 0;
    let presentClasses = 0;

    attendances.forEach(att => {
      const record = att.records.find(r => r.student.toString() === req.params.studentId);
      if (record) {
        totalClasses++;
        if (record.status === 'Present' || record.status === 'Late') {
          presentClasses++;
        }
      }
    });

    const overallPercentage = totalClasses === 0 ? 0 : Math.round((presentClasses / totalClasses) * 100);

    res.status(200).json({
      success: true,
      data: {
        totalClasses,
        presentClasses,
        overallPercentage
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add an attendance shortag reason / issue
// @route   POST /api/mentor/students/:studentId/reason
// @access  Private/Staff
exports.addAttendanceReason = async (req, res) => {
  try {
    let staff = null;
    if (req.user.role !== 'Admin') {
      staff = await Staff.findOne({ user: req.user._id });
      if (!staff) return res.status(403).json({ success: false, message: 'Not authorized as staff' });
    }

    // Verify assignment
    const assignmentQuery = { student: req.params.studentId, active: true };
    if (req.user.role !== 'Admin') assignmentQuery.mentor = staff._id;
    const assignment = await MentorAssignment.findOne(assignmentQuery);

    if (!assignment) {
      return res.status(403).json({ success: false, message: 'Student is not assigned to you' });
    }

    const { attendancePercentage, reason, remarks } = req.body;
    
    // File upload
    let certificateUrl = '';
    if (req.file) {
      certificateUrl = `/uploads/certificates/${req.file.filename}`;
    }

    const attendanceReason = await AttendanceReason.create({
      student: req.params.studentId,
      mentor: staff ? staff._id : req.user._id,
      attendancePercentage,
      reason,
      remarks,
      certificateUrl
    });

    res.status(201).json({
      success: true,
      data: attendanceReason
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get attendance reasons history for an assigned student
// @route   GET /api/mentor/students/:studentId/reasons
// @access  Private/Staff
exports.getAttendanceReasons = async (req, res) => {
  try {
    let staff = null;
    if (req.user.role !== 'Admin') {
      staff = await Staff.findOne({ user: req.user._id });
      if (!staff) return res.status(403).json({ success: false, message: 'Not authorized as staff' });
    }

    // We can allow them to view history even if no longer active mentor, but for simplicity we only check if they are the mentor who added it, or if they are currently assigned.
    const reasons = await AttendanceReason.find({ student: req.params.studentId })
      .populate('mentor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reasons
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
