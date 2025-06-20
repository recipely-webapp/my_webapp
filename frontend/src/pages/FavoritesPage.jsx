import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

// Mostra le ricette preferite dell'utente
function FavoritesPage({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setError('Devi effettuare il login per vedere i tuoi preferiti.');
        setLoading(false);
        return;
      }
      try {
        const res = await api.getFavorites();
        setFavorites(res.data.favorites); 
        setError('');
      } 
      catch (err) {
        console.error('Errore nel caricamento dei preferiti:', err);
        setError('Non ci sono ricette nei preferiti');
      } 
      finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]); 

  // Gestisce la rimozione di una ricetta dai preferiti
  const handleToggleFavorite = async (recipeId) => {
    try {
      await api.toggleFavorite(recipeId); 
      // Crea un nuovo array eliminando l'elemento con ID=recipeId
      setFavorites(currentFavorites => 
        currentFavorites.filter(fav => fav._id !== recipeId)
      );
    } catch (err) {
      console.error('Errore nella rimozione del preferito:', err);
      alert('Si è verificato un errore.');
    }
  };

  if (loading) {
    return <div className="container"><p>Caricamento dei preferiti...</p></div>;
  }

  if (error) {
    return <div className="container"><p>{error}</p></div>;
  }

  return (
    <div className="container">
      <h1 className="home-title" style={{ textAlign: 'center' }}>I Tuoi Preferiti</h1>
      {favorites.length === 0 ? (
        <p>Non hai ancora aggiunto nessuna ricetta ai tuoi preferiti.</p>
      ) : (
        <div className="card-list" >
          {favorites.map((r) => (
            <Link to={`/recipe/${r._id}`} key={r._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card
                title={r.titolo}
                image={r.image}
                description={r.descrizione}
                isFavorite={true}
                // Aggiunta ai preferiti dopo il click
                onToggleFavorite={(e) => {
                  // Previene il bubbling
                  e.stopPropagation();
                  e.preventDefault();
                  handleToggleFavorite(r._id);
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;