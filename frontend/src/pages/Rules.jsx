import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { BookOpen, CheckCircle2, Search, X, ShieldCheck, Loader2 } from 'lucide-react';
import { useSeedData } from '../context/SeedDataContext';

const Rules = () => {
  const { rules, addRule } = useSeedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ rule: '', section: '', act: 'Legal Metrology Act, 2009' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate API call to government DB
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!isVerified) return;
    
    const newRule = {
      id: `CUST-${Math.floor(Math.random() * 1000)}`,
      rule: formData.rule,
      section: `${formData.section} of ${formData.act}`,
      status: 'Active'
    };
    addRule(newRule);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ rule: '', section: '', act: 'Legal Metrology Act, 2009' });
    setIsVerified(false);
    setIsVerifying(false);
  };

  const handleConfigure = (ruleName) => {
    alert(`Configuration for ${ruleName} would open here.`);
  };

  const filteredRules = rules.filter(r => 
    r.rule.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-base w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-600" />
                <h2 className="text-xl font-editorial font-bold text-primary">Add Custom Rule</h2>
              </div>
              <button onClick={() => {setShowModal(false); resetForm();}} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddRule} className="p-6 space-y-4 bg-white">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-100 mb-4">
                All custom rules must be verified against the official government act or scheme database before activation.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule/Amendment Name</label>
                <input required disabled={isVerified} type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-50" value={formData.rule} onChange={e => setFormData({...formData, rule: e.target.value})} placeholder="e.g. Revised MRP Guidelines" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Act / Scheme</label>
                  <select disabled={isVerified} className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-50" value={formData.act} onChange={e => setFormData({...formData, act: e.target.value})}>
                    <option>Legal Metrology Act, 2009</option>
                    <option>FSSAI Act, 2006</option>
                    <option>BIS Act, 2016</option>
                    <option>Consumer Protection Act, 2019</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section / Clause</label>
                  <input required disabled={isVerified} type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-50" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} placeholder="e.g. Rule 6(1)(e)" />
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-between border-t border-border mt-4">
                {!isVerified ? (
                  <Button type="button" onClick={handleVerify} disabled={isVerifying || !formData.rule || !formData.section} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900">
                    {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    {isVerifying ? 'Verifying with Govt DB...' : 'Verify Rule'}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <CheckCircle2 size={18} /> Verified Officially
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => {setShowModal(false); resetForm();}}>Cancel</Button>
                  <Button type="submit" disabled={!isVerified} className="disabled:opacity-50">Add Rule</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Rule Engine</h1>
          <p className="text-gray-500 mt-1">Manage validation rules and compliance standards.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <Button onClick={() => setShowModal(true)}>Add Custom Rule</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((item, idx) => (
          <Card key={idx}>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-accent">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-primary">{item.rule}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{item.section}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{item.id}</span>
                  <Button variant="outline" className="text-xs py-1" onClick={() => handleConfigure(item.rule)}>Configure</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredRules.length === 0 && <p className="text-gray-500">No rules found.</p>}
      </div>
    </div>
  );
};

export default Rules;
