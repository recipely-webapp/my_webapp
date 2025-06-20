import React from 'react';
import Button from '@mui/material/Button';

function RecipeForm({ formData, setFormData, handleSubmit, submitting, formType }) {

   // Gestisce il cambiamento dei campi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType === 'create' ? 'Inserisci una Nuova Ricetta' : 'Modifica Ricetta'}</h2>
      
      {/* Campo titolo */}
      <input
        type="text"
        name="titolo"
        placeholder="Titolo della Ricetta"
        value={formData.titolo}
        onChange={handleChange}
        required
      />

      {/* Campo immagine */}
      <input
        type="text"
        name="image"
        placeholder="URL dell'Immagine (es. /images/pasta.jpg)"
        value={formData.image}
        onChange={handleChange}
      />

      {/* Campo descrizione */}
      <textarea
        name="descrizione"
        placeholder="Breve descrizione della ricetta"
        value={formData.descrizione}
        onChange={handleChange}
        rows="3"
      />

      {/* Campo tempo preparazione */}
      <input
        type="number"
        name="tempoPreparazione"
        placeholder="Tempo di preparazione (minuti)"
        value={formData.tempoPreparazione}
        onChange={handleChange}
        min="1"
      />

      {/* Campo ingredienti */}
      <textarea
        name="ingredienti"
        placeholder="Ingredienti (separati da una virgola)"
        value={formData.ingredienti}
        onChange={handleChange}
        required
        rows="4"
      />

      {/* Campo procedimento */}
      <textarea
        name="procedimento"
        placeholder="Procedimento (un passaggio per ogni riga)"
        value={formData.procedimento}
        onChange={handleChange}
        required
        rows="6"
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
        {submitting ? 'Salvataggio...' 
          : (formType === 'create' ? 'Crea Ricetta' : 'Salva Modifiche')}
      </Button>
    </form>
  );
}

export default RecipeForm;