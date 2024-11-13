import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_game-master_blue.svg';
import { useAuth } from '../context/AuthContext';

const demoTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const DashboardLayoutBasic: React.FC = () => {
  const { user } = useAuth();
  const [pathname, setPathname] = React.useState('/dashboard');
  const navigate = useNavigate();

  const NAVIGATION = [
    {
      kind: 'page' as const,
      title: user ? `Bonjour, ${user.name}` : 'Main items',
    },
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <HomeIcon />,
    },
    {
      segment: 'account',
      title: 'Mon compte',
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

  const router = {
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path: string | URL) => {
      setPathname(path.toString());
      navigate(path.toString());
    },
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src={logo} alt="Game master logo" />,
        title: 'RPG',
      }}
    >
      <DashboardLayout>
        <div style={{ top: '6rem' }} />
      </DashboardLayout>
    </AppProvider>
  );
};

export default DashboardLayoutBasic;