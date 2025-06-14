import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import api from '../services/api';
import '../App.css';
import { Link } from 'react-router-dom';
import RecipeSearch from '../components/RecipeSearch';

function HomePage({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const res = await api.getAllRecipes();
        setRecipes(res.data);
      } catch (err) {
        console.error('Errore caricamento ricette:', err);
      }
    };
    loadRecipes();
  }, []);
   // Carica i preferiti dell'utente loggato
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) { // Esegui solo se l'utente è loggato
        try {
          const res = await api.getFavorites();
          // L'API restituisce oggetti ricetta completi, estraiamo solo gli ID
          const favoriteIds = res.data.favorites.map(fav => fav._id);
          setFavorites(favoriteIds);
        } catch (err) {
          console.error('Errore caricamento preferiti:', err);
          setFavorites([]); // In caso di errore (es. token scaduto), svuota i preferiti
        }
      } else {
        // Se non c'è utente (logout), svuota l'array dei preferiti
        setFavorites([]);
      }
    };
    loadFavorites();
  }, [user]); // Questo effetto si attiva quando 'user' cambia (login/logout)

  const toggleFavorite = async (recipeId) => {
    if (!user) {
        alert('Devi essere loggato per aggiungere preferiti!');
        return;
    }
    try {
      // L'API toggleFavorite restituisce l'array aggiornato di ID preferiti
      const res = await api.toggleFavorite(recipeId);
      setFavorites(res.data.favorites); // Aggiorna lo stato, il che fa ri-renderizzare le Card
    } catch (err) {
      console.error('Errore toggle preferiti:', err);
      // Potrebbe essere un token scaduto, potresti voler gestire un refresh token qui
      alert('Si è verificato un errore. Prova a ricaricare la pagina.');
    }
  };



  return (
    <div className="container">
      <RecipeSearch/>
      <h1 className="home-title">
        {user ? `Benvenuto, ${user.username}! Ecco le ricette:` : 'Ricette pubbliche'}
      </h1>

      {recipes.length === 0 ? (
        <p>Nessuna ricetta disponibile.</p>
      ) : (
        <div className="card-list">
          {recipes.map((r) => (
             <Link to={`/recipe/${r._id}`} key={r._id} style={{ textDecoration: 'none' }}>
            <Card
              key={r._id}
              title={r.titolo}
              image={r.image}
              description={r.descrizione}
              isFavorite={favorites.includes(r._id)}
               onToggleFavorite={(e) => {
                  // 1. Ferma la propagazione per non attivare il Link
                  e.stopPropagation();
                  e.preventDefault();
                  
                  // 2. Chiama la funzione toggle con l'ID corretto preso dal map
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
