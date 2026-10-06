const path = require('path');
const fs = require('fs');
const path = require('path');

const adminControllerPath = path.join(__dirname, '..', 'src', 'controllers', 'adminController.js');

const newMethods = `

exports.getPromotionStats = async (req, res) => {
  try {
    const semesterNumber = parseInt(req.params.semesterNumber, 10);
    // Find all semesters with this number
    const semesters = await Semester.find({ number: semesterNumber });
    const semesterIds = semesters.map(s => s._id);

    // Find active students in these semesters
    const students = await Student.find({
      currentSemester: { $in: semesterIds },
      academicStatus: 'Active' // We only want Active students to be promoted
    }).populate('course');

    const branchStats = {};
    for (const student of students) {
      if (!student.course) continue;
      const courseId = student.course._id.toString();
      if (!branchStats[courseId]) {
        branchStats[courseId] = {
          courseId,
          courseName: student.course.name,
          studentCount: 0
        };
      }
      branchStats[courseId].studentCount++;
    }

    res.status(200).json({
      success: true,
      data: Object.values(branchStats)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving promotion stats' });
  }
};

exports.getPromotionStudents = async (req, res) => {
  try {
    const semesterNumber = parseInt(req.params.semesterNumber, 10);
    const courseId = req.params.courseId;

    const semesters = await Semester.find({ number: semesterNumber });
    const semesterIds = semesters.map(s => s._id);

    const students = await Student.find({
      currentSemester: { $in: semesterIds },
      course: courseId,
      academicStatus: { $in: ['Active', undefined, null] } // Also catching undefined/null if any legacy data
    }).populate('user', 'name').sort({ enrollmentNumber: 1 });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving students for promotion' });
  }
};

exports.promoteSelectiveStudents = async (req, res) => {
  const session = await require('mongoose').startSession();
  session.startTransaction();
  try {
    const { studentIds, targetAction, currentSemesterNumber } = req.body;
    
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No students selected' });
    }

    const students = await Student.find({ _id: { $in: studentIds } }).populate('currentSemester').session(session);

    let processedCount = 0;

    for (const student of students) {
      // Validate
      if (student.academicStatus && student.academicStatus !== 'Active') continue;
      if (!student.currentSemester) continue;
      if (student.currentSemester.number !== currentSemesterNumber) continue;

      if (targetAction === 'graduate' && currentSemesterNumber === 8) {
        student.academicStatus = 'Graduated';
        await student.save({ session });
        processedCount++;
      } else if (targetAction === 'promote' && currentSemesterNumber < 8) {
        const currentBatch = student.currentSemester.batch;
        
        let nextSemester = await Semester.findOne({ number: currentSemesterNumber + 1, batch: currentBatch }).session(session);
        if (!nextSemester) {
          nextSemester = await Semester.create([{ number: currentSemesterNumber + 1, batch: currentBatch }], { session });
          nextSemester = nextSemester[0];
        }
        
        student.currentSemester = nextSemester._id;
        await student.save({ session });
        processedCount++;
      }
    }

    await session.commitTransaction();
    session.endSession();

    let actionText = targetAction === 'graduate' ? 'Graduated' : 'Promoted';
    if (processedCount > 0) {
      await require('../utils/auditLogger')(req, 'STUDENTS_PROMOTED_SELECTIVE', \`\${actionText} \${processedCount} students from semester \${currentSemesterNumber}\`);
    }

    res.status(200).json({
      success: true,
      message: \`Successfully \${actionText.toLowerCase()} \${processedCount} students.\`,
      processedCount
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during selective promotion' });
  }
};
`;

fs.appendFileSync(adminControllerPath, newMethods);
console.log('Appended methods to adminController.js');
