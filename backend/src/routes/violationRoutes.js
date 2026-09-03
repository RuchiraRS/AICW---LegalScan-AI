const express = require('express');
const router = express.Router();
const { getViolations, reviewViolation } = require('../controllers/violationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getViolations);
router.put('/:id/review', protect, reviewViolation);

module.exports = router;
