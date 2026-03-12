import React from 'react';
import GameCard from './GameCard';

import LoadingSpinner from './LoadingSpinner';

const GameList = ({ games, loading }) => {
  if (loading) return <LoadingSpinner />;

  return (
    <div className="game-grid">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameList;
