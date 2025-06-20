import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../services/api'; 
import '../styles/components-styles/Recipe-Search.css';

// Ricerca ricette
function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const searchRecipes = async () => {
      // Se la barra di ricerca è vuota, resetta
      if (!searchTerm.trim()) {
        setFilteredRecipes([]);
        setIsDropdownOpen(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        // Chiamata API per cercare ricette
        const response = await api.searchRecipes(searchTerm);
        setFilteredRecipes(response.data);
        setIsDropdownOpen(response.data.length > 0);
      } 
      catch (err) {
        setError('Errore nella ricerca delle ricette');
        console.error('Errore nella ricerca:', err);
        setFilteredRecipes([]);
      } 
      finally {
        // Nasconde indicatore di caricamento
        setIsLoading(false);
      }
    };
    // Imposta un timer prima di effettuare una chiamata API
    const debounceTimer = setTimeout(() => searchRecipes(), 300);
    return () => clearTimeout(debounceTimer);
    // Effetto eseguito ad ogni cambio
  }, [searchTerm]);

  return (
    <div className="recipe-search-container">
      <h2 className="recipe-search-title">Cerca una ricetta</h2>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Cerca una ricetta o alimenti "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="recipe-search-input"
          // Se ci sono risultati, mostra il dropdown e si chiude dopo un timeout
          onFocus={() => filteredRecipes.length > 0 && setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
        />

        {/* Mostra dinamicamente caricamento o errore */}
        {isLoading && <div className="search-loading">Ricerca in corso...</div>}
        {error && <div className="search-error">{error}</div>}
      </div>

      {/* Se dropdown è aperto, ogni ricetta è cliccabile */}
      {isDropdownOpen && (
        <div className="recipe-results-dropdown">
          <div className="dropdown-content">

            {/* Mappa i risultati della ricerca in una lista di link */}
            {filteredRecipes.map(recipe => (
              <Link 
                key={recipe._id} 
                to={`/recipe/${recipe._id}`} 
                className="recipe-result-item-link"
              >
                <div className="recipe-result-item">
                  <h3 className="recipe-result-title">{recipe.titolo}</h3>
                  {recipe.descrizione && (
                    <p className="recipe-result-description">{recipe.descrizione}</p>
                  )}
                  <div className="recipe-meta">
                    {recipe.tempoPreparazione && (
                      <span className="meta-item">⏱️ {recipe.tempoPreparazione} min</span>
                    )}
                    <span className="meta-item">🧄 {recipe.ingredienti.length} ingredienti</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Messaggio per quando la ricerca non produce risultati */}
      {searchTerm && !isLoading && !error && filteredRecipes.length === 0 && (
        <div className="no-results-message">Nessuna ricetta trovata per "{searchTerm}"</div>
      )}
    </div>
  );
}

export default RecipeSearch;