import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const init = useCallback(async () => {
    const token = localStorage.getItem('sgm_token');
    if (!token) { setLoading(false); return; }
    try {
      const data = await authApi.getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('sgm_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { init(); }, [init]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('sgm_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (credentials) => {
    const data = await authApi.register(credentials);
    localStorage.setItem('sgm_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sgm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
