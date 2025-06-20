import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import api from '../services/api';
import { Link } from 'react-router-dom';
import RecipeSearch from '../components/RecipeSearch';

// Mostra elenco delle ricette
function HomePage({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Carica le ricette
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const res = await api.getAllRecipes();
        setRecipes(res.data);
      } 
      catch (err) {
        console.error('Errore caricamento ricette:', err);
      }
    };
    loadRecipes();
  }, []);

  // Carica ricette preferite
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) { 
        try {
          const res = await api.getFavorites();
          // Mappa i preferiti tramite ID
          const favoriteIds = res.data.favorites.map(fav => fav._id);
          setFavorites(favoriteIds);
        } 
        catch (err) {
          console.error('Errore caricamento preferiti:', err);
          setFavorites([]); 
        }
      } 
      else {
        // Svuota array dei preferiti
        setFavorites([]);
      }
    };
    loadFavorites();
  }, [user]); 

  // Gestisce aggiunta/rimozione di una ricetta dai preferiti
  const toggleFavorite = async (recipeId) => {
    if (!user) {
        alert('Devi essere loggato per aggiungere preferiti!');
        // Blocca esecuzione se utente non loggato
        return;
    }
    try {
      const res = await api.toggleFavorite(recipeId);
      setFavorites(res.data.favorites); 
    } 
    catch (err) {
      console.error('Errore aggiunta preferiti:', err);
      alert('Si è verificato un errore. Prova a ricaricare la pagina.');
    }
  };

return (
    <div className="container">
      <RecipeSearch/>
      <h1 className="home-title">
        {user ? `Benvenuto, ${user.username}! Ecco le ricette:` : 'Ricette pubbliche'}
      </h1>

      {/* Mostra un messaggio se non ci sono ricette */}
      {recipes.length === 0 ? (
        <p>Nessuna ricetta disponibile.</p>
      ) : (
        <div className="card-list">

          {/* Mappa array delle ricette per creare una Card */}
          {recipes.map((r) => (
             <Link to={`/recipe/${r._id}`} key={r._id} style={{ textDecoration: 'none' }}>
            <Card
              title={r.titolo}
              image={r.image}
              description={r.descrizione}
              isFavorite={favorites.includes(r._id)}
              // Aggiunta ai preferiti dopo il click
               onToggleFavorite={(e) => {
                  // Previene il bubbling
                  e.stopPropagation();
                  e.preventDefault();
                  toggleFavorite(r._id);
                }}
            />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
