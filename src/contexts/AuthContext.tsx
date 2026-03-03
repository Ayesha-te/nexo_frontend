import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockUser } from "@/lib/mock-data";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: typeof mockUser | null;
  login: (email: string, password: string) => boolean;
  adminLogin: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: { firstName?: string; lastName?: string; profilePic?: string }) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<typeof mockUser | null>(null);

  const login = (_email: string, _password: string) => {
    setUser({ ...mockUser });
    setIsLoggedIn(true);
    setIsAdmin(false);
    return true;
  };

  const adminLogin = (_email: string, _password: string) => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setUser(null);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  const updateProfile = (data: { firstName?: string; lastName?: string; profilePic?: string }) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, adminLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
