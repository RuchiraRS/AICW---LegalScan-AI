import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Check, ChevronRight, Package, FileText, Image as ImageIcon } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Inspection Details', icon: FileText },
  { id: 2, name: 'Product Info', icon: Package },
  { id: 3, name: 'Capture Angles', icon: Camera },
];

const ANGLE_SLOTS = ['FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM'];

const ImageSlot = ({ angle, file, onUpload, onRemove }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(angle, e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative rounded-2xl border-2 border-dashed h-48 flex flex-col items-center justify-center overflow-hidden transition-all ${
        file ? 'border-border' : isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-gray-400 bg-bg-soft hover:bg-gray-100'
      }`}
      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
    >
      {file ? (
        <>
          <img src={URL.createObjectURL(file)} alt={angle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={() => fileInputRef.current.click()} className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium mb-2">Replace</button>
            <button onClick={() => onRemove(angle)} className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium">Remove</button>
          </div>
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase">
            {angle}
          </div>
        </>
      ) : (
        <div className="text-center p-4 cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft text-gray-400">
            <Upload size={20} />
          </div>
          <p className="font-bold tracking-widest text-[11px] text-gray-500 uppercase">{angle}</p>
          <p className="text-xs text-gray-400 mt-1">Drag or click</p>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        if (e.target.files[0]) onUpload(angle, e.target.files[0]);
      }} />
    </div>
  );
};

const NewInspection = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState({});

  const handleNext = () => {
    if (currentStep === 3) {
      // Simulate submission and go to processing
      navigate('/processing');
    } else {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handleUpload = (angle, file) => {
    setImages(prev => ({ ...prev, [angle]: file }));
  };

  const handleRemove = (angle) => {
    setImages(prev => {
      const copy = { ...prev };
      delete copy[angle];
      return copy;
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Wizard Header */}
      <div className="mb-10 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border -z-10"></div>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div key={step.id} className="flex flex-col items-center bg-bg-base px-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                isActive ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20' :
                isCompleted ? 'bg-success text-white' :
                'bg-bg-soft text-gray-400 border border-border'
              }`}>
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span className={`mt-3 text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>{step.name}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-bg-card border border-border shadow-soft rounded-2xl p-8">
        
        {currentStep === 1 && (
          <div className="space-y-6 animation-fade-in">
            <h2 className="text-2xl font-editorial font-bold mb-6">Inspection Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location / Store Name</label>
                <input type="text" className="w-full bg-bg-soft border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent" placeholder="e.g. SuperMart Downtown" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Type</label>
                <select className="w-full bg-bg-soft border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent">
                  <option>Routine Check</option>
                  <option>Consumer Complaint</option>
                  <option>Surprise Raid</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                <textarea className="w-full bg-bg-soft border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent h-24" placeholder="Any initial observations..."></textarea>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animation-fade-in">
            <h2 className="text-2xl font-editorial font-bold mb-6">Product Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
                <select className="w-full bg-bg-soft border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent">
                  <option>Food & Beverages</option>
                  <option>Electronics</option>
                  <option>Cosmetics</option>
                  <option>FMCG / Household</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commodity Name (If known)</label>
                <input type="text" className="w-full bg-bg-soft border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent" placeholder="Leave blank if unknown" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 text-blue-800 rounded-xl flex gap-3 text-sm">
              <ImageIcon className="shrink-0" />
              <p>The AI will automatically extract the exact brand, manufacturer, and declarations from the images in the next step.</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animation-fade-in">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-editorial font-bold">Capture Package Angles</h2>
                <p className="text-gray-500 mt-1">Upload clear images of the product packaging to ensure accurate OCR extraction.</p>
              </div>
              <div className="text-sm font-medium px-3 py-1.5 bg-bg-soft rounded-lg text-primary">
                {Object.keys(images).length} / 6 Captured
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {ANGLE_SLOTS.map(angle => (
                <ImageSlot key={angle} angle={angle} file={images[angle]} onUpload={handleUpload} onRemove={handleRemove} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border flex justify-between">
          <button 
            onClick={() => setCurrentStep(curr => curr - 1)} 
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${currentStep === 1 ? 'opacity-0 cursor-default' : 'bg-bg-soft text-gray-600 hover:bg-gray-200'}`}
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary hover:bg-gray-800 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-md"
          >
            {currentStep === 3 ? 'Analyze with AI' : 'Continue'} 
            {currentStep !== 3 && <ChevronRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewInspection;
