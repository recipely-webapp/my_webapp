import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm'; 

function EditRecipePage() {
  // Estrae parametri dall'URL
  const { recipeId } = useParams();
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    ingredienti: '',
    procedimento: '',
    tempoPreparazione: '',
    image: '',
  });
   const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Gestisce stato di invio in corso
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Recupera dati di una ricetta
    const fetchRecipeData = async () => {
      try {
        const response = await api.getRecipeById(recipeId);
        const { titolo, descrizione, ingredienti, procedimento, tempoPreparazione, image } = response.data;
        
        // Inizializza dati da inserire nel form
        setFormData({
          titolo,
          descrizione,
          ingredienti: ingredienti.join(', '),
          procedimento: procedimento.join('\n'),
          tempoPreparazione: tempoPreparazione || '',
          image: image || '',
        });
      } 
      catch (err) {
        setError('Impossibile caricare i dati della ricetta.');
      } 
      finally {
        setLoading(false);
      }
    };
    fetchRecipeData();
  }, [recipeId]);

  // Gestisce il processo di invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Divide gli ingredienti separati da virgola e rimuove spazi/elementi vuoti
    const ingredientiArray = formData.ingredienti.split(',').map(item => item.trim()).filter(Boolean);
    // Divide il procedimento riga per riga e rimuove spazi/righe vuote
    const procedimentoArray = formData.procedimento.split('\n').map(step => step.trim()).filter(Boolean);

    if (ingredientiArray.length === 0 || procedimentoArray.length === 0 || !formData.titolo) {
      setError('Titolo, Ingredienti e Procedimento sono campi obbligatori.');
      // Riabilita il bottone
      setSubmitting(false);
      return;
    }
    
    try {
        const recipeDataToUpdate = {...formData,
            ingredienti: ingredientiArray,
            procedimento: procedimentoArray,
            tempoPreparazione: Number(formData.tempoPreparazione),
        };
      await api.updateRecipe(recipeId, recipeDataToUpdate);
        // Reindirizza alla pagina della nuova ricetta
        navigate(`/recipe/${recipeId}`);

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
      {/* Mostra il messaggio di errore se presente */}
      {error && <p className="error-message">{error}</p>}
      
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