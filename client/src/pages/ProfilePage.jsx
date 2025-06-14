import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // 1. Importa l'API
import '../App.css';

// 2. La pagina riceve l'utente loggato come prop
function ProfilePage({ user }) {
  // 3. Stati per gestire i preferiti, il caricamento e gli errori
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 4. Effetto per caricare i dati quando il componente viene montato o l'utente cambia
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        // Se non c'è un utente, non c'è bisogno di fare una chiamata API
        setLoading(false);
        return;
      }

      try {
        const res = await api.getFavorites(); // Chiama l'API per ottenere i preferiti
        setFavoriteRecipes(res.data.favorites); // Salva i dati nello stato
        setError('');
      } catch (err) {
        console.error('Errore nel caricamento dei preferiti del profilo:', err);
        setError('Impossibile caricare le ricette preferite.');
      } finally {
        setLoading(false); // Fine del caricamento
      }
    };

    fetchFavorites();
  }, [user]); // Dipendenza: l'effetto si attiva se l'oggetto 'user' cambia

  // 5. Gestione del caricamento e fallback se l'utente non è ancora disponibile
  if (!user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <p>Per vedere il tuo profilo, <Link to="/login">effettua il login</Link>.</p>
        </div>
      </div>
    );
  }

  // 6. Visualizzazione del componente
  return (
    <div className="profile-wrapper">
      
      {/* CARD 1: INTESTAZIONE DEL PROFILO (usa i dati reali) */}
      <div className="profile-card profile-header-card">
        <div className="profile-avatar">
          {/* L'avatar mostra la prima lettera dell'username */}
          <span>{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="profile-name">{user.username}</h1>
        <p className="profile-email-display">{user.email}</p>
      </div>

      {/* CARD 2: RICETTE PREFERITE (usa i dati reali) */}
      <div className="profile-card">
        <h2 className="profile-card-title">Le Tue Ricette Preferite</h2>
        
        {loading ? (
          <p>Caricamento dei preferiti...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : favoriteRecipes.length > 0 ? (
          <div className="favorite-recipes-list">
            {/* 7. Mappa sui dati reali e crea i link corretti */}
            {favoriteRecipes.map(recipe => (
              <Link to={`/recipe/${recipe._id}`} key={recipe._id} className="favorite-recipe-item">
                <h3 className="favorite-recipe-title">{recipe.titolo}</h3>
                <p className="favorite-recipe-description">{recipe.descrizione}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>Non hai ancora aggiunto nessuna ricetta ai preferiti!</p>
        )}
      </div>

    </div>
  );
}

export default ProfilePage;