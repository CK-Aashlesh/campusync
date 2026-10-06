const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Fee = require('../models/Fee');
const Fine = require('../models/Fine');

// @desc    Get current logged-in student's profile
// @route   GET /api/student/profile
// @access  Private/Student
exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email')
      .populate('course', 'name code')
      .populate('batch', 'name')
      .populate('currentSemester', 'number')
      .populate('section', 'name');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching student profile' });
  }
};

// @desc    Get current logged-in student's attendance summary
// @route   GET /api/student/attendance
// @access  Private/Student
exports.getMyAttendanceSummary = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Find all attendance documents where this student is present in the records array
    const attendances = await Attendance.find({ 'records.student': student._id })
      .populate('subject', 'name code');

    let totalClasses = 0;
    let presentClasses = 0;

    // Calculate per subject and overall
    const subjectStats = {};

    attendances.forEach(att => {
      const record = att.records.find(r => r.student.toString() === student._id.toString());
      if (record) {
        totalClasses++;
        
        const subId = att.subject._id.toString();
        if (!subjectStats[subId]) {
          subjectStats[subId] = {
            subjectName: att.subject.name,
            subjectCode: att.subject.code,
            total: 0,
            present: 0
          };
        }
        
        subjectStats[subId].total++;

        // Consider 'Present' and 'Late' as present for attendance calculation
        if (record.status === 'Present' || record.status === 'Late') {
          presentClasses++;
          subjectStats[subId].present++;
        }
      }
    });

    const overallPercentage = totalClasses === 0 ? 0 : Math.round((presentClasses / totalClasses) * 100);

    Object.values(subjectStats).forEach(stat => {
      stat.percentage = stat.total === 0 ? 0 : Math.round((stat.present / stat.total) * 100);
    });

    res.status(200).json({
      success: true,
      data: {
        overall: {
          totalClasses,
          presentClasses,
          percentage: overallPercentage
        },
        subjectWise: Object.values(subjectStats)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching student attendance' });
  }
};

// @desc    Update current logged-in student's profile (First login completion)
// @route   PUT /api/student/profile
// @access  Private/Student
exports.updateMyProfile = async (req, res) => {
  try {
    const { course, batch, currentSemester, section, bloodGroup, dateOfBirth, address, guardianName, guardianContact } = req.body;
    const student = await Student.findOneAndUpdate(
      { user: req.user._id },
      { 
        course, batch, currentSemester, section, bloodGroup,
        dateOfBirth, address, guardianName, guardianContact
      },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, data: student, message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged-in student's fees and fines
// @route   GET /api/student/finance
// @access  Private/Student
exports.getMyFeesAndFines = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const fees = await Fee.find({ student: student._id }).sort({ dueDate: 1 });
    const fines = await Fine.find({ student: student._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        fees,
        fines
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching finance data' });
  }
};
