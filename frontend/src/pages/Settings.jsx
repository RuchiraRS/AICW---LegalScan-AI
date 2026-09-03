import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const Settings = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your LegalScan AI preferences.</p>
      </div>

      <Card title="AI Confidence Thresholds">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">High Confidence Threshold (%)</label>
            <input type="range" min="0" max="100" defaultValue="90" className="w-full accent-accent" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Findings above this threshold will be marked as highly confident.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review Required Threshold (%)</label>
            <input type="range" min="0" max="100" defaultValue="75" className="w-full accent-accent" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Findings below this threshold will automatically be flagged for officer review.</p>
          </div>
          <Button>Save Thresholds</Button>
        </div>
      </Card>

      <Card title="System Configuration">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-medium text-primary">Active Rule Engine Version</p>
              <p className="text-sm text-gray-500">Legal Metrology Rules 2011 (v2.4)</p>
            </div>
            <Button variant="outline">Update Engine</Button>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-primary">Notification Preferences</p>
              <p className="text-sm text-gray-500">Receive alerts for High Severity violations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
