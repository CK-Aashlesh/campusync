'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/api/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error(error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      Cookies.set('token', res.data.token, { expires: 30 });
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      const userRes = await api.get('/api/auth/me');
      setUser(userRes.data.data);

      if (res.data.isTemporaryPassword) {
        router.push('/change-password');
      } else {
        const role = userRes.data.data.role;
        if (role === 'Student') {
          router.push('/');
        } else {
          router.push(`/${role.toLowerCase().replace(' ', '-')}`);
        }
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    Cookies.remove('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
