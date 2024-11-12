import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import axiosInstance from '../../api/axios';

interface Character {
  character_id: number;
  name: string;
  class: string;
  abilities: string;
  user_id: number;
}

interface User {
  id: number;
  username: string;
}

const CharacterList: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCharacter, setEditCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    abilities: '',
    user_id: '',
  });

  // Récupère les personnages pour une session
  const fetchCharacters = async () => {
    try {
      const response = await axiosInstance.get(`/session-management/${sessionId}/characters`);
      setCharacters(response.data);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  // Récupère les utilisateurs sans personnage pour cette session
  const fetchUsersWithoutCharacter = async () => {
    try {
      const response = await axiosInstance.get(`/session-management/sessions/${sessionId}/users-without-character`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchCharacters();
    fetchUsersWithoutCharacter();
  }, [sessionId]);

  const handleOpenDialog = (character?: Character) => {
    setEditCharacter(character || null);
    setFormData(character ? {
      name: character.name,
      class: character.class,
      abilities: character.abilities,
      user_id: character.user_id.toString(),
    } : { name: '', class: '', abilities: '', user_id: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveCharacter = async () => {
    const { name, class: charClass, abilities, user_id } = formData;

    try {
      if (editCharacter) {
        await axiosInstance.put(`/session-management/character/${editCharacter.character_id}`, { name, class: charClass, abilities });
      } else {
        await axiosInstance.post(`/session-management/${sessionId}/character`, {
          name,
          class: charClass,
          abilities,
          user_id: Number(user_id),
        });
      }
      fetchCharacters();
      fetchUsersWithoutCharacter();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving character:", error);
    }
  };

  const handleDeleteCharacter = async (characterId: number) => {
    try {
      await axiosInstance.delete(`/session-management/character/${characterId}`);
      fetchCharacters();
      fetchUsersWithoutCharacter();
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target as HTMLInputElement | { name?: string; value: unknown };
    setFormData({ ...formData, [name as string]: value });
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Ajouter un personnage
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editCharacter ? "Modifier le personnage" : "Ajouter un personnage"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Classe"
            name="class"
            fullWidth
            margin="normal"
            value={formData.class}
            onChange={handleChange}
          />
          <TextField
            label="Compétences"
            name="abilities"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.abilities}
            onChange={handleChange}
          />
          {!editCharacter && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="user-select-label">Sélectionner un utilisateur</InputLabel>
              <Select
                labelId="user-select-label"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                label="Sélectionner un utilisateur"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveCharacter} variant="contained" color="primary">
            {editCharacter ? "Sauvegarder" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.character_id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{character.name}</Typography>
                <Typography variant="subtitle1">{character.class}</Typography>
                <Typography variant="body2">{character.abilities}</Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(character)}
                    style={{ marginRight: 8 }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteCharacter(character.character_id)}
                  >
                    Supprimer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CharacterList;