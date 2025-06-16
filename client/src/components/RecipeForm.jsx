// src/components/RecipeForm.jsx
import React from 'react';
import Button from '@mui/material/Button';

// Riceve i dati del form (formData), il gestore delle modifiche (handleChange),
// il gestore del submit (handleSubmit), e lo stato di caricamento (submitting).
function RecipeForm({ formData, setFormData, handleSubmit, submitting, formType }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Il titolo cambia in base al tipo di form */}
      <h2>{formType === 'create' ? 'Inserisci una Nuova Ricetta' : 'Modifica Ricetta'}</h2>

      <input
        type="text"
        name="titolo"
        placeholder="Titolo della Ricetta"
        value={formData.titolo}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="image"
        placeholder="URL dell'Immagine (es. /images/pasta.jpg)"
        value={formData.image}
        onChange={handleChange}
      />
      <textarea
        name="descrizione"
        placeholder="Breve descrizione della ricetta"
        value={formData.descrizione}
        onChange={handleChange}
        rows="3"
      />
      <input
        type="number"
        name="tempoPreparazione"
        placeholder="Tempo di preparazione (minuti)"
        value={formData.tempoPreparazione}
        onChange={handleChange}
        min="1"
      />
      <textarea
        name="ingredienti"
        placeholder="Ingredienti (separati da una virgola)"
        value={formData.ingredienti}
        onChange={handleChange}
        required
        rows="4"
      />
      <textarea
        name="procedimento"
        placeholder="Procedimento (un passaggio per ogni riga)"
        value={formData.procedimento}
        onChange={handleChange}
        required
        rows="6"
      />

      <Button 
        type="submit" 
        variant="contained"
        fullWidth
        disabled={submitting}
        sx={{ mt: 2, p: 1.5 }}
      >
        {submitting 
            ? 'Salvataggio...' 
            : (formType === 'create' ? 'Crea Ricetta' : 'Salva Modifiche')}
      </Button>
    </form>
  );
}

export default RecipeForm;