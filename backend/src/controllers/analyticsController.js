const Inspection = require('../models/Inspection');
const Violation = require('../models/Violation');

// @desc    Get dashboard metrics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalInspections = await Inspection.countDocuments();
    const compliantCount = await Inspection.countDocuments({ complianceStatus: 'COMPLIANT' });
    const potentialViolationsCount = await Inspection.countDocuments({ complianceStatus: 'POTENTIAL_VIOLATION' });
    const pendingReviewsCount = await Inspection.countDocuments({ complianceStatus: 'REQUIRES_REVIEW' });

    res.json({
      success: true,
      data: {
        totalInspections,
        compliantCount,
        potentialViolationsCount,
        pendingReviewsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get violation analytics
// @route   GET /api/analytics/violations
// @access  Private
exports.getViolationAnalytics = async (req, res, next) => {
  try {
    const violationsBySeverity = await Violation.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    const topViolatedRules = await Violation.aggregate([
      { $group: { _id: '$ruleId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        violationsBySeverity,
        topViolatedRules
      }
    });
  } catch (error) {
    next(error);
  }
};
