import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate

const NAVIGATION = [
  {
    kind: 'page' as const,
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
      },
      {
        segment: 'traffic',
        title: 'Traffic',
      },
    ],
  },
];

const demoTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const DashboardLayoutBasic: React.FC = () => {
  const [pathname, setPathname] = React.useState('/dashboard');
  const navigate = useNavigate(); 

  const router = {
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path: string | URL) => {
      setPathname(path.toString());
      navigate(path.toString());
    },
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout>
        <div
          style={{
            top: '6rem ',
          }}
        />
      </DashboardLayout>
    </AppProvider>
  );
};

export default DashboardLayoutBasic;