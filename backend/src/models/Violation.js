const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  ruleId: { type: String, required: true },
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  field: { type: String },
  requirement: { type: String },
  detectedValue: { type: String },
  expectedValue: { type: String },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  confidence: { type: Number },
  evidenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' },
  status: { type: String, enum: ['AI_DETECTED', 'UNDER_REVIEW', 'CONFIRMED', 'REJECTED', 'REQUIRES_ADDITIONAL_EVIDENCE'], default: 'AI_DETECTED' },
  explanation: { type: String },
  officerRemark: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Violation', violationSchema);
