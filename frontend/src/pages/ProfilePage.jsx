import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // 1. Importa l'API
import '../styles/pages-styles/ProfilePage.css'; // Importa il CSS

// Aggiungiamo due icone per i bottoni
import { FaTrash, FaEdit } from 'react-icons/fa';


// 2. La pagina riceve l'utente loggato come prop
function ProfilePage({ user }) {
  // 3. Stati per gestire i preferiti, il caricamento e gli errori
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favLoading, setFavLoading] = useState(true);
  const [myRecipes, setMyRecipes] = useState([]);
  const [myRecipesLoading, setMyRecipesLoading] = useState(true);
  const [error, setError] = useState('');

  // 4. Effetto per caricare i dati quando il componente viene montato o l'utente cambia
  useEffect(() => {
    if (!user) {
      setFavLoading(false);
      setMyRecipesLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await api.getFavorites();
        setFavoriteRecipes(res.data.favorites);
      } catch (err) {
        console.error('Errore caricamento preferiti:', err);
        setError('Impossibile caricare i preferiti.');
      } finally {
        setFavLoading(false);
      }
    };

    const fetchMyRecipes = async () => {
      try {
        const res = await api.getUserRecipes();
        setMyRecipes(res.data);
      } catch (err) {
        console.error('Errore caricamento ricette utente:', err);
        setError(prev => prev + ' Impossibile caricare le tue ricette.');
      } finally {
        setMyRecipesLoading(false);
      }
    };

    fetchFavorites();
    fetchMyRecipes();
  }, [user]);// Dipendenza: l'effetto si attiva se l'oggetto 'user' cambia

 const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa ricetta? L\'azione è irreversibile.')) {
      try {
        await api.deleteRecipe(recipeId);
        setMyRecipes(currentRecipes => currentRecipes.filter(r => r._id !== recipeId));
        alert('Ricetta eliminata con successo!');
      } catch (err) {
        console.error('Errore eliminazione ricetta:', err);
        alert('Si è verificato un errore durante l\'eliminazione.');
      }
    }
  };

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
  {/* CARD 2: RICETTE CREATE */}
      <div className="profile-card">
        <h2 className="profile-card-title">Le Tue Ricette Create</h2>
        {myRecipesLoading ? (
          <p>Caricamento delle tue ricette...</p>
        ) : myRecipes.length > 0 ? (
          <div className="favorite-recipes-list">
            {myRecipes.map(recipe => (
              <div key={recipe._id} className="favorite-recipe-item managed-recipe">
                <Link to={`/recipe/${recipe._id}`} className="managed-recipe-info">
                  <h3 className="favorite-recipe-title">{recipe.titolo}</h3>
                  <p className="favorite-recipe-description">{recipe.descrizione}</p>
                </Link>
                <div className="managed-recipe-actions">
                  {/* Trasformiamo il bottone in un componente Link */}
                  <Link to={`/edit-recipe/${recipe._id}`} className="action-button edit-button">
                    <FaEdit /> Modifica
                  </Link>
                  <button onClick={() => handleDeleteRecipe(recipe._id)} className="action-button delete-button">
                    <FaTrash /> Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Non hai ancora creato nessuna ricetta. <Link to="/insertrecipe">Creane una ora!</Link></p>
        )}
      </div>
          {/* CARD 3: RICETTE PREFERITE */}
      <div className="profile-card">
        <h2 className="profile-card-title">Le Tue Ricette Preferite</h2>
        {favLoading ? (
          <p>Caricamento dei preferiti...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : favoriteRecipes.length > 0 ? (
          <div className="favorite-recipes-list">
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