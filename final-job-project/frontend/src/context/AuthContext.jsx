import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        setUser(JSON.parse(savedUser));
      }

      if (savedToken && savedToken !== 'undefined' && savedToken !== 'null') {
        setToken(savedToken);
      }
    } catch (error) {
      console.error('AuthContext parse error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const saveAuth = (data) => {
    const userData = data?.user || null;
    const authToken = data?.token || '';

    if (!userData || !authToken) {
      throw new Error('Invalid login response');
    }

    login(userData, authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const refreshProfile = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const { data } = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else if (data) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Refresh profile failed:', error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      saveAuth,
      logout,
      refreshProfile,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default AuthContext;