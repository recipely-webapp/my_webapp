import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link per la navigazione
import api from '../services/api'; 
import '../App.css';

function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // ... (la logica di ricerca con debounce rimane identica)
    const searchRecipes = async () => {
      if (!searchTerm.trim()) {
        setFilteredRecipes([]);
        setIsDropdownOpen(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.searchRecipes(searchTerm);
        setFilteredRecipes(response.data);
        setIsDropdownOpen(response.data.length > 0);
      } catch (err) {
        setError('Errore nella ricerca delle ricette');
        console.error('Errore nella ricerca:', err);
        setFilteredRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };
    const debounceTimer = setTimeout(() => searchRecipes(), 300);
    return () => clearTimeout(debounceTimer);
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
          onFocus={() => filteredRecipes.length > 0 && setIsDropdownOpen(true)}
          // Chiude la tendina quando l'utente clicca altrove
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
        />
        {isLoading && <div className="search-loading">Ricerca in corso...</div>}
        {error && <div className="search-error">{error}</div>}
      </div>

      {isDropdownOpen && (
        <div className="recipe-results-dropdown">
          <div className="dropdown-content">
            {filteredRecipes.map(recipe => (
              // ===== MODIFICA CHIAVE QUI =====
              // Ogni elemento è un Link che porta alla pagina di dettaglio.
              // L'URL corrisponde alla rotta definita in App.jsx.
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
              // ===== FINE MODIFICA =====
            ))}
          </div>
        </div>
      )}

      {searchTerm && !isLoading && !error && filteredRecipes.length === 0 && (
        <div className="no-results-message">Nessuna ricetta trovata per "{searchTerm}"</div>
      )}
    </div>
  );
}

export default RecipeSearch;