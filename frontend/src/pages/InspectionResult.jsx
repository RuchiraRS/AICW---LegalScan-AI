import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { inspectionsAPI, reportsAPI } from '../services/api';
import { ShieldAlert, FileText, Download } from 'lucide-react';

const InspectionResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        setLoading(true);
        const res = await inspectionsAPI.getById(id);
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching inspection:', err);
        setError('Failed to load inspection data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInspection();
  }, [id]);

  const handleExportPDF = async () => {
    try {
      await reportsAPI.generate(id);
      alert('Report generation triggered. You will receive it shortly.');
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading inspection...</div>;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;
  if (!data) return <div className="p-8 text-center">No inspection found.</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Inspection {data.inspectionId}</h1>
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
              data.complianceStatus === 'NON_COMPLIANT' || data.complianceStatus === 'POTENTIAL_VIOLATIONS' ? 'bg-red-100 text-red-800' :
              data.complianceStatus === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {data.complianceStatus}
            </span>
          </div>
          <p className="text-gray-500">{data.productId?.productName || 'Unknown Product'} • {data.productId?.manufacturer || 'Unknown Mfr'} • {new Date(data.inspectionDate || Date.now()).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportPDF}><Download size={16}/> Export PDF</Button>
          {(data.complianceStatus === 'NON_COMPLIANT' || data.complianceStatus === 'POTENTIAL_VIOLATIONS') && <Button variant="danger">Issue Notice</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Executive Summary">
            <p className="text-gray-700 leading-relaxed mb-6">
              {data.officerRemarks || 'No summary available.'}
            </p>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-border">
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-1">AI Confidence Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${data.overallConfidence || 0}%` }}></div>
                  </div>
                  <span className="font-bold text-primary">{data.overallConfidence || 0}%</span>
                </div>
              </div>
            </div>
          </Card>

          {data.violations && data.violations.length > 0 && (
            <Card title="Detected Violations" className="border-error/30">
              <div className="space-y-4">
                {data.violations.map((v, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="mt-1"><ShieldAlert className="text-error" size={20} /></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-gray-200 rounded text-gray-700">{v.ruleId}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-primary font-medium">{v.requirement}</p>
                      <p className="text-sm text-gray-500 mt-1">Detected: {v.detectedValue} | Expected: {v.expectedValue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Evidence">
            <div className="space-y-4">
              {data.evidenceImages && data.evidenceImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-border group">
                  <img src={img} alt={`Evidence ${i+1}`} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" className="text-xs">View Full</Button>
                  </div>
                </div>
              ))}
              <div className="p-4 border border-border rounded-xl flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                <FileText className="text-gray-400" size={24} />
                <div>
                  <p className="font-medium text-sm">compliance_cert_v2.pdf</p>
                  <p className="text-xs text-gray-500">Analyzed Document</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InspectionResult;
