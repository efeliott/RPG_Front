// src/components/layout/ProtectedLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayoutBasic from '../Sidebar';

const ProtectedLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', marginTop: '5rem',}}>
      <DashboardLayoutBasic />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;