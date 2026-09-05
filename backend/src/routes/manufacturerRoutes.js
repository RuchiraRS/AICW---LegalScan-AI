const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Mock manufacturer endpoints using distinct from Products
router.get('/', protect, async (req, res, next) => {
  try {
    const manufacturers = await Product.distinct('manufacturer');
    res.json({ success: true, data: manufacturers });
  } catch (error) {
    next(error);
  }
});

router.get('/:name', protect, async (req, res, next) => {
  try {
    const products = await Product.find({ manufacturer: req.params.name });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
