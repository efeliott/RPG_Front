import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/Signup';
import Dashboard from './components/pages/Dashboard';
import SessionManage from './components/pages/SessionManage';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/session/manage/:sessionToken" element={<SessionManage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};
  
  export default App;