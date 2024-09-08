import React, { useState } from 'react';
import axiosInstance from '../../api/axios'; // Assurez-vous que cette instance Axios est configurée correctement pour appeler votre API
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Utiliser le contexte Auth pour stocker le token
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');  // Stocke l'email
  const [password, setPassword] = useState<string>('');  // Stocke le mot de passe
  const [errorMessage, setErrorMessage] = useState<string>(''); // Message d'erreur potentiel
  const { setToken } = useAuth();  // Utiliser le contexte pour stocker le token
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');  // Réinitialise les erreurs avant de lancer une nouvelle tentative de connexion
    console.log("Login triggered");

    try {
      // Appel à l'API pour authentification
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      // Vérifie si l'API renvoie bien un token
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);  // Stocker le token dans le contexte
        navigate('/dashboard');  // Rediriger vers le tableau de bord
      } else {
        setErrorMessage('Erreur: Le token d\'authentification est introuvable');
      }
    } catch (error) {
      console.error('Erreur de connexion', error);
      setErrorMessage('Erreur: Connexion échouée. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
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
    </ThemeProvider>
  );
};

export default SignIn;
