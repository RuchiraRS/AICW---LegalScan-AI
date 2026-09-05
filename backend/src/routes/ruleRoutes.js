const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getRules, createRule, updateRule } = require('../controllers/ruleController');

router.route('/')
  .get(protect, getRules)
  .post(protect, authorize('ADMIN', 'SUPERVISOR'), createRule);

router.route('/:id')
  .put(protect, authorize('ADMIN', 'SUPERVISOR'), updateRule);

module.exports = router;
