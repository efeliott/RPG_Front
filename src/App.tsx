// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/Signup';
import Dashboard from './components/pages/Dashboard';
import SessionManage from './components/pages/SessionManage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/layout/ProtectedLayout';
import JoinSession from './components/Sessions/JoinSession';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes sans le Sidebar */}
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/join-session/:sessionToken" element={<JoinSession />} />
                    
                    {/* Routes avec le Sidebar encapsulées dans ProtectedLayout */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/session/manage/:sessionToken" element={<SessionManage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;