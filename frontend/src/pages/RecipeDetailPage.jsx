// client/src/pages/RecipeDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 1. Importa useParams
import api from '../services/api';
import '../styles/pages-styles/RecipeDetailPage.css'; // Importa il CSS

function RecipeDetailPage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. useParams() ci dà accesso ai parametri dinamici dell'URL
  const { recipeId } = useParams(); // Il nome 'recipeId' deve corrispondere a quello nella rotta in App.js

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        // 3. Facciamo la chiamata API per ottenere i dati della singola ricetta
        const res = await api.getRecipeById(recipeId); // Assicurati di avere questa funzione in api.js
        setRecipe(res.data);
      } catch (err) {
        setError('Ricetta non trovata o errore nel caricamento.');
        console.error('Errore fetch ricetta:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]); // L'effetto si riesegue se l'ID nell'URL cambia

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!recipe) {
    return <p>Ricetta non trovata.</p>;
  }

  // 4. Mostriamo i dettagli della ricetta
  return (
    <div className="recipe-detail-container">
      <h1 className="recipe-detail-title">{recipe.titolo}</h1>
      <img src={`/${recipe.image}`} 
      alt={recipe.titolo} 
      className="recipe-detail-image" />

      <div className="recipe-detail-content">
        <p className="recipe-detail-description">{recipe.descrizione}</p>
<h3>Ingredienti:</h3>
        <ul>
          {recipe.ingredienti.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>

        <h3>Procedimento:</h3>
        <ol>
          {recipe.procedimento.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <p><strong>Tempo di Preparazione:</strong> {recipe.tempoPreparazione} minuti</p>
      </div>
    </div>
  );
}

export default RecipeDetailPage;