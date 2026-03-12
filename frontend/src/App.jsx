import { useState, useEffect } from 'react'
import Header from './components/Header'
import GameList from './components/GameList'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching games:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app-container">
      <Header />
      
      <main className="hero">
        <h1>Encuentra tu próximo juego <span className="gradient-text">al mejor precio</span></h1>
        <p>Comparamos los precios de las mejores tiendas digitales en tiempo real. No pierdas más el tiempo buscando, nosotros lo hacemos por ti.</p>
      </main>

      <GameList games={games} loading={loading} />

      <footer style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: 'auto', color: 'var(--text-muted)' }}>
        <p>© 2026 PixelMarket. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
