const express = require('express');
const { getMyProfile, getMyAttendanceSummary, updateMyProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes in this file require Student authorization
router.use(protect);
router.use(authorize('Student'));

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.get('/attendance', getMyAttendanceSummary);
router.get('/finance', require('../controllers/studentController').getMyFeesAndFines);

module.exports = router;
