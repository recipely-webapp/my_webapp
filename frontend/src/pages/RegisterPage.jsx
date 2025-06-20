import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthForm from '../components/AuthForm'; 

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // Gestisce stato di invio in corso
  const [submitting, setSubmitting] = useState(false);

  // Gestisce il processo di registrazione
  const handleRegister = async (formData) => {
    setError('');
    setSubmitting(true);
    try {
      await api.register(formData);
      alert('Registrazione completata! Ora puoi effettuare il login.');
      // Reindirizza al login 
      navigate('/login');
    } 
    catch (err) {
      const errorMessage = err.response?.data?.message || 'Errore durante la registrazione. Riprova.';
      setError(errorMessage);
      console.error('Errore registrazione:', err.response?.data || err.message);
    } 
    finally {
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