import React from 'react';

const GameCard = ({ game }) => {
  // Sort prices to find the cheapest
  const sortedPrices = [...game.prices].sort((a, b) => a.price - b.price);
  const bestPrice = sortedPrices[0];

  return (
    <div className="game-card" style={{ animationDelay: `${Math.random() * 0.5}s` }}>
      <div className="game-cover-container">
        <img 
          src={game.cover_image || 'https://via.placeholder.com/400x600?text=No+Image'} 
          alt={game.name} 
          className="game-cover"
          loading="lazy"
        />
      </div>
      <div className="game-info">
        <h3 className="game-title" title={game.name}>{game.name}</h3>
        <div className="price-list">
          {game.prices.map((priceItem) => (
            <a 
              key={priceItem.id} 
              href={priceItem.url_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`price-item ${priceItem.id === bestPrice.id ? 'best-price' : ''}`}
            >
              <span className="store-name">{priceItem.store.name}</span>
              <span className="price-value">{priceItem.price}€</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
