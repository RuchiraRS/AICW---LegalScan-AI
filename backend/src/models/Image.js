const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  imageUrl: { type: String, required: true },
  angle: { 
    type: String, 
    enum: ['FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'UNKNOWN'],
    required: true 
  },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  qualityScore: { type: Number },
  cnnResult: { type: Object },
  ocrResult: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
