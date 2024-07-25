// src/components/auth/Login.tsx

import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/AuthForm.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', {
                email,
                password,
            });
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Erreur de connexion', error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="auth-form">
            <h2 className="auth-form-title">Se connecter</h2>
            <div className="auth-form-group">
                <label className="auth-form-label">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-form-input"
                />
            </div>
            <div className="auth-form-group">
                <label className="auth-form-label">Mot de passe:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-form-input"
                />
            </div>
            <button type="submit" className="auth-form-button">
                Se connecter
            </button>
        </form>
    );
};

export default Login;
