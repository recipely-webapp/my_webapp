// 1. Rimuovi l'import di useNavigate
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // <-- RIMUOVI QUESTA RIGA
import api from '../services/api';
import '../App.css';
import Button from '@mui/material/Button';


function InsertRecipePage({ user }) {
  // 2. Rimuovi la chiamata a useNavigate
  // const navigate = useNavigate(); // <-- RIMUOVI QUESTA RIGA

  // Stati per ogni campo del form
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [ingredienti, setIngredienti] = useState(''); // Stringa separata da virgole
  const [procedimento, setProcedimento] = useState(''); // Stringa separata da "a capo"
  const [tempoPreparazione, setTempoPreparazione] = useState('');
  const [image, setImage] = useState(''); // URL dell'immagine
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const ingredientiArray = ingredienti.split(',').map(item => item.trim()).filter(item => item);
    const procedimentoArray = procedimento.split('\n').map(step => step.trim()).filter(step => step);

    if (ingredientiArray.length === 0 || procedimentoArray.length === 0 || !titolo) {
      setError('Titolo, Ingredienti e Procedimento sono campi obbligatori.');
      setSubmitting(false);
      return;
    }

    try {
      const recipeData = {
        titolo,
        descrizione,
        ingredienti: ingredientiArray,
        procedimento: procedimentoArray,
        tempoPreparazione: Number(tempoPreparazione),
        image,
      };

      const response = await api.createRecipe(recipeData);
      
      // 3. Sostituisci navigate(...) con window.location.href
      // Questo reindirizzerà l'utente alla pagina della nuova ricetta
      // causando un ricaricamento completo.
      window.location.href = `/recipe/${response.data._id}`;

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Si è verificato un errore. Riprova.';
      setError(errorMessage);
      console.error('Errore inserimento ricetta:', err);
    } finally {
      // In caso di errore, il `finally` si assicura che il bottone torni cliccabile
      setSubmitting(false);
    }
  };

  // Il resto del componente rimane invariato...
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Inserisci una Nuova Ricetta</h2>
        
        {error && <p className="error-message">{error}</p>}

        {/* ... tutti gli input del form ... */}
        <input
          type="text"
          placeholder="Titolo della Ricetta"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL dell'Immagine (es. /images/pasta.jpg)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          placeholder="Breve descrizione della ricetta"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          rows="3"
        />
        <input
          type="number"
          placeholder="Tempo di preparazione (minuti)"
          value={tempoPreparazione}
          onChange={(e) => setTempoPreparazione(e.target.value)}
          min="1"
        />
        <textarea
          placeholder="Ingredienti (separati da una virgola, es. Farina, Uova, Latte)"
          value={ingredienti}
          onChange={(e) => setIngredienti(e.target.value)}
          required
          rows="4"
        />
        <textarea
          placeholder="Procedimento (un passaggio per ogni riga)"
          value={procedimento}
          onChange={(e) => setProcedimento(e.target.value)}
          required
          rows="6"
        />

        <Button 
          type="submit" 
          variant="contained"  // 'variant' definisce lo stile. 'contained' è un bottone solido con sfondo.
          fullWidth          // Occupa tutta la larghezza del contenitore (come il tuo CSS faceva prima)
          sx={{ mt: 2, p: 1.5 }} // 'sx' è per stili rapidi. Qui aggiungiamo margine sopra (mt) e padding (p).
        >
          Inserisci ricetta
        </Button>
      </form>
    </div>
  );
}

export default InsertRecipePage;