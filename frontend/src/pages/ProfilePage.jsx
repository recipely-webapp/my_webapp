import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; 
import '../styles/pages-styles/ProfilePage.css'; 
// Importazione icona cestino e matita
import { FaTrash, FaEdit } from 'react-icons/fa';

function ProfilePage({ user }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favLoading, setFavLoading] = useState(true);
  const [myRecipes, setMyRecipes] = useState([]);
  const [myRecipesLoading, setMyRecipesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setFavLoading(false);
      setMyRecipesLoading(false);
      return;
    }

    // Recupera preferiti
    const fetchFavorites = async () => {
      try {
        const res = await api.getFavorites();
        setFavoriteRecipes(res.data.favorites);
      } 
      catch (err) {
        console.error('Errore caricamento preferiti:', err);
        setError('Impossibile caricare i preferiti.');
      } 
      finally {
        setFavLoading(false);
      }
    };

    // Recupera ricette create
    const fetchMyRecipes = async () => {
      try {
        const res = await api.getUserRecipes();
        setMyRecipes(res.data);
      } 
      catch (err) {
        console.error('Errore caricamento ricette utente:', err);
        // Concatena l'errore nuovo a quello vecchio
        setError(prev => prev + ' Impossibile caricare le tue ricette.');
      } 
      finally {
        setMyRecipesLoading(false);
      }
    };
    fetchFavorites();
    fetchMyRecipes();
  }, [user]);

// Gestisce eliminazione di una ricetta creata
 const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa ricetta? L\'azione è irreversibile.')) {
      try {
        await api.deleteRecipe(recipeId);
        setMyRecipes(currentRecipes => currentRecipes.filter(r => r._id !== recipeId));
        alert('Ricetta eliminata con successo!');
      } 
      catch (err) {
        console.error('Errore eliminazione ricetta:', err);
        alert('Si è verificato un errore durante l\'eliminazione.');
      }
    }
  };

  if (!user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <p>Per vedere il tuo profilo, <Link to="/login">effettua il login</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      {/* Card di intestazione con informazioni dell'utente */}
      <div className="profile-card profile-header-card">
        <div className="profile-avatar">
          {/* Mostra la prima lettera del nome utente in maiuscolo */}
          <span>{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="profile-name">{user.username}</h1>
        <p className="profile-email-display">{user.email}</p>
      </div>

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
          <p>Non hai ancora creato nessuna ricetta. <Link to="/insert-recipe">Creane una ora!</Link></p>
        )}
      </div>

      {/* Sezione per le ricette preferite */}
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