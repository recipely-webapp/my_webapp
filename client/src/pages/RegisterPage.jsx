// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthForm from '../components/AuthForm'; // Importa il componente riutilizzabile

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (formData) => {
    setError('');
    setSubmitting(true);
    try {
      // L'API di registrazione si aspetta username, email e password
      await api.register(formData);
      alert('Registrazione completata! Ora puoi effettuare il login.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Errore durante la registrazione. Riprova.';
      setError(errorMessage);
      console.error('Errore registrazione:', err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='form-container'>
      <AuthForm
        formType="register"
        onSubmit={handleRegister}
        error={error}
        submitting={submitting}
      />
    </div>
  );
}

export default RegisterPage;