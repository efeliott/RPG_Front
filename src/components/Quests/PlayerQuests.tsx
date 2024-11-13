import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axiosInstance from '../../api/axios';

interface Quest {
  quest_id: number;
  title: string;
  description: string;
  reward: number;
  is_finished: boolean;
  character_id: number | null; // Ajout pour suivre le personnage ayant accepté la quête
}

const PlayerQuests: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [characterId, setCharacterId] = useState<number | null>(null);

  useEffect(() => {
    // Récupérer l'ID du character du joueur
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

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await axiosInstance.get(`/player/${sessionId}/quests/${characterId}`);
        setQuests(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des quêtes:", error);
      }
    };

    fetchQuests();
  }, [sessionId]);

  const handleAcceptQuest = async (questId: number) => {
    if (!characterId) {
      console.error("Character ID non trouvé");
      return;
    }

    try {
      const response = await axiosInstance.post(`/player/${sessionId}/quests/${questId}/accept/${characterId}`);
      console.log(response.data.message);

      // Mettre à jour l'état des quêtes pour indiquer que la quête a été acceptée
      setQuests((prevQuests) =>
        prevQuests.map((quest) =>
          quest.quest_id === questId ? { ...quest, character_id: characterId } : quest
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la quête:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Quêtes</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Récompense</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quests.map((quest) => (
              <TableRow key={quest.quest_id}>
                <TableCell>{quest.title}</TableCell>
                <TableCell>{quest.description}</TableCell>
                <TableCell>{quest.reward} pièces</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    disabled={quest.character_id === characterId}
                    onClick={() => handleAcceptQuest(quest.quest_id)}
                  >
                    {quest.character_id === characterId ? "Acceptée" : "Accepter"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PlayerQuests;