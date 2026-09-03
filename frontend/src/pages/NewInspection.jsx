import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { inspectionsAPI } from '../services/api';
import { UploadCloud, Camera, FileText } from 'lucide-react';

const NewInspection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: '',
    productName: '',
    productCategory: 'Industrial Equipment',
    notes: ''
  });
  const [files, setFiles] = useState([]);

  const handleProcess = async () => {
    try {
      setLoading(true);
      // 1. Create inspection
      const createRes = await inspectionsAPI.create({
        productData: {
          manufacturer: formData.manufacturer,
          category: formData.productCategory,
          productName: formData.productName || 'Unknown Product'
        },
        location: 'Field Office',
        officerRemarks: formData.notes
      });
      const inspectionId = createRes.data.data._id;

      // 2. Upload images if any
      if (files.length > 0) {
        for (const file of files) {
          const uploadData = new FormData();
          uploadData.append('image', file);
          uploadData.append('angle', 'FRONT'); // Defaulting to FRONT for now
          await inspectionsAPI.uploadImages(inspectionId, uploadData);
        }
      }

      // 3. Analyze
      await inspectionsAPI.analyze(inspectionId);

      // 4. Redirect to result
      navigate(`/results/${inspectionId}`);
    } catch (error) {
      console.error('Error during inspection process:', error);
      alert('An error occurred while processing the inspection.');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">New Inspection</h1>
        <p className="text-gray-500 mt-1">Upload product images and documentation for AI analysis.</p>
      </div>

      <Card title="Data Ingestion" className="border-dashed border-2 border-border bg-gray-50/50">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-accent">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">Select files here</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Supported formats: JPG, PNG, PDF. Max file size: 50MB.
          </p>
          <div className="flex gap-4 items-center justify-center">
            <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
            <Button 
              type="button"
              variant="outline" 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => document.getElementById('file-upload').click()}
            >
              <Camera size={18} /> Choose Images/Docs
            </Button>
          </div>
          {files.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              {files.length} file(s) selected
            </div>
          )}
        </div>
      </Card>

      <Card title="Inspection Context">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input 
                type="text" 
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none" 
                placeholder="e.g. Titan Build Co." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
              <select 
                value={formData.productCategory}
                onChange={(e) => setFormData({...formData, productCategory: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none bg-white">
                <option>Industrial Equipment</option>
                <option>Consumer Electronics</option>
                <option>Construction Materials</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none" 
              rows="3" 
              placeholder="Any specific areas of concern..."></textarea>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} disabled={loading}>Cancel</Button>
        <Button onClick={handleProcess} disabled={loading}>
          {loading ? 'Processing...' : 'Initiate Analysis'}
        </Button>
      </div>
    </div>
  );
};

export default NewInspection;
