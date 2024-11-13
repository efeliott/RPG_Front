// src/components/layout/ProtectedLayout.tsx

import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import DashboardLayoutBasic from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';

const ProtectedLayout: React.FC = () => {
    const { token, user } = useAuth();
    const location = useLocation();
    const { sessionToken } = useParams<{ sessionToken: string }>();
    const [isGameMaster, setIsGameMaster] = useState(true); // Initialisation à true pour éviter la double vérification
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isGameMasterRoute = location.pathname.startsWith('/game-master');

        if (isGameMasterRoute && sessionToken && user) {
            // Effectue la vérification seulement pour les routes Game Master
            const fetchSessionData = async () => {
                try {
                    const response = await axiosInstance.get(`/game-master/${sessionToken}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setIsGameMaster(response.data.game_master_id === user.id);
                } catch (error) {
                    console.error('Erreur lors de la vérification du rôle Game Master:', error);
                    setIsGameMaster(false);
                } finally {
                    setLoading(false);
                }
            };
            fetchSessionData();
        } else {
            setLoading(false); // Désactive le chargement immédiatement si la route n'est pas Game Master
        }
    }, [sessionToken, user, token, location.pathname]);

    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (location.pathname.startsWith('/game-master') && !isGameMaster) {
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
