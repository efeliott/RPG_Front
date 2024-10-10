// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  // Charger le token depuis les cookies lors du montage initial du composant
  useEffect(() => {
    const savedToken = Cookies.get('authToken');
    if (savedToken) {
      setTokenState(savedToken);
    }
  }, []);

  // Fonction pour mettre à jour le token dans le contexte et les cookies
  const setToken = (newToken: string | null) => {
    if (newToken) {
      Cookies.set('authToken', newToken, { expires: 15 }); // 15 jours d'expiration
    } else {
      Cookies.remove('authToken');
    }
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};