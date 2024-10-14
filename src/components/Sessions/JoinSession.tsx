import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Typography from '@mui/material/Typography';

const SessionJoin = () => {
  const { sessionToken } = useParams<{ sessionToken: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const joinSession = async () => {
      if (!token) {
        // Si pas connecté, rediriger vers la page de connexion
        navigate(`/signin?redirect=/join-session/${sessionToken}`);
        return;
      }

      try {
        // Envoyer une requête pour rejoindre la session
        await axiosInstance.post(
          '/join-session',
          { session_token: sessionToken }, // Envoyer le token d'invitation
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate('/dashboard'); // Rediriger après succès
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

export default SessionJoin;