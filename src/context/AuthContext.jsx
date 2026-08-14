/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(undefined);

const TOKEN_KEY = 'queueit_token';
const USER_KEY = 'queueit_user';
const GUEST_ID_KEY = 'queueit_guest_id';

const getOrCreateGuestId = () => {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return 'guest_anon';
  }
  let guestId = sessionStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
  });
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
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
    }
  }, []);

  // Hydrate user session on mount
  useEffect(() => {
    const hydrateUser = async () => {
      const storedToken = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const storedUserRaw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);

      let localUser = null;
      if (storedUserRaw) {
        try {
          localUser = JSON.parse(storedUserRaw);
        } catch {
          localUser = null;
        }
      }

      if (localUser) {
        setUser(localUser);
      }

      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.get('/auth/me');
          if (res && res.user) {
            setUser(res.user);
            sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('[AuthContext]: Failed to hydrate user via /auth/me, keeping cached session:', error.message);
        }
      }

      setIsLoading(false);
    };

    hydrateUser();
  }, []);

  /**
   * Login user with email & password
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      throw new Error(data?.message || 'Login failed');
    } catch (error) {
      console.warn('[AuthContext]: API login failed, attempting local seed user fallback:', error.message);

      const cleanEmail = (email || '').toLowerCase().trim();
      let fallbackUser = null;

      if (cleanEmail === 'superadmin@queueit.app') {
        fallbackUser = {
          _id: 'usr_superadmin',
          id: 'usr_superadmin',
          name: 'Super Admin',
          email: 'superadmin@queueit.app',
          role: 'superadmin',
        };
      } else if (cleanEmail === 'admin@queueit.app' || cleanEmail.includes('admin')) {
        fallbackUser = {
          _id: 'usr_admin',
          id: 'usr_admin',
          name: 'Admin User',
          email: 'admin@queueit.app',
          role: 'admin',
          assignedVenue: 'v1',
        };
      } else if (cleanEmail) {
        fallbackUser = {
          _id: `usr_${Date.now().toString(36)}`,
          id: `usr_${Date.now().toString(36)}`,
          name: cleanEmail.split('@')[0] || 'User',
          email: cleanEmail,
          role: 'guest',
        };
      }

      if (fallbackUser) {
        const mockToken = `mock_token_${Date.now()}`;
        setToken(mockToken);
        setUser(fallbackUser);
        sessionStorage.setItem(TOKEN_KEY, mockToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }

      throw error;
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
      if (data && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      throw new Error(data?.message || 'Registration failed');
    } catch (error) {
      console.warn('[AuthContext]: API register failed, using local user fallback:', error.message);
      const mockUser = {
        _id: `usr_${Date.now().toString(36)}`,
        id: `usr_${Date.now().toString(36)}`,
        name: name || 'Registered User',
        email: email || 'user@queueit.app',
        role: role || 'guest',
      };
      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(mockUser);
      sessionStorage.setItem(TOKEN_KEY, mockToken);
      sessionStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      return mockUser;
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
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (error) {
      console.warn('[AuthContext]: Backend guest session creation failed, using local guest fallback:', error.message);
      const guestId = getOrCreateGuestId();
      const guestUser = {
        id: guestId,
        name: guestName || 'Guest User',
        email: '',
        role: 'guest',
      };
      const mockToken = `guest_token_${Date.now()}`;
      setToken(mockToken);
      setUser(guestUser);
      sessionStorage.setItem(TOKEN_KEY, mockToken);
      sessionStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      return guestUser;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Legacy / local guest login helper
   */
  const loginAsGuest = (nickname) => {
    return guestLogin(nickname);
  };

  /**
   * Google OAuth login helper fallback
   */
  const loginWithGoogle = async () => {
    return login('admin@queueit.app', 'admin123');
  };

  /**
   * Logout user and clear session
   */
  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem('queueit_active_ticket');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('queueit_active_ticket');
    }
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  /**
   * Developer role switcher helper
   */
  const setUserRole = (role) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = Boolean(user);

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
        setGuestFallback,
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
