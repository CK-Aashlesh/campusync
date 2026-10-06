const express = require('express');
const { 
  getFacultySubjects, 
  getStudentsForSubject, 
  markAttendance, 
  getAttendanceHistory 
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/subjects')
  .get(authorize('Staff', 'Admin'), getFacultySubjects);

router.route('/students/:subjectId')
  .get(authorize('Staff', 'Admin'), getStudentsForSubject);

router.route('/')
  .post(authorize('Staff'), markAttendance);

router.route('/history/:subjectId')
  .get(authorize('Staff', 'Admin'), getAttendanceHistory);

module.exports = router;

