import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Catalog from './components/Catalog'
import GameDetail from './components/GameDetail'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/"        element={<Catalog />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/perfil"  element={<ProfilePage />} />
      </Routes>
      <footer style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: 'auto', color: 'var(--text-muted)' }}>
        <p>© 2026 PixelMarket. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
