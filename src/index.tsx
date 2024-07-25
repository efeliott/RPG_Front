// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import './styles/auth/AuthForm.css';
import './styles/pages/AuthPage.css';
import './styles/pages/Dashboard.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
