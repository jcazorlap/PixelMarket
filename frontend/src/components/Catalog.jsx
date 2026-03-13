import { useState, useEffect } from 'react'
import GameList from './GameList'

function Catalog() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(150);
  const itemsPerPage = 10; // Increased for better UX

  useEffect(() => {
    // Fetch games and genres in parallel
    Promise.all([
      fetch('http://localhost:8000/api/games').then(res => res.json()),
      fetch('http://localhost:8000/api/genres').then(res => res.json())
    ])
      .then(([gamesData, genresData]) => {
        setGames(gamesData);
        setGenres(genresData);
        setLoading(false);

        // Update globalMaxPrice based on actual data
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
  }, []);

  // Helper: get minimum price for a game across all stores
  const getMinPrice = (game) => {
    if (!game.prices || game.prices.length === 0) return 0;
    return Math.min(...game.prices.map(p => parseFloat(p.price)));
  };

  // Static definition of categories for grouping
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

  // Group fetched genres into the defined categories
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

  // Add remaining genres to "Otros"
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
    return matchesSearch && matchesGenre && matchesPrice;
  });

  // Pagination logic
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

        {/* ── LEFT: Sidebar Column ── */}
        <div className="sidebar-column">

          {/* ── Price Filter Card ── */}
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

            {/* Always-visible: "Todos" option */}
            <ul className="genre-link-list sidebar-top-list">
              <li
                className={selectedCategory === 'Todos' ? 'active' : ''}
                onClick={() => setSelectedCategory('Todos')}
              >
                Todos los géneros ({games.length})
              </li>
            </ul>

            {/* Expandable full grid */}
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

        {/* ── RIGHT: Games + Search ── */}
        <div className="catalog-main">
          <div className="catalog-header">
            <div className="active-filter-indicator">
              Filtrando por: <span className="gradient-text">{selectedCategory === 'Todos' ? 'Todos los géneros' : selectedCategory}</span>
              {selectedCategory !== 'Todos' && (
                <button className="clear-filter" onClick={() => setSelectedCategory('Todos')}>×</button>
              )}
            </div>

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
