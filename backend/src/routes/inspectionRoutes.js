const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  createInspection,
  getInspections,
  getInspectionById,
  uploadImage,
  analyzeInspection
} = require('../controllers/inspectionController');

router.route('/')
  .post(protect, createInspection)
  .get(protect, getInspections);

router.route('/:id')
  .get(protect, getInspectionById);

router.post('/:id/images', protect, upload.single('image'), uploadImage);
router.post('/:id/analyze', protect, analyzeInspection);

module.exports = router;
