import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileText, Download, Calendar, X, Settings2, Image as ImageIcon } from 'lucide-react';
import { useSeedData } from '../context/SeedDataContext';

const Reports = () => {
  const { reports, addReport, getInspectionsWithDetails, getViolationsWithDetails } = useSeedData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: 'Compliance Report', 
    template: 'Detailed', 
    format: 'TXT', 
    urgency: 'Normal', 
    topic: 'All Activity',
    addressedTo: '',
    companyDetails: '',
    customContent: ''
  });

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const newReport = {
      id: `RPT-${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      type: formData.template,
      format: formData.format,
      topic: formData.topic,
      urgency: formData.urgency,
      addressedTo: formData.addressedTo,
      companyDetails: formData.companyDetails,
      customContent: formData.customContent,
      size: '1.2 MB' // Mock size
    };
    addReport(newReport);
    setShowModal(false);
  };

  const handleDownload = (report) => {
    const inspections = getInspectionsWithDetails();
    const violations = getViolationsWithDetails();
    
    let content = '';
    const isCSV = report.format === 'CSV';

    if (isCSV) {
      content += `Report Name,${report.name}\nDate,${report.date}\nTopic,${report.topic}\nAddressed To,${report.addressedTo || 'N/A'}\nCompany Details,${report.companyDetails || 'N/A'}\n\n`;
      content += `ID,Product,Status,Manufacturer\n`;
      inspections.forEach(i => {
        content += `${i.id},${i.productName},${i.status},${i.manufacturerName}\n`;
      });
      content += `\nRule,Severity,Product,Detected\n`;
      violations.forEach(v => {
        content += `${v.ruleDetails?.rule || v.ruleId},${v.severity},${v.productName},${v.detectedValue}\n`;
      });
    } else {
      content += `======================================\n`;
      content += `        ${report.name.toUpperCase()}\n`;
      content += `        Date: ${report.date}\n`;
      content += `======================================\n\n`;

      if (report.addressedTo) content += `To: ${report.addressedTo}\n`;
      if (report.companyDetails) content += `Company/Subject: ${report.companyDetails}\n`;
      
      content += `Topic: ${report.topic}\n`;
      content += `Urgency: ${report.urgency}\n\n`;

      if (report.customContent) {
        content += `MESSAGE / CONTENT\n`;
        content += `-----------------\n`;
        content += `${report.customContent}\n\n`;
      }
      
      content += `SUMMARY STATISTICS\n`;
      content += `------------------\n`;
      content += `Total Inspections: ${inspections.length}\n`;
      content += `Total Violations: ${violations.length}\n\n`;
      
      if (report.type === 'Detailed') {
        content += `RECENT INSPECTIONS\n`;
        content += `------------------\n`;
        inspections.forEach(i => {
          content += `ID: ${i.id} | Product: ${i.productName} | Status: ${i.status}\n`;
        });
        
        content += `\nACTIVE VIOLATIONS\n`;
        content += `-----------------\n`;
        violations.forEach(v => {
          content += `Rule: ${v.ruleDetails?.rule || v.ruleId} | Severity: ${v.severity} | Product: ${v.productName}\n`;
          content += `Expected: ${v.expectedValue} | Detected: ${v.detectedValue}\n\n`;
        });
      } else {
        content += `(Standard Template - Detail section omitted for brevity)\n`;
      }
    }
    
    const blob = new Blob([content], { type: isCSV ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.${isCSV ? 'csv' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="bg-bg-base w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border my-auto">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Settings2 className="text-accent" />
                <h2 className="text-xl font-editorial font-bold text-primary">Report Configuration</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleGenerateReport} className="p-6 space-y-5 bg-white">
              
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                  <input required type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent bg-gray-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Addressed To</label>
                  <input type="text" placeholder="e.g. Chief Inspector, Dept of Consumer Affairs" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.addressedTo} onChange={e => setFormData({...formData, addressedTo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Target Details</label>
                  <input type="text" placeholder="e.g. Acme Corp (FSSAI-12345)" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.companyDetails} onChange={e => setFormData({...formData, companyDetails: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.template} onChange={e => setFormData({...formData, template: e.target.value})}>
                    <option>Detailed</option>
                    <option>Standard Summary</option>
                    <option>Executive Brief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                  <select className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})}>
                    <option>TXT</option>
                    <option>CSV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Focus</label>
                  <select className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}>
                    <option>All Activity</option>
                    <option>Violations Only</option>
                    <option>Compliant Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                    <option>Normal</option>
                    <option>High (Immediate Review)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-border mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Custom Content / Remarks</label>
                <textarea rows={3} placeholder="Add any specific observations or official remarks here..." className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent resize-none" value={formData.customContent} onChange={e => setFormData({...formData, customContent: e.target.value})}></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach Supporting Images (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center gap-2">
                  <ImageIcon className="text-gray-400" size={24} />
                  <span className="text-sm text-gray-500">Select files to embed in report</span>
                  <input type="file" multiple className="hidden" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Formulate & Generate</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and download official compliance reports.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Generate New Report</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">Report Name</th>
                <th className="py-3 px-4 font-medium">Period</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Size</th>
                <th className="py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-bg-soft transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-accent" />
                      <span className="font-medium text-primary">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {item.date}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{item.size}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" className="text-xs py-1 flex items-center gap-2" onClick={() => handleDownload(item)}>
                      <Download size={14} /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && <div className="p-4 text-center text-gray-500">No reports found.</div>}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
