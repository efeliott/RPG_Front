import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/Signup';
import Dashboard from './components/pages/Dashboard';
// import AuthPage from './components/pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Ajoute ici d'autres routes si nécessaire */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};
  
  export default App;