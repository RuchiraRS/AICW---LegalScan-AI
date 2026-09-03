const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  inspectionId: { type: String, required: true, unique: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  inspectionDate: { type: Date, default: Date.now },
  location: { type: String },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'REQUIRES_REVIEW', 'COMPLETED'], default: 'PENDING' },
  complianceStatus: { type: String, enum: ['COMPLIANT', 'POTENTIAL_VIOLATIONS', 'NON_COMPLIANT', 'UNKNOWN'], default: 'UNKNOWN' },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' }],
  declarations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Declaration' }],
  violations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Violation' }],
  officerRemarks: { type: String },
  overallConfidence: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Inspection', inspectionSchema);
