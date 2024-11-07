// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  role: string; // Ajoute 'role' pour déterminer si l'utilisateur est Game Master
}

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  user: User | null; // Ajoute 'user' pour stocker les informations de l'utilisateur
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = Cookies.get('authToken');
    if (savedToken) {
      setTokenState(savedToken);
      setIsAuthenticated(true);
      fetchUserData(savedToken); // Charge les informations utilisateur
    }
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      Cookies.set('authToken', newToken, { expires: 15 });
      setIsAuthenticated(true);
      fetchUserData(newToken); // Charge les informations utilisateur lorsque le token est défini
    } else {
      Cookies.remove('authToken');
      setIsAuthenticated(false);
      setUser(null); // Réinitialise 'user' si le token est supprimé
    }
    setTokenState(newToken);
  };

  const fetchUserData = async (token: string) => {
    try {
        const response = await fetch('http://localhost:8000/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données de l'utilisateur");
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const userData = await response.json();
            setUser(userData);
        } else {
            throw new Error("La réponse n'est pas au format JSON");
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
};


  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};