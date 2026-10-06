const express = require('express');
const {
  createStaff,
  getStaffs,
  getStaffById,
  updateStaff,
  deleteStaff,
  assignSubject,
  getMeStaff,
  resetPassword,
  updateStaffProfile
} = require('../controllers/staffController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

// Apply auth middleware to all routes
router.use(protect);

router.get('/me', authorize('Staff', 'Admin', 'Finance', 'Admission'), getMeStaff);
router.put('/profile', authorize('Staff', 'Admin', 'Finance', 'Admission'), upload.single('profilePhoto'), updateStaffProfile);

router
  .route('/')
  .post(authorize('Admin'), createStaff)
  .get(authorize('Admin'), getStaffs);

router
  .route('/:id')
  .get(authorize('Admin', 'Staff'), getStaffById)
  .put(authorize('Admin'), updateStaff)
  .delete(authorize('Admin'), deleteStaff);

router
  .route('/:id/subjects')
  .put(authorize('Admin'), assignSubject);

router
  .route('/:id/reset-password')
  .put(authorize('Admin'), resetPassword);

module.exports = router;

