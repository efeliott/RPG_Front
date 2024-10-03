// src/components/pages/SessionManage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

interface UserData {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface SessionData {
  session_id: number;
  game_master_id: number;
  title: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  token: string;
  users: UserData[];
}

export default function SessionManage() {
  const { sessionToken } = useParams<{ sessionToken: string }>();
  const { token } = useAuth();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRemoveUser = async (userId: number) => {
    if (!token) return;

    try {
      await axiosInstance.delete(`/sessions/${sessionToken}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSessionData((prevData) => ({
        ...prevData!,
        users: prevData!.users.filter((user) => user.id !== userId),
      }));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  };

  const handleDeleteSession = async () => {
    if (!token) return;

    try {
      await axiosInstance.delete(`/sessions/${sessionToken}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Redirection après la suppression
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur lors de la suppression de la session:', err);
      setDeleteError('Une erreur est survenue lors de la suppression de la session.');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'created_at', headerName: 'Created At', width: 180 },
    { field: 'updated_at', headerName: 'Updated At', width: 180 },
    {
      field: 'remove',
      headerName: 'Supprimer',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRemoveUser(params.row.id)}
        >
          Supprimer
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchSessionDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get(`/sessions/${sessionToken}`);
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la session:', err);
        setError('Une erreur est survenue lors de la récupération des données de la session.');
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionToken, token]);

  if (loading) {
    return <Typography>Chargement des détails de la session...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!sessionData) {
    return <Typography>Aucune session trouvée.</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion de la session : {sessionData.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Description : {sessionData.description}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Créée le : {new Date(sessionData.created_at).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Dernière mise à jour : {new Date(sessionData.updated_at).toLocaleDateString()}
      </Typography>

      {deleteError && <Alert severity="error">{deleteError}</Alert>}

      {/* Bouton pour supprimer la session */}
      <Button
        variant="contained"
        color="error"
        sx={{ marginTop: 2, marginBottom: 2 }}
        onClick={handleDeleteSession}
      >
        Supprimer la session
      </Button>

      <Box sx={{ height: 400, width: '100%', marginTop: 4 }}>
        <Typography variant="h6">Utilisateurs dans la session</Typography>
        <DataGrid
          rows={sessionData.users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          getRowId={(row) => row.id}
          checkboxSelection
        />
      </Box>
    </Box>
  );
}
