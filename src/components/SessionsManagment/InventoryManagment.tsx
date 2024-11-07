import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axiosInstance from '../../api/axios';

interface InventoryItem {
  inventory_id: number;
  item_id: number;
  max_quantity: number;
  item: {
    title: string;
  };
}

const InventoryManagement: React.FC<{ characterId: number }> = ({ characterId }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await axiosInstance.get(`/session-management/character/${characterId}/inventory`);
      setInventory(response.data);
    };
    fetchInventory();
  }, [characterId]);

  const modifyQuantity = async (inventoryId: number, delta: number) => {
    await axiosInstance.put(`/session-management/inventory/${inventoryId}`, { delta });
    // Refresh inventory after update
    const response = await axiosInstance.get(`/session-management/character/${characterId}/inventory`);
    setInventory(response.data);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Max Quantity</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.inventory_id}>
              <TableCell>{item.item.title}</TableCell>
              <TableCell align="right">{item.max_quantity}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => modifyQuantity(item.inventory_id, 1)}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => modifyQuantity(item.inventory_id, -1)}>
                  <RemoveIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryManagement;
