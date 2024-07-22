// ./src/components/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return token ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
