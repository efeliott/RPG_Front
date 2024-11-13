import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axiosInstance from '../../api/axios';

interface ShopItem {
  item_id: number;
  title: string;
  description: string;
  price: number;
}

const PlayerShop: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [characterId, setCharacterId] = useState<number | null>(null); // Ajout de characterId
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // Récupération de l'ID du character
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

  // Récupération des items du magasin
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await axiosInstance.get(`/player/${sessionId}/shop`);
        setShopItems(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles du magasin:", error);
      }
    };

    fetchShopItems();
  }, [sessionId]);

  const handleOpenDialog = (item: ShopItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setQuantity(1);
    setOpenDialog(false);
  };

  const handlePurchase = async () => {
    if (!selectedItem || !characterId) return;

    try {
      const response = await axiosInstance.post(`/player/shop/${sessionId}/purchase/${selectedItem.item_id}/${characterId}`, {
        quantity,
      });
      
      console.log(response.data.message);
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de l'achat de l'item:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Magasin</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de l'Item</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopItems.map((item) => (
              <TableRow key={item.item_id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" onClick={() => handleOpenDialog(item)}>
                    Acheter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour confirmer l'achat */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer l'achat</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <DialogContentText>
                Voulez-vous acheter <strong>{selectedItem.title}</strong> pour <strong>{selectedItem.price}</strong> par unité ?
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Quantité"
                type="number"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handlePurchase} color="primary">
            Confirmer l'achat
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlayerShop;