import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = 'http://localhost:8000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pm_token'));
  const [loading, setLoading] = useState(true);

  // On mount, validate stored token
  useEffect(() => {
    if (token) {
      fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('pm_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (newToken, userData) => {
    setLoading(true);
    localStorage.setItem('pm_token', newToken);
    setToken(newToken);
    
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else {
      // Fetch user data if not provided (e.g., Google login)
      try {
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user after login", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    if (token) {
      await fetch(`${API}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => { });
    }
    localStorage.removeItem('pm_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    const res = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUser(await res.json());
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
