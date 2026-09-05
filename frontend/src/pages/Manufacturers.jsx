import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Building2, Search, X, Image as ImageIcon, MapPin, Award, Activity } from 'lucide-react';
import { useSeedData } from '../context/SeedDataContext';

const Manufacturers = () => {
  const { manufacturers, addManufacturer } = useSeedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingMfg, setViewingMfg] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', license: '', logo: null });

  const handleAddMfg = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const newMfg = {
      id: `MFG-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      location: formData.location || 'Unknown Location',
      license: formData.license || `FSSAI-${Math.floor(Math.random() * 1000000)}`,
      status: 'Active',
      complianceScore: Math.floor(Math.random() * 20) + 80 // Random score between 80-100
    };
    addManufacturer(newMfg);
    setShowModal(false);
    setFormData({ name: '', location: '', license: '', logo: null });
  };

  const filteredMfg = manufacturers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 relative">
      
      {/* Manufacturer Profile Modal */}
      {viewingMfg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-base w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
              <h2 className="text-xl font-editorial font-bold text-primary">Manufacturer Profile</h2>
              <button onClick={() => setViewingMfg(null)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 bg-white space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">{viewingMfg.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">ID: {viewingMfg.id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><MapPin size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Location</span></div>
                  <p className="font-medium text-gray-900">{viewingMfg.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><Award size={16} /> <span className="text-xs font-bold uppercase tracking-wider">License No.</span></div>
                  <p className="font-medium text-gray-900">{viewingMfg.license || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><Activity size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Compliance Score</span></div>
                  <p className="font-medium text-green-600 text-xl">{viewingMfg.complianceScore}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><Activity size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Status</span></div>
                  <p className="font-medium text-blue-600">{viewingMfg.status}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-end">
                <Button onClick={() => setViewingMfg(null)}>Close Profile</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Manufacturer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-base w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
              <h2 className="text-xl font-editorial font-bold text-primary">Add Manufacturer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddMfg} className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input required type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Location</label>
                <input type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Mumbai, Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License/Registration Number</label>
                <input type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} placeholder="e.g. FSSAI-123456" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo / Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center gap-2">
                  <ImageIcon className="text-gray-400" size={24} />
                  <span className="text-sm text-gray-500">Click to upload or drag & drop</span>
                  <input type="file" className="hidden" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Register Company</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Manufacturers</h1>
          <p className="text-gray-500 mt-1">Directory of registered manufacturers and compliance profiles.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search manufacturers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <Button onClick={() => setShowModal(true)}>Add Manufacturer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMfg.map((item, idx) => (
          <Card key={idx} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-primary">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.id}</p>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Location:</span> <span className="font-medium">{item.location}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status:</span> <span className="font-medium text-green-600">{item.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Compliance Score:</span> <span className="font-medium">{item.complianceScore}%</span></div>
            </div>
            <div className="pt-4 border-t border-border mt-auto flex justify-end">
              <Button variant="outline" className="text-xs py-1" onClick={() => setViewingMfg(item)}>Profile</Button>
            </div>
          </Card>
        ))}
        {filteredMfg.length === 0 && <p className="text-gray-500 col-span-3">No manufacturers found.</p>}
      </div>
    </div>
  );
};

export default Manufacturers;
