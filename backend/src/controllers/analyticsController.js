const Inspection = require('../models/Inspection');
const Violation = require('../models/Violation');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalInspections = await Inspection.countDocuments();
    const compliantCount = await Inspection.countDocuments({ complianceStatus: 'COMPLIANT' });
    const potentialViolationsCount = await Inspection.countDocuments({ complianceStatus: 'POTENTIAL_VIOLATIONS' });
    const pendingReviewsCount = await Inspection.countDocuments({ status: 'REQUIRES_REVIEW' });

    res.json({
      success: true,
      data: {
        totalInspections,
        compliantCount,
        potentialViolationsCount,
        pendingReviewsCount,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
