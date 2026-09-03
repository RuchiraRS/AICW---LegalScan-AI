import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { violationsAPI } from '../services/api';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const res = await violationsAPI.getAll();
        setViolations(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch violations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchViolations();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await violationsAPI.review(id, { status, officerRemark: 'Reviewed by officer' });
      // Update UI locally
      setViolations(prev => prev.map(v => v._id === id ? { ...v, status } : v));
    } catch (err) {
      console.error('Failed to update violation', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading violations...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Violations Management</h1>
        <p className="text-gray-500 mt-1">Review and manage AI-detected potential violations.</p>
      </div>

      <div className="space-y-4">
        {violations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No active violations found.</div>
        ) : (
          violations.map(v => (
            <Card key={v._id} className="border-error/30">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="mt-1"><ShieldAlert className="text-error" size={24} /></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold px-2 py-0.5 bg-gray-200 rounded text-gray-700">{v.ruleId}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {v.severity}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        v.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                        v.status === 'REJECTED' ? 'bg-gray-200 text-gray-600' : 
                        'bg-blue-100 text-blue-700'
                      }`}>{v.status}</span>
                    </div>
                    <p className="text-primary font-medium text-lg">{v.requirement}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Detected:</strong> <span className="text-red-500">{v.detectedValue}</span> | <strong>Expected:</strong> <span className="text-green-600">{v.expectedValue}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{v.explanation}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      Inspection ID: {v.inspectionId?.inspectionId} • Confidence: {v.confidence || 0}%
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="text-xs" onClick={() => navigate(`/results/${v.inspectionId?._id}`)}>View Inspection</Button>
                  {v.status === 'AI_DETECTED' && (
                    <>
                      <Button className="text-xs bg-green-600 hover:bg-green-700 border-none" onClick={() => handleReview(v._id, 'CONFIRMED')}>Confirm</Button>
                      <Button variant="outline" className="text-xs text-red-600 hover:bg-red-50" onClick={() => handleReview(v._id, 'REJECTED')}>Reject</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Violations;
