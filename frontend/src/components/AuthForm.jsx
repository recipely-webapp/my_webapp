import React, { useState } from 'react';
import Button from '@mui/material/Button';

// Componente riutilizzabile per form di login/registrazione
function AuthForm({ formType, onSubmit, error, submitting }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Gestisce il cambiamento dei campi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Aggiorna dinamicamente la chiave
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestisce invio del form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Passa i dati al genitore
    onSubmit(formData); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType === 'login' ? 'Login' : 'Registrazione'}</h2>

      {/* Mostra errore se presente */} 
      {error && <div className="error-message">{error}</div>}

      {/* Mostra campo username solo per registrazione */}
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

      {/* Campo email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      {/* Campo password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength="6"
      />

      {/* Pulsante submit */}
      <Button 
        type="submit" 
        variant="contained"      // Sfondo colorato
        fullWidth
        disabled={submitting}    // Bottone disabilitato
        sx={{ mt: 2, p: 1.5 }}   // Margin top, padding
      >

        {/* Il testo del bottone cambia dinamicamente */}
        {submitting ? 'Caricamento...' 
          : (formType === 'login' ? 'Accedi' : 'Registrati')}
      </Button>
    </form>
  );
}

export default AuthForm;