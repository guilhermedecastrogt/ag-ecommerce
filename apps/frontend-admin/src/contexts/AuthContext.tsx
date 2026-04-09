"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loginAdmin } from "@/lib/api";

interface AuthState {
  accessToken: string | null;
  email: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const KEY_TOKEN = "admin_access_token";
const KEY_EMAIL = "admin_email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    email: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem(KEY_TOKEN);
    const email = localStorage.getItem(KEY_EMAIL);
    setState({
      accessToken: token,
      email,
      isLoading: false,
      isAuthenticated: !!token,
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await loginAdmin(email, password);
    localStorage.setItem(KEY_TOKEN, accessToken);
    localStorage.setItem(KEY_EMAIL, email);
    setState({ accessToken, email, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_EMAIL);
    setState({ accessToken: null, email: null, isLoading: false, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
