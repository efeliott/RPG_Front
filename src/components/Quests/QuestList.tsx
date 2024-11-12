// src/components/Quests/QuestList.tsx

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
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import axiosInstance from '../../api/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Quest {
  quest_id: number;
  title: string;
  description: string;
  reward: number;
  is_finished: boolean;
}

const QuestList: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editQuestId, setEditQuestId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Fetches quests for the session on component mount
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await axiosInstance.get(`/quests/${sessionId}/quests`);
        setQuests(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des quêtes:", error);
      }
    };
    fetchQuests();
  }, [sessionId]);

  // Handles adding or updating a quest
  const handleAddOrUpdateQuest = async () => {
    setError('');
    if (!title || !description || reward === '') {
      setError('Title, description, and reward are required.');
      return;
    }

    try {
      const questData = {
        title,
        description,
        reward: parseInt(reward, 10), // Convert to integer for consistency with backend
        session_id: sessionId,
      };

      if (editMode && editQuestId !== null) {
        await axiosInstance.put(`/quests/${editQuestId}`, questData);
      } else {
        await axiosInstance.post(`/quests`, questData);
      }

      // Clear form fields and close dialog
      setTitle('');
      setDescription('');
      setReward('');
      setEditMode(false);
      setEditQuestId(null);
      setDialogOpen(false);

      // Refresh quest list after update
      const response = await axiosInstance.get(`/quests/${sessionId}/quests`);
      setQuests(response.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout ou modification de la quête:', err);
      setError('Failed to add or update quest. Please try again.');
    }
  };

  // Opens dialog to edit a quest
  const handleEditQuest = (quest: Quest) => {
    setEditMode(true);
    setEditQuestId(quest.quest_id);
    setTitle(quest.title);
    setDescription(quest.description);
    setReward(quest.reward.toString());
    setDialogOpen(true);
  };

  // Deletes a quest and updates state
  const handleDeleteQuest = async (questId: number) => {
    try {
      await axiosInstance.delete(`/quests/${questId}`);
      setQuests((prev) => prev.filter((quest) => quest.quest_id !== questId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la quête:', err);
      setError('Failed to delete quest. Please try again.');
    }
  };

  // Opens dialog for adding a new quest
  const handleOpenDialog = () => {
    setEditMode(false);
    setEditQuestId(null);
    setTitle('');
    setDescription('');
    setReward('');
    setDialogOpen(true);
  };

  // Closes the dialog without saving changes
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Gestion des Quêtes</Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Ajouter une nouvelle quête
      </Button>
      {error && <Typography color="error">{error}</Typography>}

      {/* Dialog for adding or editing a quest */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{editMode ? 'Modifier la quête' : 'Ajouter une nouvelle quête'}</DialogTitle>
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
            multiline
            rows={3}
          />
          <TextField
            label="Récompense"
            fullWidth
            margin="normal"
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddOrUpdateQuest} variant="contained" color="primary">
            {editMode ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Liste des Quêtes</Typography>
      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Récompense</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quests.map((quest) => (
              <TableRow key={quest.quest_id}>
                <TableCell>{quest.title}</TableCell>
                <TableCell>{quest.description}</TableCell>
                <TableCell align="right">{quest.reward}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEditQuest(quest)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteQuest(quest.quest_id)}>
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

export default QuestList;
