import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
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
  const [customAmounts, setCustomAmounts] = useState<{ [key: number]: number }>({});

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

  const handleCustomAmountChange = (walletId: number, amount: number) => {
    setCustomAmounts((prev) => ({
      ...prev,
      [walletId]: amount,
    }));
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
                <TextField
                  type="number"
                  value={customAmounts[wallet.id] || ''}
                  onChange={(e) => handleCustomAmountChange(wallet.id, Number(e.target.value))}
                  placeholder="Custom Amount"
                  size="small"
                  style={{ width: 100, marginLeft: 8 }}
                />
                <Button onClick={() => updateWallet(wallet.id, customAmounts[wallet.id] || 0)} disabled={!customAmounts[wallet.id]}>
                  Appliquer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WalletManagement;