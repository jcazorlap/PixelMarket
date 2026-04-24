import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = '/api';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Detectar el token del callback de Google
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const googleErr = params.get('error');

    if (token) {
      login(token).then(() => {
        navigate('/perfil');
      });
    }

    if (googleErr === 'google_failed') {
      setError('Error al iniciar sesión con Google.');
    }
  }, [login, navigate, refreshUser]);

  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/login' : '/register';
      const body = tab === 'login'
        ? { email, password }
        : { name, email, password, password_confirmation: confirm };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const msgs = data.errors
          ? Object.values(data.errors).flat().join(' ')
          : data.message || 'Ha ocurrido un error.';
        setError(msgs);
        return;
      }

      login(data.token, data.user);
      navigate('/perfil');
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / encabezado */}
        <div className="auth-logo">
          <span className="gradient-text">PIXEL</span>MARKET
        </div>

        {/* Pestañas */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Iniciar sesión
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? 'Cargando...'
              : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-divider">
          <span>O bien</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
