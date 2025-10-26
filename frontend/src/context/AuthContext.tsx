import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, setAuthToken } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: { name: string; email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getMe();
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials);
    setAuthToken(response.token);
    setUser(response.user);
    return response;
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    const response = await authAPI.register(userData);
    setAuthToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const isAdmin = () => user !== null && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
