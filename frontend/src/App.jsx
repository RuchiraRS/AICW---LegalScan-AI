import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import Processing from './pages/Processing';
import InspectionResult from './pages/InspectionResult';

import History from './pages/History';
import Violations from './pages/Violations';
import Products from './pages/Products';
import Manufacturers from './pages/Manufacturers';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import { SeedDataProvider } from './context/SeedDataContext';

function App() {
  return (
    <SeedDataProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Core App Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inspect" element={<NewInspection />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results/:id" element={<InspectionResult />} />
          <Route path="/history" element={<History />} />
          <Route path="/violations" element={<Violations />} />
          <Route path="/products" element={<Products />} />
          <Route path="/manufacturers" element={<Manufacturers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<div className="h-screen flex items-center justify-center flex-col"><h1 className="text-4xl font-editorial font-bold text-primary">404</h1><p className="text-gray-500 mt-2">Page Not Found</p></div>} />
        </Routes>
      </Router>
    </SeedDataProvider>
  );
}

export default App;
