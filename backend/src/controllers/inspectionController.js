const Inspection = require('../models/Inspection');
const Image = require('../models/Image');
const Declaration = require('../models/Declaration');
const Violation = require('../models/Violation');
const aiService = require('../services/aiService');

// @desc    Create new inspection
// @route   POST /api/inspections
// @access  Private
exports.createInspection = async (req, res, next) => {
  try {
    const { location, productId, officerRemarks } = req.body;

    const inspection = await Inspection.create({
      inspectionId: `INS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      officerId: req.user._id,
      location,
      productId: productId || null,
      officerRemarks
    });

    res.status(201).json({
      success: true,
      message: 'Inspection created',
      data: inspection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inspections
// @route   GET /api/inspections
// @access  Private
exports.getInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.find()
      .populate('officerId', 'name')
      .populate('productId', 'productName manufacturer')
      .sort('-createdAt');

    res.json({
      success: true,
      data: inspections
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inspection by ID
// @route   GET /api/inspections/:id
// @access  Private
exports.getInspectionById = async (req, res, next) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('officerId', 'name')
      .populate('productId')
      .populate('images')
      .populate('declarations')
      .populate('violations');

    if (!inspection) {
      res.status(404);
      throw new Error('Inspection not found');
    }

    res.json({
      success: true,
      data: inspection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image for inspection
// @route   POST /api/inspections/:id/images
// @access  Private
exports.uploadImage = async (req, res, next) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      res.status(404);
      throw new Error('Inspection not found');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }

    const { angle } = req.body;

    const image = await Image.create({
      inspectionId: inspection._id,
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      angle: angle || 'UNKNOWN'
    });

    inspection.images.push(image._id);
    await inspection.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger AI analysis
// @route   POST /api/inspections/:id/analyze
// @access  Private
exports.analyzeInspection = async (req, res, next) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      res.status(404);
      throw new Error('Inspection not found');
    }

    inspection.status = 'PROCESSING';
    await inspection.save();

    // Call Python AI Service
    const aiResult = await aiService.analyzeImages(inspection);

    // Save declarations
    if (aiResult.declarations && aiResult.declarations.length > 0) {
      for (let dec of aiResult.declarations) {
        const newDec = await Declaration.create({
          inspectionId: inspection._id,
          field: dec.field,
          value: dec.value,
          confidence: dec.confidence,
          verificationStatus: 'AI_DETECTED'
        });
        inspection.declarations.push(newDec._id);
      }
    }

    // Save violations
    if (aiResult.violations && aiResult.violations.length > 0) {
      for (let viol of aiResult.violations) {
        const newViol = await Violation.create({
          ruleId: viol.rule_id || 'UNKNOWN',
          inspectionId: inspection._id,
          field: viol.field || 'General',
          requirement: viol.requirement || 'Must comply with rules',
          detectedValue: viol.detected_value,
          expectedValue: viol.expected_value,
          severity: viol.severity || 'MEDIUM',
          confidence: viol.confidence,
          status: 'AI_DETECTED'
        });
        inspection.violations.push(newViol._id);
      }
      inspection.complianceStatus = aiResult.violations.some(v => v.severity === 'HIGH') 
        ? 'REQUIRES_REVIEW' 
        : 'POTENTIAL_VIOLATION';
    } else {
      inspection.complianceStatus = 'COMPLIANT';
    }

    inspection.status = 'UNDER_REVIEW';
    await inspection.save();

    res.json({
      success: true,
      message: 'Analysis completed successfully',
      data: inspection
    });

  } catch (error) {
    // Revert status on failure
    const inspection = await Inspection.findById(req.params.id);
    if (inspection) {
      inspection.status = 'DRAFT';
      await inspection.save();
    }
    next(error);
  }
};
