const express = require('express');
const { admitStudent, getAdmittedStudents, toggleStudentStatus, resetStudentPassword, updateStudentByAdmin } = require('../controllers/admissionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Roles will be checked per route
router.use(protect);

router.route('/')
  .post(authorize('Admission'), admitStudent);

router.route('/students')
  .get(authorize('Admission', 'Staff', 'Admin', 'Finance'), getAdmittedStudents);

router.route('/students/:id')
  .put(authorize('Admission'), updateStudentByAdmin)
  .delete(authorize('Admission'), toggleStudentStatus);

router.route('/students/:id/reset-password')
  .put(authorize('Admission'), resetStudentPassword);

module.exports = router;


