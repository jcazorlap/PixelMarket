import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';


const GameDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    // Fetch game details
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

    // Check wishlist status if user is logged in
    if (user && token) {
      fetch(`http://localhost:8000/api/wishlist/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setIsWishlisted(data.is_wishlisted);
        })
        .catch(err => console.error("Error checking wishlist status:", err));
    }
  }, [id, user, token]);

  const toggleWishlist = async () => {
    if (!user || !token || wishlistLoading) return;

    setWishlistLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/wishlist/toggle/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setIsWishlisted(data.is_wishlisted);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

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
          <div className="title-wishlist-group">
            <h1 className="detail-game-name">{game.name}</h1>
            {user && (
              <button
                className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''} ${wishlistLoading ? 'loading' : ''}`}
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                title={isWishlisted ? "Quitar de la lista de deseos" : "Añadir a la lista de deseos"}
              >
                <svg viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            )}
          </div>
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
