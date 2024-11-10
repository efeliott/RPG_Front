import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CharacterList from '../components/Characters/CharacterList';
import WalletManagement from '../components/Wallets/WalletManagment';
import InventoryList from '../components/Inventories/InventoryList';
import ShopManagement from '../components/Shops/ShopManagement';
import QuestList from '../components/Quests/QuestList';
import QuestForm from '../components/Quests/QuestForm';
import axiosInstance from '../api/axios';

const GameMasterManagement: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, token } = useAuth();
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosInstance.get(`/game-master/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessionData(response.data);
        setIsGameMaster(response.data.game_master_id === user?.id);
      } catch (err) {
        console.error("Erreur lors de la récupération des données de la session:", err);
      }
    };

    fetchSessionData();
  }, [sessionId, user, token]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (!isGameMaster) {
    return <Typography>Vous n'êtes pas autorisé à accéder à cette page.</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion de la session : {sessionData?.title}
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Gestion Game Master">
        <Tab label="Personnages" />
        <Tab label="Wallets" />
        <Tab label="Inventaire" />
        <Tab label="Shop" />
        <Tab label="Quêtes" />
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
        {tabValue === 0 && <CharacterList sessionId={Number(sessionId)} />}
        {tabValue === 1 && <WalletManagement sessionId={Number(sessionId)} />}
        {tabValue === 2 && <InventoryList sessionId={Number(sessionId)} />}
        {tabValue === 3 && <ShopManagement sessionId={Number(sessionId)} />}
        {tabValue === 4 && (
          <>
            <Button variant="contained" onClick={handleOpenDialog} sx={{ marginBottom: 2 }}>Créer une Quête</Button>
            <QuestList sessionId={Number(sessionId)} />
            {dialogOpen && (
              <QuestForm
                sessionId={Number(sessionId)}
                onSave={() => {
                  handleCloseDialog();
                  // Actualise la liste des quêtes après la création ou la modification
                }}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default GameMasterManagement;