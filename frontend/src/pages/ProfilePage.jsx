import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:8000/api';

export default function ProfilePage() {
  const { user, token, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg(''); setProfileErr('');
    setSaving(true);
    try {
      const res = await fetch(`${API}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
        setProfileErr(msgs);
        return;
      }
      await refreshUser();
      setProfileMsg('¡Datos actualizados correctamente!');
    } catch {
      setProfileErr('Error al conectar con el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdMsg(''); setPwdErr('');
    setSaving(true);
    try {
      const res = await fetch(`${API}/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPwd,
          password: newPwd,
          password_confirmation: confirmPwd,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
        setPwdErr(msgs);
        return;
      }
      setPwdMsg('¡Contraseña actualizada!');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch {
      setPwdErr('Error al conectar con el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-title">Hola, <span className="gradient-text">{user.name}</span></h1>

        {/* Datos del perfil */}
        <div className="profile-card">
          <h2 className="profile-section-title">Datos de perfil</h2>
          <form onSubmit={handleProfileSave} className="auth-form">
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {profileErr && <div className="auth-error">{profileErr}</div>}
            {profileMsg && <div className="auth-success">{profileMsg}</div>}
            <button type="submit" className="auth-submit-btn" disabled={saving}>
              Guardar cambios
            </button>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div className="profile-card">
          <h2 className="profile-section-title">Cambiar contraseña</h2>
          <form onSubmit={handlePasswordSave} className="auth-form">
            <div className="form-group">
              <label>Contraseña actual</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Nueva contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar nueva contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
              />
            </div>
            {pwdErr && <div className="auth-error">{pwdErr}</div>}
            {pwdMsg && <div className="auth-success">{pwdMsg}</div>}
            <button type="submit" className="auth-submit-btn" disabled={saving}>
              Cambiar contraseña
            </button>
          </form>
        </div>

        {/* Cerrar sesión */}
        <button className="logout-btn" onClick={handleLogout}>
          ⎋ Cerrar sesión
        </button>
      </div>
    </div>
  );
}
