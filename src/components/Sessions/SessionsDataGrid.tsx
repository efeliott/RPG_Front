// src/components/Sessions/SessionsDataGrid.tsx

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

interface SessionData {
  session_id: number;
  title: string;
  description: string;
  token: string;
}

interface SessionsDataGridProps {
  sessions: SessionData[];
  loading: boolean;
  title: string;
}

const SessionsDataGrid: React.FC<SessionsDataGridProps> = ({ sessions, loading, title }) => {
  const navigate = useNavigate();

  const handleNavigate = (session: SessionData) => {
    navigate(`/session/manage/${session.token}`, { state: { session } });
  };

  const columns: GridColDef[] = [
    { field: 'session_id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Titre', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'manage',
      headerName: 'Manage',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNavigate(params.row as SessionData)}
        >
          Gérer
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <h2>{title}</h2>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={sessions}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.session_id}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default SessionsDataGrid;