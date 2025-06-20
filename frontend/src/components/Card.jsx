import React from 'react';
// Importazione simbolo cuore pieno e cuore vuoto
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/components-styles/Card.css';

// Visualizzare una ricetta
function Card({ title, image, description, isFavorite, onToggleFavorite }) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
        <div className="favorite-icon" onClick={onToggleFavorite}>
         
          {/* Se è nei preferiti mostra il cuore pieno */}
          {isFavorite ? (
            <FaHeart className="heart-icon favorite" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
        </div>
      </div>

      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

export default Card;
