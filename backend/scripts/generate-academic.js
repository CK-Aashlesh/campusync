const path = require('path');
const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../src/controllers');
const routesDir = path.join(__dirname, '../src/routes');

const controllerContent = `const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Semester = require('../models/Semester');
const Section = require('../models/Section');
const Subject = require('../models/Subject');

// --- Courses ---
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Batches ---
exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('course');
    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Semesters ---
exports.getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find().populate({
      path: 'batch',
      populate: { path: 'course' }
    });
    res.status(200).json({ success: true, data: semesters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createSemester = async (req, res) => {
  try {
    const semester = await Semester.create(req.body);
    res.status(201).json({ success: true, data: semester });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Sections ---
exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find().populate({
      path: 'semester',
      populate: { path: 'batch', populate: { path: 'course' } }
    });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Subjects ---
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate(['course', 'batch', 'semester', 'section', 'assignedFaculty']);
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`;

const routeContent = `const express = require('express');
const {
  getCourses, createCourse,
  getBatches, createBatch,
  getSemesters, createSemester,
  getSections, createSection,
  getSubjects, createSubject
} = require('../controllers/academicController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only Admin can manage academic structure
router.use(protect);
router.use(authorize('Admin'));

router.route('/courses').get(getCourses).post(createCourse);
router.route('/batches').get(getBatches).post(createBatch);
router.route('/semesters').get(getSemesters).post(createSemester);
router.route('/sections').get(getSections).post(createSection);
router.route('/subjects').get(getSubjects).post(createSubject);

module.exports = router;
`;

fs.writeFileSync(path.join(controllersDir, 'academicController.js'), controllerContent);
fs.writeFileSync(path.join(routesDir, 'academicRoutes.js'), routeContent);
console.log('Controllers and Routes created successfully.');
