import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import axiosInstance from '../../api/axios';
import AddCharacter from './AddCharacter';

interface Character {
  character_id: number;
  name: string;
  class: string;
  abilities: string;
}

const CharacterList: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Fonction pour récupérer la liste des personnages
  const fetchCharacters = async () => {
    try {
      const response = await axiosInstance.get(`/session-management/${sessionId}/characters`);
      setCharacters(response.data);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [sessionId]);

  // Gestion de l'ouverture et de la fermeture du dialogue d'ajout de personnage
  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);

  // Fonction appelée après l'ajout d'un personnage pour rafraîchir la liste
  const handleCharacterAdded = () => {
    fetchCharacters();
    handleCloseAddDialog();
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ mb: 2 }}>
        Add Character
      </Button>
      <AddCharacter
        sessionId={sessionId}
        userId={1} // Remplacez par l'ID de l'utilisateur auquel vous voulez ajouter un personnage
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onCharacterAdded={handleCharacterAdded}
      />
      <Grid container spacing={2}>
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.character_id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{character.name}</Typography>
                <Typography variant="subtitle1">{character.class}</Typography>
                <Typography variant="body2">{character.abilities}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CharacterList;