const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  ruleId: { type: String, required: true },
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  field: { type: String, required: true },
  requirement: { type: String, required: true },
  detectedValue: { type: String },
  expectedValue: { type: String },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  confidence: { type: Number },
  evidenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }, // Or a separate Evidence model, using Image for simplicity as they upload images
  status: { type: String, enum: ['AI_DETECTED', 'CONFIRMED', 'REJECTED'], default: 'AI_DETECTED' },
  officerRemark: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Violation', violationSchema);
