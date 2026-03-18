import React from 'react';
import GameCard from './GameCard';
import LoadingSpinner from './LoadingSpinner';
import DinoGame from './DinoGame';

const GameList = ({ games, loading }) => {
  if (loading) return <LoadingSpinner />;

  if (games.length === 0) {
    return <DinoGame />;
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
