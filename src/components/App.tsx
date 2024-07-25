// src/components/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<h1 className="text-center mt-10">Bienvenue sur la page d'accueil</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;