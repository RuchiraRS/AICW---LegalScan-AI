const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  imageUrl: { type: String, required: true },
  angle: { type: String, enum: ['FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'UNCLEAR'], required: true },
  filename: { type: String },
  mimeType: { type: String },
  qualityScore: { type: Number },
  cnnResult: { type: mongoose.Schema.Types.Mixed },
  ocrResult: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('ProductImage', productImageSchema);
