// src/components/AuthForm.jsx
import React, { useState } from 'react';

function AuthForm({ onSubmitForm, formType }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // solo per registrazione

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = formType === 'register'
      ? { email, password, username }
      : { email, password };
    onSubmitForm(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{formType === 'login' ? 'Login' : 'Registrazione'}</h2>

      {formType === 'register' && (
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">{formType === 'login' ? 'Accedi' : 'Registrati'}</button>
    </form>
  );
}

export default AuthForm;
