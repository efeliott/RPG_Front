//import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

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
  const { sessionToken } = useParams<{ sessionToken: string }>(); // Token de session depuis l'URL
  const { token } = useAuth(); // Token d'authentification
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour supprimer un utilisateur de la session
  const handleRemoveUser = async (userId: number) => {
    if (!token) return;

    try {
      // Appel API pour retirer l'utilisateur de la session
      await axiosInstance.delete(`/sessions/${sessionToken}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Met à jour les utilisateurs après suppression
      setSessionData((prevData) => ({
        ...prevData!,
        users: prevData!.users.filter((user) => user.id !== userId),
      }));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  };

  // Colonnes de la DataGrid
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
