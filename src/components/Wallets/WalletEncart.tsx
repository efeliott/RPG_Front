import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import axiosInstance from '../../api/axios';

const WalletEncart: React.FC<{ sessionId: number }> = ({ sessionId }) => {
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

    fetchCharacterId();
  }, [sessionId]);

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

    const interval = setInterval(fetchWalletBalance, 5000);
    fetchWalletBalance();
    return () => clearInterval(interval);
  }, [sessionId, characterId]);

  return (
    <Paper
      sx={{
        padding: 2,
        marginBottom: 3,
        textAlign: 'center',
        maxWidth: 200,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9fb',
      }}
    >
      <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 500 }}>
        Porte-monnaie
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#3f51b5', marginTop: 1 }}>
        {balance !== null ? `${balance} crédits` : 'Chargement...'}
      </Typography>
    </Paper>
  );
};

export default WalletEncart;
