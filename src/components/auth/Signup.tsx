// src/components/auth/Signup.tsx

import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/AuthForm.css';

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            const response = await axiosInstance.post('/register', {
                username,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error('Erreur d\'inscription', error);
        }
    };

    return (
        <form onSubmit={handleSignup} className="auth-form">
            <h2 className="auth-form-title">S'inscrire</h2>
            <div className="auth-form-group">
                <label className="auth-form-label">Nom d'utilisateur:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="auth-form-input"
                />
            </div>
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
            <div className="auth-form-group">
                <label className="auth-form-label">Confirmer le mot de passe:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="auth-form-input"
                />
            </div>
            <button type="submit" className="auth-form-button">
                S'inscrire
            </button>
        </form>
    );
};

export default Signup;
