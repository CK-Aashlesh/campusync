const express = require('express');
const {
  assignMentor,
  getMyAssignedStudents,
  getAssignedStudentAttendance,
  addAttendanceReason,
  getAttendanceReasons
} = require('../controllers/mentorController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect);

// Admin route


// Staff (Mentor), Admin routes
router.get('/students', authorize('Staff', 'Admin'), getMyAssignedStudents);
router.get('/students/:studentId/attendance', authorize('Staff', 'Admin'), getAssignedStudentAttendance);
router.post('/students/:studentId/reason', authorize('Staff', 'Admin'), upload.single('certificate'), addAttendanceReason);
router.get('/students/:studentId/reasons', authorize('Staff', 'Admin'), getAttendanceReasons);

module.exports = router;


