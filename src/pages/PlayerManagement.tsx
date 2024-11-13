import React, { useEffect, useState } from 'react';
import { PlayerSessionProvider, usePlayerSession } from '../context/PlayerSessionContext';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import PlayerInventory from '../components/Inventories/PlayerInventory';
import PlayerCharacter from '../components/Characters/PlayerCharacter';
import PlayerShop from '../components/Shops/PlayerShop';
import PlayerQuests from '../components/Quests/PlayerQuests';
import WalletEncart from '../components/Wallets/WalletEncart.tsx';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PlayerManagementContent: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const { character, loadCharacter } = usePlayerSession();
  const [tabValue, setTabValue] = useState(2); // Onglet par défaut : Inventaire

  useEffect(() => {
    loadCharacter(sessionId);
  }, [sessionId, loadCharacter]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord Joueur - {character ? character.name : 'Chargement...'}
      </Typography>

      {/* Affichage de l'encart Wallet en haut, toujours visible */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <WalletEncart sessionId={sessionId} />
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Gestion Joueur">
        <Tab label="Personnage" />
        <Tab label="Inventaire" />
        <Tab label="Magasin" />
        <Tab label="Quêtes" />
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
        {tabValue === 0 && <PlayerCharacter sessionId={sessionId} />}
        {tabValue === 1 && <PlayerInventory sessionId={sessionId} />}
        {tabValue === 2 && <PlayerShop sessionId={sessionId} />}
        {tabValue === 3 && <PlayerQuests sessionId={sessionId} />}
      </Box>
    </Box>
  );
};

const PlayerManagement: React.FC = () => {
  const { sessionToken } = useParams<{ sessionToken: string }>();
  const { token } = useAuth();
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axiosInstance.get(`/session/${sessionToken}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessionId(response.data.session_id);
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      }
    };

    fetchSessionId();
  }, [sessionToken, token]);

  if (!sessionId) {
    return <Typography>Session non trouvée</Typography>;
  }

  return (
    <PlayerSessionProvider>
      <PlayerManagementContent sessionId={sessionId} />
    </PlayerSessionProvider>
  );
};

export default PlayerManagement;