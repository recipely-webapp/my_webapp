import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '@mui/material/Button';

function LoginPage({ setCurrentUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(formData);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Credenziali non valide. Riprova.';
      alert(errorMessage); 
      console.error('Errore login:', errorMessage);
    }
  };

  return (
    <div className='form-container'>
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={formData.email}
             onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" value={formData.password}
             onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <Button 
          type="submit" 
          variant="contained"  // 'variant' definisce lo stile. 'contained' è un bottone solido con sfondo.
          fullWidth          // Occupa tutta la larghezza del contenitore (come il tuo CSS faceva prima)
          sx={{ mt: 2, p: 1.5 }} // 'sx' è per stili rapidi. Qui aggiungiamo margine sopra (mt) e padding (p).
        >
          Login
        </Button>
    </form>
    </div>
  );
}

export default LoginPage;
