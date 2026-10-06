const express = require('express');
const { getStats, getAuditLogs, promoteStudents, getPromotionStats, getPromotionStudents, promoteSelectiveStudents } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getStats);
router.get('/audit-logs', getAuditLogs);
router.post('/promote', promoteStudents);

router.get('/promotion-stats/:semesterNumber', getPromotionStats);
router.get('/promotion-students/:semesterNumber/:courseId', getPromotionStudents);
router.post('/promote-selective', promoteSelectiveStudents);

module.exports = router;


