import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import SessionsDataGrid from '../Sessions/SessionsDataGrid';
import Button from '@mui/material/Button';
import CreateSessionModal from '../Sessions/CreateSessionModal';
import { SessionData } from '../../types';

interface APIResponse {
  game_master_sessions: SessionData[];
  invited_sessions: SessionData[];
}

export default function Dashboard() {
  const { token } = useAuth();
  const [gameMasterSessions, setGameMasterSessions] = useState<SessionData[]>([]);
  const [invitedSessions, setInvitedSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchSessions = async () => {
    if (!token) {
      console.error('Token manquant');
      return;
    }

    try {
      setLoading(true);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axiosInstance.get<APIResponse>('/sessions/user');

      if (response.data) {
        setGameMasterSessions(response.data.game_master_sessions);
        setInvitedSessions(response.data.invited_sessions);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Créer une session
      </Button>

      <SessionsDataGrid
        sessions={gameMasterSessions}
        loading={loading}
        title="Sessions où vous êtes Maître de jeu"
        setSessions={setGameMasterSessions}
      />

      <SessionsDataGrid
        sessions={invitedSessions}
        loading={loading}
        title="Sessions où vous êtes Invité"
      />

      <CreateSessionModal 
        open={openModal} 
        handleClose={handleCloseModal} 
        setSessions={setGameMasterSessions} 
      />
    </div>
  );
}
