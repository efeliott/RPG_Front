// src/components/SessionsManagement/AddCharacter.tsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography, Select, MenuItem, FormControl, InputLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axiosInstance from '../../api/axios';

interface AddCharacterProps {
  sessionId: number;
  open: boolean;
  onClose: () => void;
  onCharacterAdded: () => void;
}

interface UserData {
  id: number;
  username: string;
}

interface WalletData {
  id: number;
  balance: number;
  character: {
    name: string;
  } | null;
  user: {
    username: string;
  } | null;
}

const AddCharacter: React.FC<AddCharacterProps> = ({ sessionId, open, onClose, onCharacterAdded }) => {
  const [name, setName] = useState('');
  const [charClass, setCharClass] = useState('');
  const [abilities, setAbilities] = useState('');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [usersWithoutCharacter, setUsersWithoutCharacter] = useState<UserData[]>([]);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsersWithoutCharacter = async () => {
      try {
        const response = await axiosInstance.get(`/session-management/sessions/${sessionId}/users-without-character`);
        setUsersWithoutCharacter(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs sans personnage :", error);
      }
    };

    const fetchWallets = async () => {
      try {
        const response = await axiosInstance.get(`/session-management/${sessionId}/wallets`);
        setWallets(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des wallets :", error);
      }
    };

    if (open) {
      fetchUsersWithoutCharacter();
      fetchWallets();
    }
  }, [sessionId, open]);

  const handleAddCharacter = async () => {
    setError('');
    if (!name || !charClass || !selectedUser) {
      setError("Name, class, and user selection are required.");
      return;
    }

    try {
      await axiosInstance.post(`/session-management/${sessionId}/character`, {
        name,
        class: charClass,
        abilities,
        user_id: selectedUser,
      });
      onCharacterAdded();
      onClose();
    } catch (err) {
      console.error("Error adding character:", err);
      setError("Failed to add character. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Personnage</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="user-select-label">Sélectionner un utilisateur</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
            label="Sélectionner un utilisateur"
          >
            {usersWithoutCharacter.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom>Infos Wallets</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Character Name</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>{wallet.character?.name || 'N/A'}</TableCell>
                  <TableCell>{wallet.user?.username || 'N/A'}</TableCell> {/* Utilise username ici */}
                  <TableCell align="right">{wallet.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TextField
          autoFocus
          margin="dense"
          label="Nom"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Classe"
          fullWidth
          value={charClass}
          onChange={(e) => setCharClass(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Compétences"
          fullWidth
          multiline
          rows={3}
          value={abilities}
          onChange={(e) => setAbilities(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleAddCharacter} variant="contained" color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCharacter;
