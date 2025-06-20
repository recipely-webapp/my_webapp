import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthForm from '../components/AuthForm'; 

function LoginPage({ setCurrentUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // Gestisce stato di invio in corso
  const [submitting, setSubmitting] = useState(false);

  // Gestisce il processo di login
  const handleLogin = async (formData) => {
    setError('');
    setSubmitting(true);
    try {
      const credentials = { email: formData.email, password: formData.password };
      const res = await api.login(credentials);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      // Reindirizza alla home dopo il login
      navigate('/');
    } 
    catch (err) {
      const errorMessage = err.response?.data?.message || 'Credenziali non valide. Riprova.';
      setError(errorMessage);
      console.error('Errore login:', errorMessage);
    } 
    finally {
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