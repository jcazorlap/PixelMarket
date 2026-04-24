import React, { useState, useEffect } from 'react'
import GameList from './GameList'
import { useAuth } from '../context/AuthContext'

function Catalog() {
  const { user, token } = useAuth();
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(150);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const itemsPerPage = 10;

  useEffect(() => {
    // Obtener juegos y géneros en paralelo
    Promise.all([
      fetch('/api/games').then(res => res.json()),
      fetch('/api/genres').then(res => res.json())
    ])
      .then(([gamesData, genresData]) => {
        setGames(gamesData);
        setGenres(genresData);
        setLoading(false);

        // Actualizar el precio máximo global con los datos reales
        const maxPrice = gamesData.reduce((max, game) => {
          const gameMin = getMinPrice(game);
          return (gameMin > max) ? gameMin : max;
        }, 150);
        setGlobalMaxPrice(Math.ceil(maxPrice));
        setPriceRange([0, Math.ceil(maxPrice)]);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });

    // Obtener los IDs de la lista de deseos si el usuario ha iniciado sesión
    if (user && token) {
      fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setWishlistIds(new Set(data.map(g => g.id)));
        })
        .catch(err => console.error("Error fetching wishlist:", err));
    }
  }, [user, token]);

  // Auxiliar: obtener el precio mínimo de un juego entre todas las tiendas
  const getMinPrice = (game) => {
    if (!game.prices || game.prices.length === 0) return 0;
    return Math.min(...game.prices.map(p => parseFloat(p.price)));
  };

  // Definición estática de categorías para agrupación
  const genreCategories = {
    "Acción & Disparos": [
      "Acción", "Disparos", "Disparos en primera persona", "Disparos en tercera persona",
      "Hack and slash", "Arcade", "Lucha", "Mundo abierto", "Zombis", "FPS", "Shooter", "Action"
    ],
    "Rol (RPG)": [
      "Rol", "RPG", "JRPG", "Roguelike", "Roguelite", "Metroidvania", "Souls-like", "Rol de acción"
    ],
    "Estrategia": [
      "Estrategia", "Estrategia por turnos", "Estrategia en tiempo real", "Defensa de torres",
      "Cartas", "Tablero", "Construcción de ciudades", "4X", "Tactical"
    ],
    "Simulación": [
      "Simulación", "Simulador", "Construcción", "Gestión", "Sandbox", "Vida", "Física"
    ],
    "Deportes & Carreras": [
      "Deportes", "Fútbol", "Carreras", "Conducción", "Sports"
    ],
    "Temáticas & Otros": [
      "Terror", "Horror", "Ciencia ficción", "Espacio", "Anime", "Supervivencia",
      "Puzles", "Aventura", "Casual", "Indie", "Plataformas"
    ]
  };

  // Agrupar los géneros obtenidos en las categorías definidas
  const groupedGenres = {};
  const processedGenreNames = new Set();

  Object.entries(genreCategories).forEach(([catName, keywords]) => {
    const matchingGenres = genres.filter(g =>
      !processedGenreNames.has(g.name) &&
      keywords.some(k => g.name.toLowerCase().includes(k.toLowerCase()))
    );

    if (matchingGenres.length > 0) {
      groupedGenres[catName] = matchingGenres;
      matchingGenres.forEach(g => processedGenreNames.add(g.name));
    }
  });

  // Añadir los géneros restantes a "Otros"
  const remainingGenres = genres.filter(g => !processedGenreNames.has(g.name));
  if (remainingGenres.length > 0) {
    if (!groupedGenres["Más Categorías"]) groupedGenres["Más Categorías"] = [];
    groupedGenres["Más Categorías"] = [...(groupedGenres["Más Categorías"] || []), ...remainingGenres];
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedCategory === 'Todos' ||
      (game.genres && game.genres.some(g => g.name === selectedCategory));
    const minPrice = getMinPrice(game);
    const matchesPrice = minPrice >= priceRange[0] && minPrice <= priceRange[1];
    const matchesWishlist = !showWishlistOnly || wishlistIds.has(game.id);
    const isVisible = game.is_visible !== false;

    return matchesSearch && matchesGenre && matchesPrice && matchesWishlist && isVisible;
  });

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGames.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <main className="hero">
        <h1>Encuentra tu próximo juego <span className="gradient-text">al mejor precio</span></h1>
        <p>Comparamos los precios de las mejores tiendas digitales en tiempo real. No pierdas más el tiempo buscando, nosotros lo hacemos por ti.</p>
      </main>

      <div className="catalog-layout">

        {/* ── IZQUIERDA: Columna lateral ── */}
        <div className="sidebar-column">

          {/* ── Tarjeta de filtro de precio ── */}
          <aside className="price-sidebar">
            <div className="sidebar-header-row">
              <h2 className="section-subtitle">PRECIO</h2>
            </div>
            <div className="price-range-display">
              <span className="price-badge">{priceRange[0].toFixed(0)}€</span>
              <span className="price-range-dash">—</span>
              <span className="price-badge">{priceRange[1].toFixed(0)}€</span>
            </div>
            <div className="dual-range-slider">
              <input
                type="range"
                min={0}
                max={globalMaxPrice}
                value={priceRange[0]}
                className="range-input range-min"
                onChange={e => {
                  const val = Math.min(Number(e.target.value), priceRange[1] - 1);
                  setPriceRange([val, priceRange[1]]);
                }}
              />
              <input
                type="range"
                min={0}
                max={globalMaxPrice}
                value={priceRange[1]}
                className="range-input range-max"
                onChange={e => {
                  const val = Math.max(Number(e.target.value), priceRange[0] + 1);
                  setPriceRange([priceRange[0], val]);
                }}
              />
              <div
                className="range-track-fill"
                style={{
                  left: `${(priceRange[0] / globalMaxPrice) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / globalMaxPrice) * 100}%`
                }}
              />
            </div>
            {(priceRange[0] > 0 || priceRange[1] < globalMaxPrice) && (
              <button className="clear-price-btn" onClick={() => setPriceRange([0, globalMaxPrice])}>
                × Quitar filtro de precio
              </button>
            )}
          </aside>

          <aside className="genre-sidebar">
            <div className="sidebar-header-row">
              <h2 className="section-subtitle">GÉNEROS</h2>
              {genres.length > 5 && (
                <button
                  className="toggle-expand-btn"
                  onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                >
                  {isMenuExpanded ? 'Contraer ▲' : 'Ampliar ▼'}
                </button>
              )}
            </div>

            {/* Siempre visible: opción "Todos" */}
            <ul className="genre-link-list sidebar-top-list">
              <li
                className={selectedCategory === 'Todos' ? 'active' : ''}
                onClick={() => setSelectedCategory('Todos')}
              >
                Todos los géneros ({games.length})
              </li>
            </ul>

            {/* Grid expandible completo */}
            <div className={`sidebar-genre-grid ${isMenuExpanded || genres.length < 8 ? 'expanded' : ''}`}>
              {Object.entries(groupedGenres).map(([category, activeGenres]) => (
                <div key={category} className="genre-column">
                  <h3 className="column-title">{category}</h3>
                  <ul className="genre-link-list">
                    {activeGenres.map(genre => (
                      <li
                        key={genre.id}
                        className={selectedCategory === genre.name ? 'active' : ''}
                        onClick={() => setSelectedCategory(genre.name)}
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>{/* end .sidebar-column */}

        {/* ── DERECHA: Juegos + Búsqueda ── */}
        <div className="catalog-main">
          <div className="catalog-header">
            <div className="active-filter-indicator">
              Filtrando por: <span className="gradient-text">{selectedCategory === 'Todos' ? 'Todos los géneros' : selectedCategory}</span>
              {selectedCategory !== 'Todos' && (
                <button className="clear-filter" onClick={() => setSelectedCategory('Todos')}>×</button>
              )}
            </div>

            <div className="search-wishlist-group">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar en la tienda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              {user && (
                <button
                  className={`wishlist-filter-btn ${showWishlistOnly ? 'active' : ''}`}
                  onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                  title={showWishlistOnly ? "Ver todos los juegos" : "Ver mi lista de deseos"}
                >
                  <svg viewBox="0 0 24 24" fill={showWishlistOnly ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {showWishlistOnly ? "Ver todos" : "Deseados"}
                </button>
              )}
            </div>
          </div>

          <GameList games={currentItems} loading={loading} />

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn arrow-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="page-info">
                Página {currentPage} de {totalPages}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn arrow-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default Catalog;
