// src/context/PlayerSessionContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';

interface Character {
  character_id: number;
  session_id: number;
  user_id: number;
  name: string;
  class: string;
  abilities: string;
}

interface PlayerSessionContextProps {
  character: Character | null;
  loadCharacter: (sessionId: number) => void;
}

const PlayerSessionContext = createContext<PlayerSessionContextProps | undefined>(undefined);

export const PlayerSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character | null>(null);

  const loadCharacter = useCallback(async (sessionId: number) => {
    try {
      const response = await axiosInstance.get(`/player/${sessionId}/character`);
      setCharacter(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données du personnage:", error);
    }
  }, []);

  return (
    <PlayerSessionContext.Provider value={{ character, loadCharacter }}>
      {children}
    </PlayerSessionContext.Provider>
  );
};

export const usePlayerSession = () => {
  const context = useContext(PlayerSessionContext);
  if (context === undefined) {
    throw new Error("usePlayerSession must be used within a PlayerSessionProvider");
  }
  return context;
};