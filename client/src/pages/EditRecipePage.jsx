// src/pages/EditRecipePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm'; // 1. Importa il nuovo componente
import '../styles/pages-styles/Recipe-Form.css';

function EditRecipePage() {
  const { recipeId } = useParams();

  // Stato per i dati del form
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    ingredienti: '',
    procedimento: '',
    tempoPreparazione: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // useEffect per caricare i dati iniziali
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await api.getRecipeById(recipeId);
        const { titolo, descrizione, ingredienti, procedimento, tempoPreparazione, image } = response.data;
        
        // Imposta i dati nello stato del form, convertendo gli array in stringhe
        setFormData({
          titolo,
          descrizione,
          ingredienti: ingredienti.join(', '),
          procedimento: procedimento.join('\n'),
          tempoPreparazione: tempoPreparazione || '',
          image: image || '',
        });
        
      } catch (err) {
        setError('Impossibile caricare i dati della ricetta.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeData();
  }, [recipeId]);

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
        const recipeDataToUpdate = {
            ...formData,
            ingredienti: ingredientiArray,
            procedimento: procedimentoArray,
            tempoPreparazione: Number(formData.tempoPreparazione),
        };
      await api.updateRecipe(recipeId, recipeDataToUpdate);
      window.location.href = `/recipe/${recipeId}`;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Si è verificato un errore. Riprova.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Caricamento dati ricetta...</p>;

  return (
    <div className="form-container">
      {error && <p className="error-message">{error}</p>}
      
      {/* 2. Usa il componente RecipeForm */}
      <RecipeForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitting={submitting}
        formType="edit"
      />
    </div>
  );
}

export default EditRecipePage;