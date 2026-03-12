import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const sortedPrices = game.prices ? [...game.prices].sort((a, b) => a.price - b.price) : [];
  const bestPrice = sortedPrices.length > 0 ? sortedPrices[0] : null;

  return (
    <div className="game-card-horizontal" style={{ animationDelay: `${Math.random() * 0.5}s` }}>
      <Link to={`/game/${game.id}`} className="card-image-link">
        <div className="game-cover-container">
          <img 
            src={game.cover_image || 'https://via.placeholder.com/400x225?text=No+Image'} 
            alt={game.name} 
            className="game-cover"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="game-card-body">
        <div className="card-main-info">
          <Link to={`/game/${game.id}`} className="card-title-link">
            <h3 className="game-title">{game.name}</h3>
          </Link>
          
          <div className="card-price-section">
            <div className="price-list-horizontal">
              {game.prices && game.prices.map((priceItem) => (
                <a 
                  key={priceItem.id} 
                  href={priceItem.url_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`price-tag ${bestPrice && priceItem.id === bestPrice.id ? 'best-price' : ''}`}
                >
                  <span className="store-name">{priceItem.store?.name || 'Tienda'}</span>
                  <span className="price-value">{priceItem.price}€</span>
                </a>
              ))}
              {(!game.prices || game.prices.length === 0) && (
                <span className="no-prices">No hay ofertas disponibles</span>
              )}
            </div>
          </div>
        </div>
        
        <Link to={`/game/${game.id}`} className="view-detail-btn">
          Ver detalles
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
