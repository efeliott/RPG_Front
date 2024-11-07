// src/components/layout/ProtectedLayout.tsx

import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import DashboardLayoutBasic from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';

const ProtectedLayout: React.FC = () => {
    const { token, user } = useAuth();
    const location = useLocation();
    const { sessionId } = useParams<{ sessionId: string }>();
    const [isGameMaster, setIsGameMaster] = useState(false);

    useEffect(() => {
        if (sessionId && user) {
            // Vérifie si l'utilisateur est le Game Master pour cette session
            const fetchSessionData = async () => {
                try {
                    const response = await axiosInstance.get(`/game-master/${sessionId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setIsGameMaster(response.data.game_master_id === user.id);
                } catch (error) {
                    console.error('Erreur lors de la vérification du rôle Game Master:', error);
                }
            };
            fetchSessionData();
        }
    }, [sessionId, user, token]);

    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    const isGameMasterRoute = location.pathname.startsWith('/game-master');
    if (isGameMasterRoute && !isGameMaster) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div style={{ display: 'flex', marginTop: '5rem' }}>
            <DashboardLayoutBasic />
            <main style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;