import React, { useEffect, useRef, useState } from 'react';
import './DinoGame.css';
import { useAuth } from '../context/AuthContext';

const DinoGame = () => {
  const { user, token, register } = useAuth(); // Assume register is actually the update function if needed, but let's check AuthContext
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  // Use a local ref for highScore to avoid stale state in the game loop
  const localHighScore = useRef(parseInt(localStorage.getItem('pixelDinoHighScore')) || 0);
  const [displayHighScore, setDisplayHighScore] = useState(localHighScore.current);

  // Sync with user data if logged in
  useEffect(() => {
    if (user && user.dino_high_score > localHighScore.current) {
      localHighScore.current = user.dino_high_score;
      setDisplayHighScore(user.dino_high_score);
      localStorage.setItem('pixelDinoHighScore', user.dino_high_score.toString());
    }
  }, [user]);

  const gameState = useRef({
    // ... (rest of the initial state remains the same)
    player: {
      x: 50,
      y: 200,
      width: 30,
      height: 30,
      color: '#00f2fe',
      dy: 0,
      jumpForce: 15,
      gravity: 0.8,
      grounded: false,
    },
    obstacles: [],
    frame: 0,
    speed: 4,
    isRunning: true,
  });

  const spawnObstacle = () => {
    const size = 30;
    gameState.current.obstacles.push({
      x: 800,
      y: 230 - size,
      width: size,
      height: size,
      color: '#ff0844',
    });
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameOver) {
        restartGame();
      } else if (gameState.current.player.grounded) {
        gameState.current.player.dy = -gameState.current.player.jumpForce;
        gameState.current.player.grounded = false;
      }
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    gameState.current = {
      player: {
        x: 50,
        y: 200,
        width: 30,
        height: 30,
        color: '#00f2fe',
        dy: 0,
        jumpForce: 15,
        gravity: 0.8,
        grounded: false,
      },
      obstacles: [],
      frame: 0,
      speed: 4,
      isRunning: true,
    };
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const update = () => {
      const state = gameState.current;

      if (state.isRunning) {
        const player = state.player;

        // Player Physics
        player.dy += player.gravity;
        player.y += player.dy;

        // Ground collision
        if (player.y + player.height > 230) {
          player.y = 230 - player.height;
          player.dy = 0;
          player.grounded = true;
        }

        // Obstacle spawning
        state.frame++;
        if (state.frame % Math.max(70, 150 - Math.floor(state.speed * 5)) === 0) {
          spawnObstacle();
        }

        // Move obstacles
        state.obstacles.forEach((obs, index) => {
          obs.x -= state.speed;

          // Collision detection
          if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
          ) {
            state.isRunning = false;
            setGameOver(true);
          }

          // Remove off-screen obstacles
          if (obs.x + obs.width < 0) {
            state.obstacles.splice(index, 1);
            setScore(s => {
              const newScore = s + 1;
              if (newScore > localHighScore.current) {
                localHighScore.current = newScore;
                setDisplayHighScore(newScore);
                localStorage.setItem('pixelDinoHighScore', newScore.toString());
                
                // Sync with backend if logged in
                if (user && token) {
                  fetch('http://localhost:8000/api/me/dino-score', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ score: newScore })
                  }).catch(err => console.error("Error syncing score:", err));
                }
              }
              return newScore;
            });
            // Gradually increase speed
            state.speed += 0.1;
          }
        });
      }

      render();
      animationFrameId = requestAnimationFrame(update);
    };

    const render = () => {
      const state = gameState.current;
      const player = state.player;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Ground
      ctx.beginPath();
      ctx.moveTo(0, 230);
      ctx.lineTo(800, 230);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Player (Cube with glow)
      ctx.shadowBlur = 15;
      ctx.shadowColor = player.color;
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw Obstacles (Spikes with glow)
      state.obstacles.forEach(obs => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = obs.color;
        ctx.fillStyle = obs.color;

        // Draw as a triangle (spike)
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
      });
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="dino-game-container">
      <div className="dino-game-info">
        <div className="dino-game-score">Puntos: {score}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Récord: {displayHighScore}</div>
      </div>

      <canvas
        ref={canvasRef}
        className="dino-game-canvas"
        width={800}
        height={300}
      />

      {!gameOver && <div className="dino-game-instructions">Pulsa ESPACIO para saltar</div>}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-status-text">
            <h2>FIN DE LA PARTIDA</h2>
            <p>Has conseguido {score} puntos</p>
          </div>
          <button className="restart-button" onClick={restartGame}>
            INTENTAR DE NUEVO
          </button>
        </div>
      )}
    </div>
  );
};

export default DinoGame;
