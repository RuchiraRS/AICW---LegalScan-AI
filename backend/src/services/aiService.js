const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const Image = require('../models/Image');

/**
 * AI Service Integration
 * Communicates with the Python FastAPI ML microservice.
 */
exports.analyzeImages = async (inspection) => {
  const AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';
  const form = new FormData();
  
  form.append('inspection_id', inspection.inspectionId);

  // Retrieve actual image documents mapped to the inspection
  const images = await Image.find({ inspectionId: inspection._id });
  
  for (let img of images) {
    const filePath = path.join(__dirname, '../../../uploads/', img.filename);
    if (fs.existsSync(filePath)) {
      form.append('images', fs.createReadStream(filePath), img.filename);
    } else {
      console.warn(`File not found for AI analysis: ${filePath}`);
    }
  }

  try {
    const response = await axios.post(`${AI_URL}/api/analyze/full-pipeline`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    if (error.response) {
      console.error("AI Response Data:", error.response.data);
    }
    throw new Error('AI analysis failed to complete successfully.');
  }
};
