const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  ruleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  field: { type: String, required: true },
  requirement: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  condition: { type: String },
  category: { type: String },
  enabled: { type: Boolean, default: true },
  version: { type: String, default: '1.0' },
  effectiveFrom: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema);
