import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axiosInstance from '../../api/axios';

interface Wallet {
  id: number;
  balance: number;
  character: {
    name: string;
  } | null;
  user: {
    username: string;
  } | null;
}

const WalletManagement: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const fetchWallets = async () => {
      const response = await axiosInstance.get(`/session-management/${sessionId}/wallets`);
      setWallets(response.data);
    };
    fetchWallets();
  }, [sessionId]);

  const updateWallet = async (walletId: number, amount: number) => {
    await axiosInstance.put(`/session-management/wallet/${walletId}`, { amount });
    const response = await axiosInstance.get(`/session-management/${sessionId}/wallets`);
    setWallets(response.data);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Character Name</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wallets.map((wallet) => (
            <TableRow key={wallet.id}>
              <TableCell>{wallet.character?.name || 'N/A'}</TableCell>
              <TableCell>{wallet.user?.username || 'N/A'}</TableCell>
              <TableCell align="right">{wallet.balance}</TableCell>
              <TableCell align="right">
                <Button onClick={() => updateWallet(wallet.id, 10)}>+10</Button>
                <Button onClick={() => updateWallet(wallet.id, -10)}>-10</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WalletManagement;
