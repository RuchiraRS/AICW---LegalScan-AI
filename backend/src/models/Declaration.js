const mongoose = require('mongoose');

const declarationSchema = new mongoose.Schema({
  field: { type: String, required: true },
  value: { type: String },
  confidence: { type: Number },
  sourceImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' },
  boundingBox: { type: [Number] },
  ocrConfidence: { type: Number },
  nlpConfidence: { type: Number },
  verificationStatus: { type: String, enum: ['AI_EXTRACTED', 'OFFICER_CONFIRMED', 'OFFICER_EDITED', 'REJECTED'], default: 'AI_EXTRACTED' },
  officerCorrectedValue: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Declaration', declarationSchema);
