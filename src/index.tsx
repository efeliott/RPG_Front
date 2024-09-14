// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
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