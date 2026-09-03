const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const inspectionRoutes = require('./inspectionRoutes');
const violationRoutes = require('./violationRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const reportRoutes = require('./reportRoutes');

router.use('/auth', authRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/violations', violationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
