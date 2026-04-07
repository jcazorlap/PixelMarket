import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Catalog from './components/Catalog'
import GameDetail from './components/GameDetail'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import Footer from './components/Footer'
import './App.css'

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname === '/pxm_admin';

  useEffect(() => {
    // Clear admin auth session immediately whenever we navigate away from the admin route
    if (location.pathname !== '/pxm_admin') {
      sessionStorage.removeItem('pxm_admin_auth');
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="app-container">
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/pxm_admin" element={<AdminPage />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
