import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, clearAuth } from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: FrontendUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; profilePic?: File | null }) => Promise<void>;
}

export interface FrontendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic: string;
  referralEmail: string;
  position: "left" | "right";
  paymentMethod: "easypaisa" | "jazzcash";
  isActive: boolean;
  leftTeam: number;
  rightTeam: number;
  currentIncome: number;
  rewardIncome: number;
  totalWithdraw: number;
  availablePins?: number;
  pairCount?: number;
  isApproved?: boolean;
  joinedAt?: string;
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
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = (raw: any): FrontendUser => ({
    id: String(raw.id),
    firstName: raw.first_name || "",
    lastName: raw.last_name || "",
    email: raw.email || "",
    phone: raw.phone || "",
    profilePic: raw.profile_picture || "",
    referralEmail: raw.referral_email || "",
    position: raw.placement_side || "left",
    paymentMethod: raw.payment_method || "easypaisa",
    isActive: Boolean(raw.is_active),
    leftTeam: raw.left_team_count || 0,
    rightTeam: raw.right_team_count || 0,
    currentIncome: raw.current_income || 0,
    rewardIncome: raw.reward_income || 0,
    totalWithdraw: raw.total_withdrawn || 0,
    availablePins: raw.available_pins || 0,
    pairCount: raw.pair_count || 0,
    isApproved: Boolean(raw.is_approved),
    joinedAt: raw.created_at || "",
  });

  const refreshUser = async () => {
    const raw = await api("/api/accounts/me/");
    if (!raw.is_active) {
      clearAuth();
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
      throw new Error("Account is deactivated. Please contact admin.");
    }
    const mapped = mapUser(raw);
    setUser(mapped);
    setIsLoggedIn(true);
    setIsAdmin(Boolean(raw.is_staff));
  };

  const login = async (email: string, password: string) => {
    const data = await api("/api/auth/token/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    await refreshUser();
    setIsAdmin(false);
    return true;
  };

  const adminLogin = async (username: string, password: string) => {
    const data = await api("/api/auth/token/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    await refreshUser();
    return true;
  };

  const logout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; profilePic?: File | null }) => {
    const form = new FormData();
    if (data.firstName !== undefined) form.append("first_name", data.firstName);
    if (data.lastName !== undefined) form.append("last_name", data.lastName);
    if (data.profilePic) form.append("profile_picture", data.profilePic);
    await api("/api/accounts/me/", { method: "PATCH", body: form });
    await refreshUser();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    refreshUser()
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, loading, login, adminLogin, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
