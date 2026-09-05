const mongoose = require('mongoose');

const declarationSchema = new mongoose.Schema({
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  field: { type: String, required: true },
  value: { type: String, required: true },
  confidence: { type: Number, required: true },
  sourceImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  boundingBox: { type: Array },
  ocrConfidence: { type: Number },
  nlpConfidence: { type: Number },
  verificationStatus: { 
    type: String, 
    enum: ['AI_DETECTED', 'CONFIRMED', 'EDITED', 'REJECTED'],
    default: 'AI_DETECTED'
  }
}, { timestamps: true });

module.exports = mongoose.model('Declaration', declarationSchema);
