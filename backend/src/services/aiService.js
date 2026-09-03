const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const Declaration = require('../models/Declaration');
const Violation = require('../models/Violation');
const Evidence = require('../models/Evidence');

exports.analyzeImages = async (inspection) => {
  const AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';
  
  const form = new FormData();
  form.append('inspection_id', inspection._id.toString());
  
  // Attach images
  for (let i = 0; i < inspection.images.length; i++) {
    const img = inspection.images[i];
    const filePath = path.join(__dirname, '../../../uploads', img.filename);
    if (fs.existsSync(filePath)) {
      form.append('images', fs.createReadStream(filePath), img.filename);
    }
  }

  try {
    const response = await axios.post(`${AI_URL}/api/analyze/full-pipeline`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error('AI analysis failed: ' + (error.response?.data?.detail || error.message));
  }
};

exports.saveResults = async (inspection, aiData) => {
  // 1. Save declarations
  for (let dec of aiData.declarations) {
    const declaration = await Declaration.create({
      field: dec.field,
      value: dec.value,
      confidence: dec.confidence,
      ocrConfidence: dec.ocr_confidence,
      nlpConfidence: dec.nlp_confidence,
      boundingBox: dec.bounding_box,
      verificationStatus: 'AI_EXTRACTED'
    });
    inspection.declarations.push(declaration._id);
  }

  // 2. Save violations and evidence
  for (let viol of aiData.violations) {
    const violation = await Violation.create({
      ruleId: viol.rule_id,
      inspectionId: inspection._id,
      field: viol.field,
      requirement: viol.requirement,
      detectedValue: viol.detected_value,
      expectedValue: viol.expected_value,
      severity: viol.severity,
      confidence: viol.confidence,
      status: 'AI_DETECTED',
      explanation: viol.explanation
    });

    if (viol.evidence) {
      const evidence = await Evidence.create({
        inspectionId: inspection._id,
        violationId: violation._id,
        bbox: viol.evidence.bbox,
        detectedText: viol.evidence.detected_text,
        confidence: viol.evidence.confidence,
        cropUrl: viol.evidence.crop_url
      });
      violation.evidenceId = evidence._id;
      await violation.save();
    }

    inspection.violations.push(violation._id);
  }

  inspection.overallConfidence = aiData.overall_confidence;
  await inspection.save();
};
