import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Package, Search, X, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useSeedData } from '../context/SeedDataContext';

const Products = () => {
  const { getProductsWithMfg, addProduct, updateProduct, manufacturers } = useSeedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', weight: '', manufacturerId: manufacturers[0]?.id || '', category: 'Food', image: null });
  
  const products = getProductsWithMfg();

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      weight: product.weight,
      manufacturerId: product.manufacturerId,
      category: product.category,
      image: null
    });
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', weight: '', manufacturerId: manufacturers[0]?.id || '', category: 'Food', image: null });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        weight: formData.weight || 'N/A',
        manufacturerId: formData.manufacturerId,
        category: formData.category
      });
    } else {
      const newProduct = {
        id: `PRD-${Math.floor(Math.random() * 1000)}`,
        name: formData.name,
        weight: formData.weight || 'N/A',
        manufacturerId: formData.manufacturerId,
        category: formData.category
      };
      addProduct(newProduct);
    }
    setShowModal(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-base w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
              <h2 className="text-xl font-editorial font-bold text-primary">
                {editingId ? 'Edit Product Details' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Parle-G Biscuits" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Quantity</label>
                  <input type="text" className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 150g" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Food</option>
                    <option>Beverage</option>
                    <option>Dairy</option>
                    <option>Cosmetics</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <select className="w-full p-2 border border-border rounded-lg focus:outline-none focus:border-accent" value={formData.manufacturerId} onChange={e => setFormData({...formData, manufacturerId: e.target.value})}>
                  {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (PDP)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center gap-2">
                  <ImageIcon className="text-gray-400" size={24} />
                  <span className="text-sm text-gray-500">Click to upload or drag & drop</span>
                  <input type="file" className="hidden" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingId ? 'Save Changes' : 'Register Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Product Master</h1>
          <p className="text-gray-500 mt-1">Manage registered products and their standard specifications.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <Button onClick={handleOpenAdd}>Add Product</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">Product ID</th>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Net Quantity</th>
                <th className="py-3 px-4 font-medium">Manufacturer</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-bg-soft transition-colors">
                  <td className="py-3 px-4 font-medium text-primary">{item.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                        <Package size={16} />
                      </div>
                      <span className="font-medium text-primary">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.weight}</td>
                  <td className="py-3 px-4 text-gray-600">{item.manufacturer}</td>
                  <td className="py-3 px-4 text-gray-600">{item.category}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" className="text-xs py-1 flex items-center gap-2" onClick={() => handleOpenEdit(item)}>
                      <Edit2 size={12} /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && <div className="p-4 text-center text-gray-500">No products found.</div>}
        </div>
      </Card>
    </div>
  );
};

export default Products;
