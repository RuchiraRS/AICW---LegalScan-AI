const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, getViolationAnalytics } = require('../controllers/analyticsController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/violations', protect, getViolationAnalytics);

module.exports = router;
