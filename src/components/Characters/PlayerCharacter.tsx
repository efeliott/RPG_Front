// src/components/Characters/PlayerCharacter.tsx

import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import axiosInstance from '../../api/axios';

interface Character {
  character_id: number;
  name: string;
  class: string;
  abilities: string;
}

const PlayerCharacter: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axiosInstance.get(`/player/${sessionId}/character`);
        setCharacter(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations du personnage:", error);
      }
    };

    fetchCharacter();
  }, [sessionId]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Personnage</Typography>
      {character ? (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow><TableCell>Nom</TableCell><TableCell>{character.name}</TableCell></TableRow>
              <TableRow><TableCell>Classe</TableCell><TableCell>{character.class}</TableCell></TableRow>
              <TableRow><TableCell>Compétences</TableCell><TableCell>{character.abilities}</TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Chargement...</Typography>
      )}
    </div>
  );
};

export default PlayerCharacter;
