// src/components/AuthForm.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';

function AuthForm({ formType, onSubmit, error, submitting }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Passa tutti i dati del form al genitore
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType === 'login' ? 'Login' : 'Registrazione'}</h2>

      {/* Mostra il messaggio di errore se presente */}
      {error && <div className="error-message">{error}</div>}

      {formType === 'register' && (
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength="6"
      />

      <Button 
        type="submit" 
        variant="contained"
        fullWidth
        disabled={submitting}
        sx={{ mt: 2, p: 1.5 }}
      >
        {submitting 
          ? 'Caricamento...' 
          : (formType === 'login' ? 'Accedi' : 'Registrati')}
      </Button>
    </form>
  );
}

export default AuthForm;