import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

// Riceve l'utente loggato come prop per sapere chi è
function FavoritesPage({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Funzione per caricare i dati
    const fetchFavorites = async () => {
      // Se non c'è un utente, non fare nulla e mostra un messaggio
      if (!user) {
        setError('Devi effettuare il login per vedere i tuoi preferiti.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.getFavorites();
        setFavorites(res.data.favorites); // L'API restituisce un array di oggetti ricetta
        setError('');
      } catch (err) {
        console.error('Errore nel caricamento dei preferiti:', err);
        setError('Non ci sono ricette nei preferiti');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]); // Esegui l'effetto quando il componente si monta o quando l'utente cambia

  // Funzione per rimuovere un preferito dalla visualizzazione in tempo reale
  const handleToggleFavorite = async (recipeId) => {
    try {
      await api.toggleFavorite(recipeId); // Chiama l'API per rimuoverlo
      // Aggiorna lo stato locale rimuovendo la ricetta senza dover ricaricare la pagina
      setFavorites(currentFavorites => 
        currentFavorites.filter(fav => fav._id !== recipeId)
      );
    } catch (err) {
      console.error('Errore nella rimozione del preferito:', err);
      alert('Si è verificato un errore.');
    }
  };

  // --- Logica di visualizzazione ---

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
        <div className="card-list" style={{  margin: 0 , maxWidth: 800}}>
          {favorites.map((r) => (
            <Link to={`/recipe/${r._id}`} key={r._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card
                title={r.titolo}
                image={r.image}
                description={r.descrizione}
                // Tutte le ricette in questa pagina sono preferite, quindi isFavorite è sempre true
                isFavorite={true}
                // La funzione per togliere il preferito
                onToggleFavorite={(e) => {
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