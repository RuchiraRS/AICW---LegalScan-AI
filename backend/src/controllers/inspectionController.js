const Inspection = require('../models/Inspection');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const aiService = require('../services/aiService');
const crypto = require('crypto');

// @desc    Create new inspection
// @route   POST /api/inspections
// @access  Private
exports.createInspection = async (req, res) => {
  try {
    const { productData, location, officerRemarks } = req.body;

    const product = await Product.create(productData);

    const inspection = await Inspection.create({
      inspectionId: `INS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      officerId: req.user._id,
      productId: product._id,
      location,
      officerRemarks
    });

    res.status(201).json({ success: true, data: inspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload images for an inspection
// @route   POST /api/inspections/:id/images
// @access  Private
exports.uploadImages = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }

    const { angle } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const image = await ProductImage.create({
      inspectionId: inspection._id,
      imageUrl: `/uploads/${req.file.filename}`,
      angle: angle || 'UNCLEAR',
      filename: req.file.filename,
      mimeType: req.file.mimetype
    });

    inspection.images.push(image._id);
    await inspection.save();

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inspection by ID
// @route   GET /api/inspections/:id
// @access  Private
exports.getInspection = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const query = mongoose.Types.ObjectId.isValid(req.params.id) 
      ? { _id: req.params.id } 
      : { inspectionId: req.params.id };

    const inspection = await Inspection.findOne(query)
      .populate('productId')
      .populate('images')
      .populate('declarations')
      .populate({
        path: 'violations',
        populate: { path: 'evidenceId' }
      });
      
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }
    res.json({ success: true, data: inspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inspections
// @route   GET /api/inspections
// @access  Private
exports.getInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 })
      .populate('productId')
      .populate('officerId', 'name employeeId');
    res.json({ success: true, data: inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger AI analysis
// @route   POST /api/inspections/:id/analyze
// @access  Private
exports.analyzeInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id).populate('images');
    if (!inspection) return res.status(404).json({ success: false, message: 'Inspection not found' });

    inspection.status = 'PROCESSING';
    await inspection.save();

    // Call python AI service
    const aiResponse = await aiService.analyzeImages(inspection);

    // Save AI results to Mongo
    await aiService.saveResults(inspection, aiResponse);

    inspection.status = 'REQUIRES_REVIEW';
    await inspection.save();

    res.json({ success: true, data: inspection });
  } catch (error) {
    console.error(error);
    const ins = await Inspection.findById(req.params.id);
    if(ins) {
      ins.status = 'PENDING';
      await ins.save();
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
