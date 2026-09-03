const Violation = require('../models/Violation');

// @desc    Get all violations
// @route   GET /api/violations
// @access  Private
exports.getViolations = async (req, res) => {
  try {
    const violations = await Violation.find().populate('inspectionId').populate('evidenceId').sort({ createdAt: -1 });
    res.json({ success: true, data: violations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Review/update a violation
// @route   PUT /api/violations/:id/review
// @access  Private
exports.reviewViolation = async (req, res) => {
  try {
    const { status, officerRemark } = req.body;
    
    const violation = await Violation.findById(req.params.id);
    if (!violation) {
      return res.status(404).json({ success: false, message: 'Violation not found' });
    }

    violation.status = status || violation.status;
    violation.officerRemark = officerRemark || violation.officerRemark;
    await violation.save();

    res.json({ success: true, data: violation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
