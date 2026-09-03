const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' },
  violationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Violation' },
  bbox: { type: [Number] },
  cropUrl: { type: String },
  detectedText: { type: String },
  confidence: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
