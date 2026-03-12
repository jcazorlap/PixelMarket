import React from 'react';
import GameCard from './GameCard';

const GameList = ({ games, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
        <h2>Cargando los mejores precios...</h2>
      </div>
    );
  }

  return (
    <div className="game-grid">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameList;
