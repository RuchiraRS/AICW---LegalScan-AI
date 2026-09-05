import React from 'react';
import Card from '../components/Card';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useSeedData } from '../context/SeedDataContext';

const Analytics = () => {
  const { inspections, violations, getViolationsWithDetails, scheduledInspections } = useSeedData();
  
  const totalInspections = inspections.length;
  const compliantInspections = inspections.filter(i => i.status === 'Compliant').length;
  const complianceRate = totalInspections === 0 ? 0 : ((compliantInspections / totalInspections) * 100).toFixed(1);
  const criticalViolations = violations.filter(v => v.severity === 'HIGH').length;

  const violationsWithDetails = getViolationsWithDetails();
  
  // Calculate violation categories dynamically
  const categoryCounts = {};
  violationsWithDetails.forEach(v => {
    const name = v.ruleDetails?.rule || 'Other';
    categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  const totalViolations = violationsWithDetails.length;
  const categoryStats = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    percentage: totalViolations === 0 ? 0 : Math.round((count / totalViolations) * 100)
  })).sort((a, b) => b.percentage - a.percentage).slice(0, 4);

  // Compute monthly chart data dynamically
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyCounts = {};
  inspections.forEach(i => {
    const d = new Date(i.date);
    if (!isNaN(d.getTime())) {
      const month = monthNames[d.getMonth()];
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    }
  });
  
  // Get last 6 months present in data or just all available
  const maxMonthlyCount = Math.max(...Object.values(monthlyCounts), 1);
  const chartData = Object.entries(monthlyCounts).map(([month, count]) => ({
    month,
    count,
    percentage: Math.max((count / maxMonthlyCount) * 100, 10) // minimum 10% for visibility
  }));

  // Pre-defined colors for dynamic bars
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-gray-500'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Analytics & Insights</h1>
        <p className="text-gray-500 mt-1">System-wide compliance trends and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-none shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><BarChart2 /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Inspections</p>
              <h2 className="text-3xl font-bold text-primary">{totalInspections}</h2>
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-none shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Compliance Rate</p>
              <h2 className="text-3xl font-bold text-primary">{complianceRate}%</h2>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50 border-none shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Critical Violations</p>
              <h2 className="text-3xl font-bold text-primary">{criticalViolations}</h2>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Violations by Category">
          <div className="space-y-4 mt-4">
            {categoryStats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate pr-4">{stat.name}</span>
                  <span className="font-bold">{stat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${colors[idx % colors.length]} h-2 rounded-full`} style={{ width: `${stat.percentage}%` }}></div>
                </div>
              </div>
            ))}
            {categoryStats.length === 0 && <p className="text-sm text-gray-500">No violations recorded yet.</p>}
          </div>
        </Card>

        <Card title="Monthly Inspection Volume">
          <div className="h-48 flex items-end justify-between mt-4 gap-2">
            {chartData.map((data, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group h-full flex flex-col justify-end">
                <div className="w-full bg-accent rounded-t-sm transition-all" style={{ height: `${data.percentage}%` }}></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {data.count}
                </div>
              </div>
            ))}
            {chartData.length === 0 && <p className="text-gray-500 m-auto">No data</p>}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {chartData.map((data, i) => (
              <span key={i} className="truncate px-1">{data.month}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Schedule Manager Tableau">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">Schedule ID</th>
                <th className="py-3 px-4 font-medium">Target / Manufacturer</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Assigned Officer</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledInspections.map((sch, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-bg-soft transition-colors">
                  <td className="py-3 px-4 font-medium text-primary">{sch.id}</td>
                  <td className="py-3 px-4 text-gray-700">{sch.target}</td>
                  <td className="py-3 px-4 text-gray-600">{sch.date}</td>
                  <td className="py-3 px-4 text-gray-600">{sch.officer}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      sch.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {sch.status}
                    </span>
                  </td>
                </tr>
              ))}
              {scheduledInspections.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">No scheduled inspections.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
