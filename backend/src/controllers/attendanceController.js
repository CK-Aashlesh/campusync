const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Student = require('../models/Student');

// @desc    Get subjects assigned to the logged in faculty
// @route   GET /api/attendance/subjects
// @access  Private/Staff
exports.getFacultySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ assignedFaculty: req.user._id })
      .populate('course', 'name code')
      .populate('batch', 'name')
      .populate('semester', 'number')
      .populate('section', 'name');
    
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get students for a specific subject
// @route   GET /api/attendance/students/:subjectId
// @access  Private/Staff
exports.getStudentsForSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Ensure this faculty is assigned to the subject (or Admin)
    if (subject.assignedFaculty.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this subject' });
    }

    // Find students matching the subject's academic criteria
    const students = await Student.find({
      course: subject.course,
      batch: subject.batch,
      currentSemester: subject.semester,
      section: subject.section
    }).populate('user', 'name email').sort('enrollmentNumber');

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance for a subject
// @route   POST /api/attendance
// @access  Private/Staff
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, timeSlot, records } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (subject.assignedFaculty.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this subject' });
    }

    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0,0,0,0); 

    // Create bulk operations for the flat attendance model
    const bulkOps = records.map(record => ({
      updateOne: {
        filter: { 
          student: record.student,
          subject: subjectId,
          date: parsedDate,
          timeSlot: timeSlot || ''
        },
        update: {
          $set: {
            section: subject.section,
            semester: subject.semester,
            faculty: req.user._id,
            status: record.status,
            remarks: record.remarks
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);
    }

    return res.status(200).json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance history for a subject
// @route   GET /api/attendance/history/:subjectId
// @access  Private/Staff
exports.getAttendanceHistory = async (req, res) => {
  try {
    const rawHistory = await Attendance.find({ subject: req.params.subjectId })
      .sort({ date: -1, createdAt: -1 })
      .populate({
        path: 'student',
        select: 'enrollmentNumber user',
        populate: { path: 'user', select: 'name' }
      });

    // Group the flat records back into date/timeSlot chunks for the frontend if needed
    // or just return them as flat. Assuming the frontend expects the original structure:
    const grouped = {};
    for (const record of rawHistory) {
      const key = `${record.date.toISOString()}_${record.timeSlot}`;
      if (!grouped[key]) {
        grouped[key] = {
          _id: key,
          date: record.date,
          timeSlot: record.timeSlot,
          subject: record.subject,
          faculty: record.faculty,
          records: []
        };
      }
      grouped[key].records.push({
        _id: record._id,
        student: record.student,
        status: record.status,
        remarks: record.remarks
      });
    }

    const history = Object.values(grouped).sort((a, b) => b.date - a.date);

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
