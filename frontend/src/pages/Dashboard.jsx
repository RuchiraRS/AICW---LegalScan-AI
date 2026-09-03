import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { analyticsAPI, inspectionsAPI } from '../services/api';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInspections: 0,
    complianceRate: 0,
    activeViolations: 0,
    processingQueue: 0
  });
  const [recentInspections, setRecentInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Mon', compliant: 12, violations: 2 },
    { name: 'Tue', compliant: 19, violations: 4 },
    { name: 'Wed', compliant: 15, violations: 1 },
    { name: 'Thu', compliant: 22, violations: 5 },
    { name: 'Fri', compliant: 18, violations: 3 },
    { name: 'Sat', compliant: 10, violations: 1 },
    { name: 'Sun', compliant: 14, violations: 2 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fallback data in case endpoints aren't ready
        let dashboardStats = {
          totalInspections: 0,
          complianceRate: 0,
          activeViolations: 0,
          processingQueue: 0
        };
        let inspections = [];

        try {
          const statsRes = await analyticsAPI.getDashboard();
          const apiStats = statsRes.data.data;
          dashboardStats = {
            totalInspections: apiStats.totalInspections,
            complianceRate: apiStats.totalInspections ? Math.round((apiStats.compliantCount / apiStats.totalInspections) * 100) : 0,
            activeViolations: apiStats.potentialViolationsCount,
            processingQueue: apiStats.pendingReviewsCount
          };
        } catch (err) {
          console.warn('Could not fetch dashboard stats, using empty/fallback', err);
        }

        try {
          const inspRes = await inspectionsAPI.getAll({ limit: 5 });
          inspections = inspRes.data.data || [];
        } catch (err) {
          console.warn('Could not fetch recent inspections', err);
        }

        setStats(dashboardStats);
        setRecentInspections(inspections);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Overview</h1>
          <p className="text-gray-500 mt-1">Monitor compliance and enforcement metrics.</p>
        </div>
        <Button onClick={() => navigate('/inspect')}>New Inspection</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl"><Activity size={24} className="text-gray-700"/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Inspections</p>
              <p className="text-2xl font-bold">{stats.totalInspections || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl"><CheckCircle size={24} className="text-success"/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Compliance Rate</p>
              <p className="text-2xl font-bold">{stats.complianceRate || 0}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl"><AlertTriangle size={24} className="text-error"/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Violations</p>
              <p className="text-2xl font-bold">{stats.activeViolations || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl"><Clock size={24} className="text-accent"/></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Processing Queue</p>
              <p className="text-2xl font-bold">{stats.processingQueue || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card title="Weekly Enforcement Trends" className="lg:col-span-2">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="compliant" name="Compliant" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="violations" name="Violations" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Violation Breakdown">
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Missing MRP</span>
                <span className="font-medium text-primary">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Invalid Net Quantity</span>
                <span className="font-medium text-primary">30%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">No Mfg. Address</span>
                <span className="font-medium text-primary">15%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Other</span>
                <span className="font-medium text-primary">10%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Inspections" className="mt-8">
        <div className="overflow-x-auto">
          {recentInspections.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-y border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentInspections.map(insp => (
                  <tr key={insp._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/results/${insp._id}`)}>
                    <td className="px-4 py-4 font-medium text-primary">{insp.inspectionId}</td>
                    <td className="px-4 py-4">{insp.productId?.productName || 'Unknown Product'}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                        ${insp.complianceStatus === 'COMPLIANT' ? 'bg-green-100 text-green-800' : 
                          insp.complianceStatus === 'NON_COMPLIANT' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {insp.complianceStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{new Date(insp.inspectionDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${insp.overallConfidence || 0}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{insp.overallConfidence || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500">No recent inspections found.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
