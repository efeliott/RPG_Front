import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { SessionData } from '../../types';

interface SessionsDataGridProps {
  sessions: SessionData[];
  loading: boolean;
  title: string;
  setSessions: React.Dispatch<React.SetStateAction<SessionData[]>>;
}

const columns: GridColDef[] = [
  { field: 'session_id', headerName: 'ID', width: 90 },
  { field: 'session_name', headerName: 'Name', width: 150 },
  { field: 'session_date', headerName: 'Date', width: 150 },
];

const SessionsDataGrid: React.FC<SessionsDataGridProps> = ({ sessions, loading, title, setSessions }) => {
  const { token } = useAuth();
  const [selectedSessions, setSelectedSessions] = React.useState<number[]>([]);
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

  const handleSelectionChange = (newSelection: any) => {
    setSelectedSessions(newSelection);
  };

  const handleDeleteSessions = async () => {
    if (!token) {
      console.error('Token manquant');
      return;
    }

    try {
      const remainingSessions = [...sessions];

      for (const sessionId of selectedSessions) {
        const session = sessions.find(s => s.session_id === sessionId);
        if (session && session.token) {
          await axiosInstance.delete(`/sessions/${session.token}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const index = remainingSessions.findIndex(s => s.session_id === sessionId);
          if (index > -1) remainingSessions.splice(index, 1);
        } else {
          console.error("Token de session manquant pour l'ID :", sessionId);
        }
      }

      setSessions(remainingSessions);
      setSnackbarMessage('Sessions supprimées avec succès.');
      setAlertSeverity('success');
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Erreur lors de la suppression des sessions:', error);
      setSnackbarMessage('Erreur lors de la suppression des sessions.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h2>{title}</h2>
      <Box sx={{ height: 400, width: '100%', marginBottom: 4 }}>
        <DataGrid
          rows={sessions}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.session_id}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
        />
      </Box>

      {selectedSessions.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSessions}
          sx={{ marginTop: 2 }}
        >
          Supprimer les sessions sélectionnées
        </Button>
      )}

      {/* Snackbar pour retour d'information à l'utilisateur */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SessionsDataGrid;