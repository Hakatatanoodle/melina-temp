import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service.js';

/**
 * Client-side authentication state.
 *
 * The backend owns authentication — this context only caches "who is logged
 * in" for the UI, restored on page load via the HttpOnly cookie + /auth/me.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authed | guest

  useEffect(() => {
    let active = true;
    authService
      .me()
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          setUser(data.user);
          setStatus('authed');
        } else {
          setStatus('guest');
        }
      })
      .catch(() => {
        if (active) setStatus('guest');
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => {
    async function login(email, password) {
      const data = await authService.login(email, password);
      setUser(data.user);
      setStatus('authed');
      return data.user;
    }

    async function register(payload) {
      const data = await authService.register(payload);
      setUser(data.user);
      setStatus('authed');
      return data.user;
    }

    async function logout() {
      try {
        await authService.logout();
      } catch {
        // Clearing local state matters more than a failed logout call.
      }
      setUser(null);
      setStatus('guest');
    }

    return { user, status, login, register, logout };
  }, [user, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
