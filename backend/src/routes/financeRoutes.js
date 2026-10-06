const express = require('express');
const {
  createFee,
  updateFeeStatus,
  getFees,
  createFine,
  updateFineStatus,
  getFines
} = require('../controllers/financeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

// Fees
router.post('/fees', authorize('Finance'), createFee);
router.get('/fees', authorize('Finance'), getFees);
router.put('/fees/:id', authorize('Finance'), updateFeeStatus);

// Fines
router.post('/fines', authorize('Finance'), createFine);
router.get('/fines', authorize('Finance'), getFines);
router.put('/fines/:id', authorize('Finance'), updateFineStatus);

module.exports = router;

