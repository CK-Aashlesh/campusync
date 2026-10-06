const express = require('express');
const {
  getCourses, createCourse,
  getBatches, createBatch,
  getSemesters, createSemester,
  getSections, createSection,
  getSubjects, createSubject
} = require('../controllers/academicController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/courses')
  .get(authorize('Admin', 'Staff', 'Student'), getCourses)
  ;

router.route('/batches')
  .get(authorize('Admin', 'Staff', 'Student'), getBatches)
  ;

router.route('/semesters')
  .get(authorize('Admin', 'Staff', 'Student'), getSemesters)
  ;

router.route('/sections')
  .get(authorize('Admin', 'Staff', 'Student'), getSections)
  ;

router.route('/subjects')
  .get(authorize('Admin', 'Staff', 'Student'), getSubjects)
  ;

module.exports = router;

