/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(undefined);

const TOKEN_KEY = 'queueit_token';
const USER_KEY = 'queueit_user';
const GUEST_ID_KEY = 'queueit_guest_id';

const getOrCreateGuestId = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'guest_anon';
  }
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [isLoading, setIsLoading] = useState(true);

  const setGuestFallback = useCallback(() => {
    const guestId = getOrCreateGuestId();
    const guestUser = {
      id: guestId,
      name: 'Guest User',
      email: '',
      role: 'guest',
    };
    setUser(guestUser);
    setToken(null);
  }, []);

  // Hydrate user session on mount
  useEffect(() => {
    const hydrateUser = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res && res.user) {
            setUser(res.user);
            setToken(storedToken);
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          } else {
            throw new Error('Invalid user payload');
          }
        } catch (error) {
          console.warn('[AuthContext]: Failed to hydrate user via /auth/me:', error.message);
          // Attempt stored user fallback or guest fallback
          const storedUser = localStorage.getItem(USER_KEY);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              setGuestFallback();
            }
          } else {
            setGuestFallback();
          }
        }
      } else {
        setGuestFallback();
      }
      setIsLoading(false);
    };

    hydrateUser();
  }, [setGuestFallback]);

  /**
   * Login user with email & password
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async ({ name, email, password, role }) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password, role });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create backend guest session
   */
  const guestLogin = async (guestName) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/guest', { guestName });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (error) {
      console.warn('[AuthContext]: Backend guest session creation failed, using local guest fallback:', error.message);
      setGuestFallback();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Legacy / local guest login helper
   */
  const loginAsGuest = (nickname) => {
    guestLogin(nickname);
  };

  /**
   * Google OAuth login helper fallback
   */
  const loginWithGoogle = async () => {
    return login('admin@queueit.app', 'admin123');
  };

  /**
   * Logout user and reset to guest session
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setGuestFallback();
    toast.success('Logged out successfully');
  };

  /**
   * Developer role switcher helper
   */
  const setUserRole = (role) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const isAuthenticated = Boolean(user && user.role !== 'guest');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        guestLogin,
        loginAsGuest,
        loginWithGoogle,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
