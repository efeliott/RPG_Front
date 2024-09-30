// src/components/pages/Dashboard.tsx

import axiosInstance from '../../api/axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SessionsDataGrid from '../Sessions/SessionsDataGrid';

interface SessionData {
  session_id: number;
  title: string;
  description: string;
  token: string;
  game_master_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface APIResponse {
  game_master_sessions: SessionData[];
  invited_sessions: SessionData[];
}

export default function Dashboard() {
  const { token } = useAuth();
  const [gameMasterSessions, setGameMasterSessions] = useState<SessionData[]>([]);
  const [invitedSessions, setInvitedSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) {
        console.error('Token manquant');
        return;
      }

      try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axiosInstance.get<APIResponse>('/sessions/user');
        setGameMasterSessions(response.data.game_master_sessions);
        setInvitedSessions(response.data.invited_sessions);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des sessions:', error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  return (
    <div>
      <SessionsDataGrid
        sessions={gameMasterSessions}
        loading={loading}
        title="Sessions où vous êtes Maître de jeu"
      />
      <SessionsDataGrid
        sessions={invitedSessions}
        loading={loading}
        title="Sessions où vous êtes Invité"
      />
    </div>
  );
}