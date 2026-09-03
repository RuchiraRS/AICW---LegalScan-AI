const express = require('express');
const router = express.Router();
const { createInspection, uploadImages, getInspection, getInspections, analyzeInspection } = require('../controllers/inspectionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.post('/', protect, createInspection);
router.get('/', protect, getInspections);
router.get('/:id', protect, getInspection);
router.post('/:id/images', protect, upload.single('image'), uploadImages);
router.post('/:id/analyze', protect, analyzeInspection);

module.exports = router;
