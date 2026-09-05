const Rule = require('../models/Rule');

// @desc    Get all active rules
// @route   GET /api/rules
// @access  Private
exports.getRules = async (req, res, next) => {
  try {
    const rules = await Rule.find({ enabled: true });
    res.json({ success: true, data: rules });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new rule
// @route   POST /api/rules
// @access  Private (Admin/Supervisor)
exports.createRule = async (req, res, next) => {
  try {
    const rule = await Rule.create(req.body);
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Update rule
// @route   PUT /api/rules/:id
// @access  Private (Admin/Supervisor)
exports.updateRule = async (req, res, next) => {
  try {
    const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) {
      res.status(404);
      throw new Error('Rule not found');
    }
    res.json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};
