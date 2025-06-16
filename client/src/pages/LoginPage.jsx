// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthForm from '../components/AuthForm'; // Importa il componente riutilizzabile
import '../App.css'; // Importa lo stile centralizzato

function LoginPage({ setCurrentUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (formData) => {
    setError('');
    setSubmitting(true);
    try {
      // Passiamo solo email e password, come richiesto dall'API
      const credentials = { email: formData.email, password: formData.password };
      const res = await api.login(credentials);
      
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Credenziali non valide. Riprova.';
      setError(errorMessage);
      console.error('Errore login:', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='form-container'>
      <AuthForm
        formType="login"
        onSubmit={handleLogin}
        error={error}
        submitting={submitting}
      />
    </div>
  );
}

export default LoginPage;