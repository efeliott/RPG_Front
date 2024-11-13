import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import axiosInstance from '../../api/axios';

interface Item {
  item_id: number;
  title: string;
  description: string;
  img_url: string;
}

interface InventoryItem {
  inventory_id: number;
  item_id: number;
  max_quantity: number;
  item: Item;
}

const PlayerInventory: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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
    const fetchInventory = async () => {
      if (!characterId) return;

      try {
        const response = await axiosInstance.get(`/player/${sessionId}/inventory/${characterId}`);
        setInventory(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'inventaire:", error);
      }
    };

    fetchInventory();
  }, [sessionId, characterId]);

  const handleOpenDialog = (item: Item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenDialog(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Inventaire</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de l'Item</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((invItem) => (
              <TableRow key={invItem.inventory_id}>
                <TableCell>{invItem.item.title}</TableCell>
                <TableCell>{invItem.max_quantity}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" onClick={() => handleOpenDialog(invItem.item)}>
                    Voir Détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Détails de l'Item</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Typography variant="h5">{selectedItem.title}</Typography>
              <Typography variant="body1" gutterBottom>{selectedItem.description}</Typography>
              {selectedItem.img_url && (
                <img
                  src={selectedItem.img_url}
                  alt={selectedItem.title}
                  style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlayerInventory;