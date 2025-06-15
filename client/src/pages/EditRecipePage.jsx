// src/pages/EditRecipePage.jsx
import React, { useState, useEffect } from 'react';
// Rimuovi useNavigate e importa solo useParams
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../App.css';
import Button from '@mui/material/Button';

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

  // useEffect per caricare i dati rimane invariato
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await api.getRecipeById(recipeId);
        const { titolo, descrizione, ingredienti, procedimento, tempoPreparazione, image } = response.data;
        
        setFormData({
          titolo,
          descrizione,
          ingredienti: ingredienti.join(', '),
          procedimento: procedimento.join('\n'),
          tempoPreparazione: tempoPreparazione || '',
          image: image || '',
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Errore nel recupero della ricetta da modificare:', err);
        setError('Impossibile caricare i dati della ricetta.');
        setLoading(false);
      }
    };
    fetchRecipeData();
  }, [recipeId]);

  // handleChange rimane invariato
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const ingredientiArray = formData.ingredienti.split(',').map(item => item.trim()).filter(item => item);
    const procedimentoArray = formData.procedimento.split('\n').map(step => step.trim()).filter(step => step);

    if (ingredientiArray.length === 0 || procedimentoArray.length === 0 || !formData.titolo) {
      setError('Titolo, Ingredienti e Procedimento sono campi obbligatori.');
      setSubmitting(false);
      return;
    }

    try {
      const recipeDataToUpdate = {
        titolo: formData.titolo,
        descrizione: formData.descrizione,
        ingredienti: ingredientiArray,
        procedimento: procedimentoArray,
        tempoPreparazione: Number(formData.tempoPreparazione),
        image: formData.image,
      };

      await api.updateRecipe(recipeId, recipeDataToUpdate);
      
      // --- MODIFICA CHIAVE QUI ---
      // Reindirizza l'utente con un ricaricamento completo della pagina
      window.location.href = `/recipe/${recipeId}`;

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Si è verificato un errore. Riprova.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <p>Caricamento dati ricetta...</p>;

  // Il return con il form rimane identico
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Modifica Ricetta</h2>
        
        {error && <p className="error-message">{error}</p>}

        <input
          type="text" name="titolo" placeholder="Titolo della Ricetta"
          value={formData.titolo} onChange={handleChange} required
        />
        <input
          type="text" name="image" placeholder="URL dell'Immagine"
          value={formData.image} onChange={handleChange}
        />
        <textarea
          name="descrizione" placeholder="Breve descrizione"
          value={formData.descrizione} onChange={handleChange} rows="3"
        />
        <input
          type="number" name="tempoPreparazione" placeholder="Tempo di preparazione (minuti)"
          value={formData.tempoPreparazione} onChange={handleChange} min="1"
        />
        <textarea
          name="ingredienti" placeholder="Ingredienti (separati da virgola)"
          value={formData.ingredienti} onChange={handleChange} required rows="4"
        />
        <textarea
          name="procedimento" placeholder="Procedimento (un passaggio per ogni riga)"
          value={formData.procedimento} onChange={handleChange} required rows="6"
        />

        <Button 
          type="submit" variant="contained" fullWidth
          disabled={submitting} sx={{ mt: 2, p: 1.5 }}
        >
          {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
        </Button>
      </form>
    </div>
  );
}

export default EditRecipePage;