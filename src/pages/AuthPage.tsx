// src/components/pages/AuthPage.tsx

import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Login from '../components/Auth/SignIn';
import Signup from '../components/Auth/Signup';
import '../../styles/pages/Dashboard.css';

const AuthPage: React.FC = () => {
    return (
        <div className="auth-page">
            <nav className="auth-nav">
                <Link to="/login" className="auth-link">
                    Login
                </Link>
                <Link to="/signup" className="auth-link">
                    Signup
                </Link>
            </nav>
            <div className="auth-form-container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>
        </div>
    );
};

export default AuthPage;