import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldCheck, Database, Cpu, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_DASHBOARD_STATS, MOCK_RECENT_INSPECTIONS, MOCK_CHART_DATA } from '../services/mockData';

const MetricCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-bg-card rounded-2xl p-6 shadow-soft border border-border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold font-editorial text-primary">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(MOCK_DASHBOARD_STATS);
  const [inspections, setInspections] = useState(MOCK_RECENT_INSPECTIONS);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Inspections" 
          value={stats.totalInspections.toLocaleString()} 
          icon={Activity} 
          colorClass="bg-gray-100 text-gray-700"
          subtitle="+12% from last month"
        />
        <MetricCard 
          title="Compliant" 
          value={stats.compliantCount.toLocaleString()} 
          icon={CheckCircle} 
          colorClass="bg-green-50 text-green-600"
          subtitle="89.9% compliance rate"
        />
        <MetricCard 
          title="Potential Violations" 
          value={stats.potentialViolationsCount.toLocaleString()} 
          icon={AlertTriangle} 
          colorClass="bg-red-50 text-red-500"
          subtitle="Requires officer review"
        />
        <MetricCard 
          title="Pending Review" 
          value={stats.pendingReviewsCount.toLocaleString()} 
          icon={Clock} 
          colorClass="bg-orange-50 text-accent"
          subtitle="In processing queue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-bg-card rounded-2xl shadow-soft border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-editorial">Weekly Enforcement Trends</h3>
            <select className="bg-bg-soft border-none text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="compliant" name="Compliant" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={32} />
                <Bar dataKey="violations" name="Violations" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI System Status */}
        <div className="bg-bg-card rounded-2xl shadow-soft border border-border p-6 flex flex-col">
          <h3 className="text-lg font-bold font-editorial mb-6">System Status</h3>
          <div className="space-y-5 flex-1">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Cpu size={18} /></div>
                <div>
                  <p className="text-sm font-medium">CNN Vision Model</p>
                  <p className="text-xs text-gray-500">v2.4.1 (MobileNetV2)</p>
                </div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-success"></span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Search size={18} /></div>
                <div>
                  <p className="text-sm font-medium">OCR Extraction</p>
                  <p className="text-xs text-gray-500">EasyOCR Engine</p>
                </div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-success"></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-accent rounded-lg"><Database size={18} /></div>
                <div>
                  <p className="text-sm font-medium">Rule Engine</p>
                  <p className="text-xs text-gray-500">2011 Metrology Act Rules</p>
                </div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-success"></span>
            </div>

          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-success" />
            All systems operational. Last sync: 2 mins ago.
          </div>
        </div>

      </div>

      {/* Recent Inspections Table */}
      <div className="bg-bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold font-editorial">Recent Inspections</h3>
          <button onClick={() => navigate('/history')} className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-soft text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">ID</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Product</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Date</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">AI Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inspections.map((insp) => (
                <tr key={insp._id} onClick={() => navigate(`/results/${insp._id}`)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary">{insp.inspectionId}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{insp.productId.productName}</p>
                    <p className="text-xs text-gray-500">{insp.productId.manufacturer}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(insp.inspectionDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase ${
                      insp.complianceStatus === 'COMPLIANT' ? 'bg-green-100 text-green-700' :
                      insp.complianceStatus === 'NON_COMPLIANT' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {insp.complianceStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full max-w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${insp.overallConfidence}%` }}></div>
                      </div>
                      <span className="font-medium">{insp.overallConfidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
