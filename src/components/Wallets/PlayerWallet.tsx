import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import axiosInstance from '../../api/axios';

const PlayerWallet: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [characterId, setCharacterId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCharacterId = async () => {
      try {
        const response = await axiosInstance.get(`/player/${sessionId}/character`);
        setCharacterId(response.data.character_id);
      } catch (error) {
        console.error("Erreur lors de la récupération du characterId:", error);
      }
    };

    if (!characterId) {
      fetchCharacterId();
    }
  }, [sessionId, characterId]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!characterId) return;

      try {
        const response = await axiosInstance.get(`/player/${sessionId}/wallet/${characterId}`);
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Erreur lors de la récupération du solde du porte-monnaie:", error);
      }
    };

    fetchWalletBalance();
  }, [sessionId, characterId]);

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Solde du Porte-monnaie</Typography>
      <Typography variant="h6">
        {balance !== null ? `${balance} crédits` : 'Chargement...'}
      </Typography>
    </Paper>
  );
};

export default PlayerWallet;