const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Violation = require('../models/Violation');

// GET /api/violations
router.get('/', protect, async (req, res, next) => {
  try {
    const violations = await Violation.find().populate('inspectionId');
    res.json({ success: true, data: violations });
  } catch (error) {
    next(error);
  }
});

// GET /api/violations/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const violation = await Violation.findById(req.params.id).populate('inspectionId');
    if (!violation) return res.status(404).json({ success: false, message: 'Violation not found' });
    res.json({ success: true, data: violation });
  } catch (error) {
    next(error);
  }
});

// PUT /api/violations/:id/review
router.put('/:id/review', protect, authorize('SUPERVISOR', 'ADMIN', 'OFFICER'), async (req, res, next) => {
  try {
    const { status, officerRemark } = req.body;
    const violation = await Violation.findByIdAndUpdate(
      req.params.id, 
      { status, officerRemark }, 
      { new: true }
    );
    if (!violation) return res.status(404).json({ success: false, message: 'Violation not found' });
    res.json({ success: true, data: violation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
