// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import SessionManage from './pages/SessionManage';
import GameMasterManagement from './pages/GameMasterManagment';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/layout/ProtectedLayout';
import JoinSession from './components/Sessions/JoinSession';
import PlayerManagement from './pages/PlayerManagement'; 
// import NotFound from './components/pages/NotFound'; // Composant NotFound pour les routes non trouvées

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/join-session/:sessionToken" element={<JoinSession />} />

                    
                    
                    {/* Routes protégées */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/session/manage/:sessionToken" element={<SessionManage />} />
                        <Route path="/game-master/:sessionToken" element={<GameMasterManagement />} />
                    <Route path="/player/:sessionToken" element={<PlayerManagement />} />
                    </Route>

                    {/* Route 404 */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;