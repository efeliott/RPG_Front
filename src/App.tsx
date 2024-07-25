// ./src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
//import Dashboard from './components/Dashboard';
//import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
