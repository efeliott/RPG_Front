// src/components/Sessions/JoinSession.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const JoinSession: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Récupération du token d'invitation depuis l'URL
  const { isAuthenticated, token: authToken } = useAuth(); // Vérifie si l'utilisateur est authentifié et récupère le token d'authentification
  const [message, setMessage] = useState<string>(''); // Message pour l'utilisateur
  const navigate = useNavigate(); // Permet de rediriger après succès ou échec

  useEffect(() => {
    const joinSession = async () => {
      if (!isAuthenticated) {
        setMessage('Vous devez être connecté pour rejoindre une session.');
        return;
      }

      try {
        // Appel à l'API Laravel pour rejoindre la session
        const response = await axiosInstance.post(
          '/join-session',
          { session_token: token },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        if (response.data && response.status === 200) {
          setMessage('Vous avez rejoint la session avec succès !');
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          setMessage('Erreur lors de la tentative de rejoindre la session.');
        }
      } catch (error) {
        setMessage('Le lien est invalide ou a déjà été utilisé.');
        console.error('Erreur lors de la tentative de rejoindre la session:', error);
      }
    };

    joinSession();
  }, [isAuthenticated, token, authToken, navigate]);

  return (
    <div>
      <h1>Rejoindre une Session</h1>
      <p>{message}</p>
    </div>
  );
};

export default JoinSession;