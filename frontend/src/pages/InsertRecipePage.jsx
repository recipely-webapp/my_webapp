import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm'; 

function InsertRecipePage() {
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    ingredienti: '',
    procedimento: '',
    tempoPreparazione: '',
    image: '',
  });
  const navigate = useNavigate(); 
  const [error, setError] = useState('');
  // Gestisce stato di invio in corso
  const [submitting, setSubmitting] = useState(false);

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
      const recipeData = { ...formData,
        ingredienti: ingredientiArray,
        procedimento: procedimentoArray,
        tempoPreparazione: Number(formData.tempoPreparazione),
      };

      const res = await api.createRecipe(recipeData);
      // Reindirizza alla pagina della nuova ricetta
        navigate(`/recipe/${res.data._id}`);

    } 
    catch (err) {
      const errorMessage = err.res?.data?.error || 'Si è verificato un errore. Riprova.';
      setError(errorMessage);
    } 
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      {/* Mostra il messaggio di errore se presente */}
      {error && <p className="error-message">{error}</p>}

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