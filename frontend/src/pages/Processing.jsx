import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Image, BrainCircuit, FileText, Scale, Database, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 1, name: 'Image Preprocessing & Quality Check', icon: Image },
  { id: 2, name: 'CNN Visual Classification', icon: BrainCircuit },
  { id: 3, name: 'OCR Text Extraction', icon: Search },
  { id: 4, name: 'NLP Field Extraction', icon: FileText },
  { id: 5, name: 'Rule Engine Validation', icon: Scale },
  { id: 6, name: 'Evidence Generation', icon: Database },
];

const Processing = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    // Simulate AI pipeline progressing
    const intervals = [];
    
    let current = 1;
    const timer = setInterval(() => {
      current++;
      if (current > 6) {
        clearInterval(timer);
        // Add slight delay before redirecting to results
        setTimeout(() => navigate('/results/INS-2026-8902'), 1000); 
      } else {
        setActiveStage(current);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-accent/30"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-2 rounded-full border-4 border-dotted border-primary/20"
          />
          <div className="absolute inset-0 flex items-center justify-center text-primary">
            <BrainCircuit size={40} />
          </div>
        </div>
        <h2 className="text-3xl font-editorial font-bold text-primary mb-2">Analyzing Packaging...</h2>
        <p className="text-gray-500">LegalScan AI is inspecting the uploaded multi-angle images.</p>
      </div>

      <div className="w-full bg-bg-card border border-border rounded-2xl p-6 shadow-soft">
        <div className="space-y-4">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = activeStage > stage.id;
            const isProcessing = activeStage === stage.id;
            const isPending = activeStage < stage.id;
            
            return (
              <div key={stage.id} className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                isProcessing ? 'bg-bg-soft ring-1 ring-border shadow-inner scale-[1.02]' : 
                isCompleted ? 'opacity-70' : 'opacity-40'
              }`}>
                <div className={`p-2 rounded-lg mr-4 ${
                  isCompleted ? 'bg-green-100 text-green-600' :
                  isProcessing ? 'bg-accent/10 text-accent' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${isProcessing ? 'text-primary' : 'text-gray-700'}`}>{stage.name}</p>
                </div>

                <div className="text-sm font-medium">
                  {isCompleted && <span className="text-green-600">Completed</span>}
                  {isProcessing && (
                    <span className="text-accent flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Processing
                    </span>
                  )}
                  {isPending && <span className="text-gray-400">Pending</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Processing;
