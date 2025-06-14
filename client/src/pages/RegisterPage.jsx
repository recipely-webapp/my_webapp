import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '@mui/material/Button';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.register(formData);
      navigate('/login');
    } catch (err) {
      console.error('Errore registrazione:', err.response?.data || err.message);
    }
  };

  return (
    <div className='form-container'>
    <form onSubmit={handleSubmit}>
      <h2>Registrazione</h2>
      <input type="text" placeholder="Username" value={formData.username}
             onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
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
          Registrati
        </Button>
    </form>
    </div>
  );
}

export default RegisterPage;
