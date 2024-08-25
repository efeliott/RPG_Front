// src/components/pages/Dashboard.tsx

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import axiosInstance from '../../api/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionData {
  id: number;
  title: string;
  description: string;
  token: string;
}

export default function GameMasterSessionsDataGrid() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get('/user-sessions');
        setSessions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des sessions:', error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleNavigate = (session: SessionData) => {
    navigate(`/session/manage/${session.token}`, { state: { session } });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Titre', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'manage',
      headerName: 'Manage',
      width: 150,
      renderCell: (params: GridRowParams) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNavigate(params.row as SessionData)}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={sessions}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
