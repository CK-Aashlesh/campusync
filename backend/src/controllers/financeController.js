const Fee = require('../models/Fee');
const Fine = require('../models/Fine');
const Student = require('../models/Student');

// @desc    Create a new fee
// @route   POST /api/finance/fees
// @access  Private/Admin
exports.createFee = async (req, res) => {
  try {
    const { studentId, feeType, amount, dueDate } = req.body;
    
    const fee = await Fee.create({
      student: studentId,
      feeType,
      amount,
      dueDate
    });

    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a fee status
// @route   PUT /api/finance/fees/:id
// @access  Private/Admin
exports.updateFeeStatus = async (req, res) => {
  try {
    const { status, paymentDate } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });

    fee.status = status;
    if (status === 'Paid' || status === 'Partial') {
      fee.paymentDate = paymentDate || Date.now();
    }
    
    await fee.save();
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all fees
// @route   GET /api/finance/fees
// @access  Private/Admin
exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' }
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// @desc    Create a new fine
// @route   POST /api/finance/fines
// @access  Private/Admin
exports.createFine = async (req, res) => {
  try {
    const { studentId, reason, amount } = req.body;
    
    const fine = await Fine.create({
      student: studentId,
      reason,
      amount
    });

    res.status(201).json({ success: true, data: fine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a fine status
// @route   PUT /api/finance/fines/:id
// @access  Private/Admin
exports.updateFineStatus = async (req, res) => {
  try {
    const { status, paymentDate } = req.body;
    const fine = await Fine.findById(req.params.id);

    if (!fine) return res.status(404).json({ success: false, message: 'Fine not found' });

    fine.status = status;
    if (status === 'Paid') {
      fine.paymentDate = paymentDate || Date.now();
    }
    
    await fine.save();
    res.status(200).json({ success: true, data: fine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all fines
// @route   GET /api/finance/fines
// @access  Private/Admin
exports.getFines = async (req, res) => {
  try {
    const fines = await Fine.find().populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' }
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: fines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
