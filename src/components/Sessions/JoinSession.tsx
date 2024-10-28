import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Typography from '@mui/material/Typography';

const JoinSession = () => {
  const { sessionToken } = useParams<{ sessionToken: string }>(); // Récupération du token de l'URL
  const { token } = useAuth(); // Récupération du token utilisateur pour l'authentification
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const joinSession = async () => {
      if (!sessionToken) {
        setError("Token d'invitation invalide.");
        setLoading(false);
        return;
      }

      // Vérifie si l'utilisateur est connecté, sinon, redirection vers la page de connexion
      if (!token) {
        navigate(`/signin?redirect=/join-session/${sessionToken}`);
        return;
      }

      try {
        // Requête pour rejoindre la session
        await axiosInstance.post(
          '/join-session',
          { session_token: sessionToken }, // Le token d'invitation à la session
          {
            headers: {
              Authorization: `Bearer ${token}`, // Authentification de l'utilisateur
            },
          }
        );
        // Redirection vers le tableau de bord après succès
        navigate('/dashboard');
      } catch (err) {
        setError("Erreur lors de la tentative de rejoindre la session.");
        setLoading(false);
      }
    };

    joinSession();
  }, [sessionToken, token, navigate]);

  if (loading) {
    return <Typography>Chargement en cours...</Typography>;
  }

  return (
    <div>
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default JoinSession;
