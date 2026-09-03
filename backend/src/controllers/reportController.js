const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Inspection = require('../models/Inspection');

exports.generateReport = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId)
      .populate('productId')
      .populate('violations');

    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }

    const reportsDir = path.join(__dirname, '../../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportName = `Report-${inspection.inspectionId}.pdf`;
    const reportPath = path.join(reportsDir, reportName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(reportPath));

    doc.fontSize(20).text('LEGALSCAN AI', { align: 'center' });
    doc.fontSize(16).text('LEGAL METROLOGY INSPECTION REPORT', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Inspection ID: ${inspection.inspectionId}`);
    doc.text(`Date: ${inspection.inspectionDate}`);
    doc.text(`Location: ${inspection.location}`);
    doc.moveDown();

    doc.fontSize(14).text('PRODUCT INFORMATION');
    if (inspection.productId) {
      doc.fontSize(12).text(`Name: ${inspection.productId.productName}`);
      doc.text(`Brand: ${inspection.productId.brand}`);
    }
    doc.moveDown();

    doc.fontSize(14).text('POTENTIAL VIOLATIONS');
    inspection.violations.forEach((v, index) => {
      doc.fontSize(12).text(`${index + 1}. [${v.severity}] ${v.ruleId} - ${v.requirement}`);
      doc.text(`Detected: ${v.detectedValue}, Status: ${v.status}`);
      doc.moveDown();
    });

    doc.end();

    res.json({ success: true, data: { pdfUrl: `/reports/${reportName}` } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
