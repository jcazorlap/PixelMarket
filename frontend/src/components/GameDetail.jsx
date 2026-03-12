import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';


const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we might have an endpoint like GET /api/games/{id}
    // For now, we fetch all and filter, or assuming the API handles it
    fetch(`http://localhost:8000/api/games`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(g => g.id === parseInt(id));
        setGame(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching game detail:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!game) return <div className="error-state">Juego no encontrado. <Link to="/">Volver al catálogo</Link></div>;

  const sortedPrices = [...game.prices].sort((a, b) => a.price - b.price);

  return (
    <div className="game-detail-container">
      <Link to="/" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver al catálogo
      </Link>

      <div className="detail-banner-container">
        <img src={game.cover_image} alt={game.name} className="detail-hero-banner" />
        <div className="banner-gradient"></div>
      </div>

      <div className="detail-main-info">
        <div className="detail-title-row">
          <h1 className="detail-game-name">{game.name}</h1>
          <div className="detail-genre-cloud">
            {game.genres && game.genres.map(genre => (
              <span key={genre.id} className="detail-genre-tag">{genre.name}</span>
            ))}
          </div>
        </div>

        <div className="detail-prices-section">
          <h2 className="section-title">Disponible en</h2>
          <div className="detail-price-list">
            {sortedPrices.map(priceItem => (
              <a
                key={priceItem.id}
                href={priceItem.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-store-card"
              >
                <div className="store-info">
                  <span className="store-label">{priceItem.store.name}</span>
                  <span className="price-amount">{priceItem.price}€</span>
                </div>
                <div className="store-action">Comprar</div>
              </a>
            ))}
          </div>
        </div>

        <div className="detail-about-section">
          <h2 className="section-title">Acerca de este juego</h2>
          <div className="detail-description-box">
            <p>{game.description || "No hay descripción disponible para este título."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
