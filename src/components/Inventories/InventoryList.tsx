import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Typography, FormControl, IconButton } from '@mui/material';
import axiosInstance from '../../api/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import './InventoryList.css';

interface Character {
  character_id: number;
  name: string;
  class: string;
}

interface Item {
  item_id: number;
  title: string;
  description: string;
}

interface InventoryItem {
  inventory_id: number;
  item_id: number;
  max_quantity: number;
  item: Item;
}

const InventoryList: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateItemDialog, setOpenCreateItemDialog] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [newItem, setNewItem] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axiosInstance.get(`/session-management/${sessionId}/characters`);
        setCharacters(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des personnages:", error);
      }
    };

    const fetchAvailableItems = async () => {
      try {
        const response = await axiosInstance.get(`/items`);
        setAvailableItems(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des items:", error);
      }
    };

    fetchCharacters();
    fetchAvailableItems();
  }, [sessionId]);

  const handleOpenDialog = (character: Character) => {
    setSelectedCharacter(character);
    fetchInventory(character.character_id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCharacter(null);
    setInventoryItems([]);
  };

  const fetchInventory = async (characterId: number) => {
    try {
      const response = await axiosInstance.get(`/characters/${characterId}/inventory`);
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'inventaire:", error);
    }
  };

  const handleAddItem = async () => {
    if (!selectedCharacter || !selectedItem) return;

    try {
      await axiosInstance.post(`/session-management/characters/${selectedCharacter.character_id}/inventory`, {
        item_id: selectedItem,
        max_quantity: quantity,
      });
      fetchInventory(selectedCharacter.character_id);
      setSelectedItem(null);
      setQuantity(1);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'item à l'inventaire:", error);
    }
  };

  const handleUpdateQuantity = async (inventoryId: number, newQuantity: number) => {
    try {
      await axiosInstance.put(`/inventory/${inventoryId}`, {
        max_quantity: newQuantity,
      });
      fetchInventory(selectedCharacter?.character_id!);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
    }
  };

  const handleDeleteItem = async (inventoryId: number) => {
    try {
      await axiosInstance.delete(`/inventory/${inventoryId}`);
      fetchInventory(selectedCharacter?.character_id!);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'item:", error);
    }
  };

  const handleOpenCreateItemDialog = () => setOpenCreateItemDialog(true);
  const handleCloseCreateItemDialog = () => setOpenCreateItemDialog(false);

  const handleCreateItem = async () => {
    try {
      const response = await axiosInstance.post('/items', newItem);
      setAvailableItems((prevItems) => [...prevItems, response.data]);
      handleCloseCreateItemDialog();
      setNewItem({ title: '', description: '' });
    } catch (error) {
      console.error("Erreur lors de la création de l'item:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Inventaires des personnages</Typography>
      <Button variant="contained" color="primary" onClick={handleOpenCreateItemDialog} sx={{ mb: 2 }}>
        Créer un Item
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du Personnage</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {characters.map((character) => (
              <TableRow key={character.character_id}>
                <TableCell>{character.name}</TableCell>
                <TableCell>{character.class}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleOpenDialog(character)}>
                    Gérer l'inventaire
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour gérer l'inventaire */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Inventaire de {selectedCharacter?.name}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom de l'Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryItems.map((invItem) => (
                  <TableRow key={invItem.inventory_id}>
                    <TableCell>{invItem.item.title}</TableCell>
                    <TableCell>{invItem.item.description}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invItem.max_quantity}
                        onChange={(e) => handleUpdateQuantity(invItem.inventory_id, Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDeleteItem(invItem.inventory_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            <Button className='btn-cr-item' variant="contained" color="primary" onClick={handleOpenCreateItemDialog} sx={{ mb: 2 }}>
                Créer un Item
            </Button>
          <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>Ajouter un Item</Typography>
          <FormControl fullWidth margin="normal">
            <Select
              value={selectedItem || ''}
              onChange={(e) => setSelectedItem(Number(e.target.value))}
              displayEmpty
            >
              <MenuItem value="" disabled>Choisir un item</MenuItem>
              {availableItems.map((item) => (
                <MenuItem key={item.item_id} value={item.item_id}>{item.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantité"
            type="number"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Ajouter l'Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour créer un nouvel item */}
      <Dialog open={openCreateItemDialog} onClose={handleCloseCreateItemDialog} fullWidth>
        <DialogTitle>Créer un Nouvel Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de l'item"
            fullWidth
            margin="normal"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateItemDialog}>Annuler</Button>
          <Button onClick={handleCreateItem} variant="contained" color="primary">
            Créer l'Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InventoryList;