// src/index.tsx

import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/auth/AuthForm.css';
import './styles/pages/AuthPage.css';
import './styles/pages/Dashboard.css';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);