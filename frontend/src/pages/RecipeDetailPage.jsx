import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import api from '../services/api';
import '../styles/pages-styles/RecipeDetailPage.css'; 

// Visualizza i dettagli della ricetta
function RecipeDetailPage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Estrae parametri dall'URL
  const { recipeId } = useParams(); 

  useEffect(() => {
    // Recupera ricetta
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await api.getRecipeById(recipeId); 
        setRecipe(res.data);
      } 
      catch (err) {
        setError('Ricetta non trovata o errore nel caricamento.');
        console.error('Errore fetch ricetta:', err);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]); 

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!recipe) {
    return <p>Ricetta non trovata.</p>;
  }

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
          {/* Mappa gli ingredienti assegnando l'indice */}
          {recipe.ingredienti.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>

        <h3>Procedimento:</h3>
        <ol>
          {/* Mappa il procedimento assegnando l'indice */}
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