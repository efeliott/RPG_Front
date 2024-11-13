// src/components/SessionsManagement/ShopManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axiosInstance from '../../api/axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ShopItem {
  item_id: number;
  price: number;
  item: {
    title: string;
    description: string;
    img_url: string;
  };
}

const ShopManagement: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [price, setPrice] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await axiosInstance.get(`/session-management/${sessionId}/shop/items`);
        setShopItems(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des items du shop:', error);
      }
    };
    fetchShopItems();
  }, [sessionId]);

  const handleAddOrUpdateItem = async () => {
    setError('');
    if (!title || !description || !price) {
      setError('Title, description, and price are required.');
      return;
    }

    try {
      if (editMode && editItemId !== null) {
        await axiosInstance.put(`/session-management/${sessionId}/shop/items/${editItemId}`, {
          title,
          description,
          img_url: imgUrl,
          price: parseFloat(price),
        });
      } else {
        await axiosInstance.post(`/session-management/${sessionId}/shop/add-item`, {
          title,
          description,
          img_url: imgUrl,
          price: parseFloat(price),
        });
      }
      // Reset form fields
      setTitle('');
      setDescription('');
      setImgUrl('');
      setPrice('');
      setEditMode(false);
      setEditItemId(null);
      setDialogOpen(false);

      const response = await axiosInstance.get(`/session-management/${sessionId}/shop/items`);
      setShopItems(response.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout ou modification de l\'item:', err);
      setError('Failed to add or update item. Please try again.');
    }
  };

  const handleEdit = (item: ShopItem) => {
    setEditMode(true);
    setEditItemId(item.item_id);
    setTitle(item.item.title);
    setDescription(item.item.description);
    setImgUrl(item.item.img_url);
    setPrice(item.price.toString());
    setDialogOpen(true);
  };

  const handleDelete = async (itemId: number) => {
    try {
      await axiosInstance.delete(`/session-management/${sessionId}/shop/items/${itemId}`);
      setShopItems((prevItems) => prevItems.filter((item) => item.item_id !== itemId));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setEditItemId(null);
    setTitle('');
    setDescription('');
    setImgUrl('');
    setPrice('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Gestion des items du Shop</Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Ajouter un nouvel item
      </Button>
      {error && <Typography color="error">{error}</Typography>}

      {/* Dialog pour ajouter ou modifier un item */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{editMode ? 'Modifier l\'item' : 'Ajouter un nouvel item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {/* <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          /> */}
          <TextField
            label="Prix"
            fullWidth
            margin="normal"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddOrUpdateItem} variant="contained" color="primary">
            {editMode ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Items dans le Shop</Typography>
      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              {/* <TableCell>Image</TableCell> */}
              <TableCell align="right">Prix</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopItems.map((shopItem) => (
              <TableRow key={shopItem.item_id}>
                <TableCell>{shopItem.item.title}</TableCell>
                <TableCell>{shopItem.item.description}</TableCell>
                {/* <TableCell>
                  {shopItem.item.img_url && (
                    <img src={shopItem.item.img_url} alt={shopItem.item.title} style={{ width: '50px' }} />
                  )}
                </TableCell> */}
                <TableCell align="right">{shopItem.price}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(shopItem)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(shopItem.item_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ShopManagement;
