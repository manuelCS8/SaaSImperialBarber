import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { login as apiLogin } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'imperial_token';
const USER_KEY = 'imperial_user';

function readStored<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => readStored<User>(USER_KEY));

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    async login(email, password) {
      const result = await apiLogin(email, password);
      setToken(result.accessToken);
      setUser(result.user);
      sessionStorage.setItem(TOKEN_KEY, result.accessToken);
      sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
    },
    logout() {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    },
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
