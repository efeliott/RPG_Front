import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SessionData } from '../../types';

interface SessionsDataGridProps {
  sessions: SessionData[];
  loading: boolean;
  title: string;
  setSessions?: React.Dispatch<React.SetStateAction<SessionData[]>>;
}

const SessionsDataGrid: React.FC<SessionsDataGridProps> = ({ sessions, loading, title, setSessions }) => {
  const { token } = useAuth(); // Récupère le token d'authentification depuis le contexte
  const navigate = useNavigate(); // Pour la navigation vers la page de gestion de la session
  const [selectedSessions, setSelectedSessions] = React.useState<number[]>([]); // Garde les sessions sélectionnées

  // Colonnes du tableau
  const columns: GridColDef[] = [
    { field: 'session_id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Titre', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'manage',
      headerName: 'Gérer',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/session/manage/${params.row.token}`)} // Navigue vers la page de gestion avec le token
        >
          Gérer
        </Button>
      ),
    },
  ];

  // Gestion de la sélection multiple
  const handleSelectionChange = (newSelection: any) => {
    setSelectedSessions(newSelection); // Met à jour la liste des sessions sélectionnées
  };

  // Suppression des sessions sélectionnées
  const handleDeleteSessions = async () => {
    if (!token || !setSessions) {
      console.error('Token manquant ou setSessions non fourni');
      return;
    }

    try {
      // Suppression des sessions sélectionnées via leur token
      for (const sessionId of selectedSessions) {
        const session = sessions.find(s => s.session_id === sessionId);
        if (session && session.token) {
          await axiosInstance.delete(`/sessions/${session.token}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          console.error("Token de session manquant pour l'ID :", sessionId);
        }
      }

      // Mettre à jour la liste des sessions après suppression
      setSessions(prevSessions => prevSessions.filter(session => !selectedSessions.includes(session.session_id)));

      // Réinitialiser la sélection après suppression
      setSelectedSessions([]);

    } catch (error) {
      console.error('Erreur lors de la suppression des sessions:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h2>{title}</h2>
      <Box sx={{ height: 400, width: '100%', marginBottom: 4 }}>
        <DataGrid
          rows={sessions} // Les données des sessions
          columns={columns} // Les colonnes du DataGrid
          loading={loading} // Affiche un état de chargement si nécessaire
          getRowId={(row) => row.session_id} // Utilise l'ID de session comme identifiant de ligne unique
          pageSizeOptions={[5, 10, 20]} // Options de pagination
          checkboxSelection // Active la sélection multiple
          disableRowSelectionOnClick // Désactive la sélection via un clic sur une ligne
          onRowSelectionModelChange={handleSelectionChange} // Gère la sélection multiple
        />
      </Box>

      {/* Affiche le bouton de suppression uniquement s'il y a des sessions sélectionnées */}
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
    </Box>
  );
};

export default SessionsDataGrid;