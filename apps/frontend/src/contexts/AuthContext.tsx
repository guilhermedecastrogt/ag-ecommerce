"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "@/lib/api";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem("aguia_access_token");
      const userJson = localStorage.getItem("aguia_user");
      if (token && userJson) {
        setState({
          user: JSON.parse(userJson),
          accessToken: token,
          isLoading: false,
        });
        return;
      }
    } catch {
      /* ignore parse errors */
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const persist = useCallback(
    (user: AuthUser, accessToken: string, refreshToken: string) => {
      localStorage.setItem("aguia_access_token", accessToken);
      localStorage.setItem("aguia_refresh_token", refreshToken);
      localStorage.setItem("aguia_user", JSON.stringify(user));
      setState({ user, accessToken, isLoading: false });
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken, refreshToken } = await apiLogin(email, password);
      // Derive name from email until profile endpoint is available
      const name = email.split("@")[0];
      persist({ name, email }, accessToken, refreshToken);
    },
    [persist]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { accessToken, refreshToken } = await apiRegister(
        name,
        email,
        password
      );
      persist({ name, email }, accessToken, refreshToken);
    },
    [persist]
  );

  const logout = useCallback(async () => {
    const token = state.accessToken;
    localStorage.removeItem("aguia_access_token");
    localStorage.removeItem("aguia_refresh_token");
    localStorage.removeItem("aguia_user");
    setState({ user: null, accessToken: null, isLoading: false });
    if (token) await apiLogout(token).catch(() => {});
  }, [state.accessToken]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.user && !!state.accessToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
