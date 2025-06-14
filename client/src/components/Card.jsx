import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../App.css';

function Card({ title, image, description, isFavorite, onToggleFavorite }) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
        <div className="favorite-icon" onClick={onToggleFavorite}>
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
