import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

interface CreateSessionModalProps {
  open: boolean;
  handleClose: () => void;
  setSessions: React.Dispatch<React.SetStateAction<any[]>>;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ open, handleClose, setSessions }) => {
  const { token } = useAuth();
  const [newSessionTitle, setNewSessionTitle] = useState<string>('');
  const [newSessionDescription, setNewSessionDescription] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleCreateSession = async () => {
    if (!newSessionTitle) {
      setSnackbarMessage('Le titre de la session est obligatoire.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axiosInstance.post(
        '/sessions',
        {
          title: newSessionTitle,
          description: newSessionDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions((prevSessions) => [...prevSessions, response.data.session]);

      setSnackbarMessage('Session créée avec succès!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setNewSessionTitle('');
      setNewSessionDescription('');
      handleClose();

    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      setSnackbarMessage('Erreur lors de la création de la session.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="modal-title">Créer une nouvelle session</h2>
          <TextField
            label="Titre de la session"
            variant="outlined"
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            inputProps={{ 'data-testid': 'session-title-input' }} // Ajout de data-testid
          />
          <TextField
            label="Description de la session (optionnelle)"
            variant="outlined"
            value={newSessionDescription}
            onChange={(e) => setNewSessionDescription(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            inputProps={{ 'data-testid': 'session-description-input' }} // Ajout de data-testid
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateSession}
            data-testid="create-session-button" // Ajout de data-testid
          >
            Créer la session
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateSessionModal;