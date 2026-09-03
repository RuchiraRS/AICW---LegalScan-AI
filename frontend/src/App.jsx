import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import InspectionResult from './pages/InspectionResult';
import Violations from './pages/Violations';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Main Application Routes within Layout */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inspect" element={<NewInspection />} />
          <Route path="/results/:id" element={<InspectionResult />} />
          <Route path="/violations" element={<Violations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<div className="p-8">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
