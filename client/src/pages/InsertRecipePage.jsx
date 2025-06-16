// src/pages/InsertRecipePage.jsx
import React, { useState } from 'react';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm'; // 1. Importa il nuovo componente
import '../styles/pages-styles/Recipe-Form.css'; // Importa lo stile condiviso per i form

function InsertRecipePage() {
  // Stato per i dati del form, inizializzato vuoto
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    ingredienti: '',
    procedimento: '',
    tempoPreparazione: '',
    image: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const ingredientiArray = formData.ingredienti.split(',').map(item => item.trim()).filter(Boolean);
    const procedimentoArray = formData.procedimento.split('\n').map(step => step.trim()).filter(Boolean);

    if (ingredientiArray.length === 0 || procedimentoArray.length === 0 || !formData.titolo) {
      setError('Titolo, Ingredienti e Procedimento sono campi obbligatori.');
      setSubmitting(false);
      return;
    }

    try {
      const recipeData = {
        ...formData,
        ingredienti: ingredientiArray,
        procedimento: procedimentoArray,
        tempoPreparazione: Number(formData.tempoPreparazione),
      };

      const response = await api.createRecipe(recipeData);
      window.location.href = `/recipe/${response.data._id}`;

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Si è verificato un errore. Riprova.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      {/* Mostra il messaggio di errore se presente */}
      {error && <p className="error-message">{error}</p>}

      {/* 2. Usa il componente RecipeForm */}
      <RecipeForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitting={submitting}
        formType="create"
      />
    </div>
  );
}

export default InsertRecipePage;