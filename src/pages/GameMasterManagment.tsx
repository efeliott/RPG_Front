// src/components/pages/GameMasterManagement.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CharacterList from '../components/Characters/CharacterList';
import WalletManagement from '../components/Wallets/WalletManagment';
import InventoryList from '../components/Inventories/InventoryList';
import ShopManagement from '../components/Shops/ShopManagement';
import QuestList from '../components/Quests/QuestList';
import axiosInstance from '../api/axios';

const GameMasterManagement: React.FC = () => {
  const { sessionToken } = useParams<{ sessionToken: string }>();
  const { token } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosInstance.get(`/game-master/${sessionToken}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessionData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données de la session:", err);
      }
    };

    fetchSessionData();
  }, [sessionToken, token]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion de la session : {sessionData?.title}
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Gestion Game Master">
        <Tab label="Personnages" />
        <Tab label="Porte-monnaie" />
        <Tab label="Inventaire" />
        <Tab label="Magasin" />
        <Tab label="Quêtes" />
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
        {tabValue === 0 && <CharacterList sessionId={sessionData?.session_id} />}
        {tabValue === 1 && <WalletManagement sessionId={sessionData?.session_id} />}
        {tabValue === 2 && <InventoryList sessionId={sessionData?.session_id} />}
        {tabValue === 3 && <ShopManagement sessionId={sessionData?.session_id} />}
        {tabValue === 4 && <QuestList sessionId={sessionData?.session_id} />}
      </Box>
    </Box>
  );
};

export default GameMasterManagement;