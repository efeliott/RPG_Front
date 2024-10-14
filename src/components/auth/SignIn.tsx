import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Ajout de useLocation pour gérer la redirection
import { useAuth } from '../../context/AuthContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');  
  const [password, setPassword] = useState<string>('');  
  const [errorMessage, setErrorMessage] = useState<string>(''); 
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Utilisation de useLocation pour vérifier s'il y a une URL de redirection

  // Gestion de la connexion
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axiosInstance.post('/login', { email, password });
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);

        // Vérification de la redirection après connexion
        const redirectTo = new URLSearchParams(location.search).get('redirect') || '/dashboard'; // Redirige vers la page dashboard ou une autre
        navigate(redirectTo); // Redirection vers la page cible après connexion
      } else {
        setErrorMessage("Erreur: Le token d'authentification est introuvable.");
      }
    } catch (error) {
      console.error('Erreur de connexion', error);
      setErrorMessage('Erreur: Connexion échouée. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Se connecter
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          {errorMessage && (
            <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Se connecter
          </Button>
          <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Pas de compte ? Inscrivez-vous"}
                </Link>
              </Grid>
            </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;