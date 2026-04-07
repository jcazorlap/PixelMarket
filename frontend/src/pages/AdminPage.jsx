import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import GameModal from '../components/Admin/GameModal';
import GenreModal from '../components/Admin/GenreModal';
import ScraperModal from '../components/Admin/ScraperModal';

function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allGenres, setAllGenres] = useState([]);
  
  // View state
  const [view, setView] = useState('games'); // 'games' or 'categories'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const ADMIN_PASSWORD = 'adminPixelMarket123';

  useEffect(() => {
    // Check if authorized in session storage to support page reloads
    if (sessionStorage.getItem('pxm_admin_auth') === 'true') {
      setIsAuthorized(true);
      fetchGames();
      fetchGenres();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem('pxm_admin_auth', 'true');
      fetchGames();
      fetchGenres();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/games');
      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Error al cargar los juegos');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/genres');
      const data = await response.json();
      setAllGenres(data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar este juego?')) return;
    
    try {
      await fetch(`http://localhost:8000/api/games/${id}`, { method: 'DELETE' });
      setGames(games.filter(g => g.id !== id));
      fetchGenres(); // Refresh counts
    } catch (err) {
      alert('Error al borrar el juego');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('¡ATENCIÓN! ¿Estás seguro de que quieres borrar TODOS los juegos de la base de datos? Esta acción no se puede deshacer.')) return;
    
    try {
      await fetch('http://localhost:8000/api/games/all', { method: 'DELETE' });
      setGames([]);
      fetchGenres(); // Refresh counts
    } catch (err) {
      alert('Error al borrar todos los juegos');
    }
  };

  const handleToggleVisibility = async (game) => {
    try {
      const response = await fetch(`http://localhost:8000/api/games/${game.id}/toggle-visibility`, {
        method: 'PATCH',
      });
      const updatedGame = await response.json();
      setGames(games.map(g => g.id === game.id ? updatedGame : g));
    } catch (err) {
      alert('Error al cambiar la visibilidad');
    }
  };

  const handleSaveGame = async (targetFormData) => {
    const url = selectedGame 
      ? `http://localhost:8000/api/games/${selectedGame.id}` 
      : 'http://localhost:8000/api/games';
    
    // Laravel handles multipart/form-data better with POST + _method=PUT
    const method = 'POST';
    if (selectedGame) {
      targetFormData.append('_method', 'PUT');
    }

    try {
      const response = await fetch(url, {
        method,
        body: targetFormData
      });
      
      if (!response.ok) throw new Error('Error saving game');
      
      const savedGame = await response.json();
      
      if (selectedGame) {
        setGames(games.map(g => g.id === selectedGame.id ? savedGame : g));
      } else {
        setGames([savedGame, ...games]);
      }
      fetchGenres(); // Refresh counts
      setIsModalOpen(false);
      setSelectedGame(null);
    } catch (err) {
      alert('Error al guardar el juego');
    }
  };

  const handleSaveGenre = async (genreData) => {
    const url = selectedGenre 
      ? `http://localhost:8000/api/genres/${selectedGenre.id}` 
      : 'http://localhost:8000/api/genres';
    const method = selectedGenre ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genreData)
      });
      
      if (!response.ok) throw new Error('Error saving category');
      
      const savedGenre = await response.json();
      
      if (selectedGenre) {
        setAllGenres(allGenres.map(g => g.id === selectedGenre.id ? savedGenre : g));
      } else {
        setAllGenres([...allGenres, savedGenre]);
      }
      setIsGenreModalOpen(false);
      setSelectedGenre(null);
    } catch (err) {
      alert('Error al guardar la categoría');
    }
  };

  const handleDeleteGenre = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar esta categoría?')) return;
    
    try {
      await fetch(`http://localhost:8000/api/genres/${id}`, { method: 'DELETE' });
      setAllGenres(allGenres.filter(g => g.id !== id));
    } catch (err) {
      alert('Error al borrar la categoría');
    }
  };

  const handleDeleteAllGenres = async () => {
    if (!window.confirm('¡ATENCIÓN! ¿Estás seguro de que quieres borrar TODAS las categorías? Esto desvinculará todos los juegos.')) return;
    
    try {
      await fetch('http://localhost:8000/api/genres/all', { method: 'DELETE' });
      setAllGenres([]);
    } catch (err) {
      alert('Error al borrar todas las categorías');
    }
  };

  const openAddModal = () => {
    if (view === 'games') {
      setSelectedGame(null);
      setIsModalOpen(true);
    } else {
      setSelectedGenre(null);
      setIsGenreModalOpen(true);
    }
  };

  const openEditModal = (item) => {
    if (view === 'games') {
      setSelectedGame(item);
      setIsModalOpen(true);
    } else {
      setSelectedGenre(item);
      setIsGenreModalOpen(true);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="admin-page">
        <Link to="/" className="admin-back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Volver al Catálogo
        </Link>
        <div className="admin-login-container">
          <form className="admin-login-card" onSubmit={handleLogin}>
            <h2>Panel de Administración</h2>
            <input
              type="password"
              className="password-input"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <button type="submit" className="login-btn">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Link to="/" className="admin-back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Volver al Catálogo
      </Link>
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-title-row">
            <h1>Panel de <span className="gradient-text">Administración</span></h1>
            <button 
              className="view-toggle-btn" 
              onClick={() => setView(view === 'games' ? 'categories' : 'games')}
              title={view === 'games' ? 'Gestionar Categorías' : 'Gestionar Juegos'}
            >
              {view === 'games' ? '⚙️ Categorías' : '🎮 Juegos'}
            </button>
            <button 
              className="view-toggle-btn btn-scraper" 
              onClick={() => setIsScraperModalOpen(true)}
              title="Configuración del Scraper"
            >
              🕷️ Scraper
            </button>
          </div>
          <div className="admin-actions">
            <button className="btn-delete-all" onClick={view === 'games' ? handleDeleteAll : handleDeleteAllGenres}>
              Borrar Todo
            </button>
            <button className="btn-add" onClick={openAddModal}>
              <span style={{ fontSize: '20px' }}>+</span> Añadir {view === 'games' ? 'Juego' : 'Categoría'}
            </button>
          </div>
        </header>

        <div className="games-table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Cargando datos...</div>
          ) : view === 'games' ? (
            <table className="games-table">
              <thead>
                <tr>
                  <th>Juego</th>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Visibilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game.id}>
                    <td>
                      <img 
                        src={game.cover_image || 'https://via.placeholder.com/150'} 
                        alt={game.name} 
                        className="game-img"
                      />
                    </td>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>#{game.id}</td>
                    <td style={{ fontWeight: 600 }}>{game.name}</td>
                    <td>
                      <span className={`status-badge ${game.is_visible !== false ? 'status-visible' : 'status-hidden'}`}>
                        {game.is_visible !== false ? 'Visible' : 'Oculto'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="action-icon-btn btn-edit" title="Editar" onClick={() => openEditModal(game)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="action-icon-btn btn-toggle" title="Ocultar/Mostrar" onClick={() => handleToggleVisibility(game)}>
                          {game.is_visible !== false ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          )}
                        </button>
                        <button className="action-icon-btn btn-delete" title="Borrar" onClick={() => handleDelete(game.id)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="games-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Categoría</th>
                  <th>Juegos Vinculados</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allGenres.map(genre => (
                  <tr key={genre.id}>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>#{genre.id}</td>
                    <td style={{ fontWeight: 600 }}>{genre.name}</td>
                    <td style={{ color: '#94a3b8' }}>
                      {genre.games_count ?? 0} videojuegos
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="action-icon-btn btn-edit" title="Editar" onClick={() => openEditModal(genre)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="action-icon-btn btn-delete" title="Borrar" onClick={() => handleDeleteGenre(genre.id)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <GameModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedGame(null); }}
        onSave={handleSaveGame} 
        game={selectedGame}
        allGenres={allGenres}
      />
      <GenreModal
        isOpen={isGenreModalOpen}
        onClose={() => { setIsGenreModalOpen(false); setSelectedGenre(null); }}
        onSave={handleSaveGenre}
        genre={selectedGenre}
      />
      <ScraperModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
      />
    </div>
  );
}

export default AdminPage;
