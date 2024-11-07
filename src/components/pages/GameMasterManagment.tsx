// src/components/pages/GameMasterManagement.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Button, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import CharacterList from '../SessionsManagment/CharacterList';
import WalletManagement from '../SessionsManagment/WalletManagment';
import InventoryManagement from '../SessionsManagment/InventoryManagment';
import AddCharacter from '../SessionsManagment/AddCharacter';
import axiosInstance from '../../api/axios';

interface User {
  id: number;
  username: string;
}

const GameMasterManagement: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, token } = useAuth();
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [usersWithoutCharacter, setUsersWithoutCharacter] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosInstance.get(`/game-master/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessionData(response.data);
        setIsGameMaster(response.data.game_master_id === user?.id);
      } catch (err) {
        console.error("Erreur lors de la récupération des données de la session:", err);
      }
    };

    const fetchUsersWithoutCharacter = async () => {
      try {
        const response = await axiosInstance.get(`/sessions/${sessionId}/users-without-character`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersWithoutCharacter(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs sans personnage :", error);
      }
    };

    fetchSessionData();
    fetchUsersWithoutCharacter();
  }, [sessionId, user, token]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCharacterAdded = () => {
    handleCloseDialog();
    setUsersWithoutCharacter((prev) => prev.filter((user) => user.id !== selectedUser?.id));
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
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
      {tabValue === 0 && (
        <>
        <CharacterList sessionId={Number(sessionId)} />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Ajouter un personnage pour un utilisateur</Typography>
        <List>
          {usersWithoutCharacter.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.username} />
            <Button variant="contained" onClick={() => handleOpenDialog(user)}>
            Ajouter un personnage
            </Button>
          </ListItem>
          ))}
        </List>
        </>
      )}
      {tabValue === 1 && <WalletManagement sessionId={Number(sessionId)} />}
      {tabValue === 2 && <InventoryManagement characterId={Number(sessionId)} />}
      </Box>

      {selectedUser && (
      <AddCharacter
        sessionId={Number(sessionId)}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onCharacterAdded={handleCharacterAdded}
      />
      )}
    </Box>
  );
};

export default GameMasterManagement;