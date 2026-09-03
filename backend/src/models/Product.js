const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String },
  brand: { type: String },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer' },
  batchNumber: { type: String },
  mrp: { type: String },
  netQuantity: { type: String },
  manufacturer: { type: String },
  packer: { type: String },
  importer: { type: String },
  address: { type: String },
  countryOfOrigin: { type: String },
  consumerCare: { type: String },
  dateInformation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
