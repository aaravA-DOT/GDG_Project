"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "@/types";
import { DEMO_USERS, dbService } from "@/lib/services/db";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  loading: boolean;
  loginWithPhoneOtp: (phone: string, otp: string, role?: UserRole, name?: string) => Promise<boolean>;
  loginWithGoogle: (role?: UserRole) => Promise<boolean>;
  loginAsDemo: (targetRole: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize role cookie for Next.js middleware
  const syncRoleCookie = (role: string | null) => {
    if (typeof document !== "undefined") {
      if (role) {
        document.cookie = `krishibuddy_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      } else {
        document.cookie = "krishibuddy_role=; path=/; max-age=0; SameSite=Lax";
      }
    }
  };

  useEffect(() => {
    // Initial session retrieval from local storage
    const stored = localStorage.getItem("krishibuddy_current_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        setUser(parsed);
        syncRoleCookie(parsed.role);
      } catch (err) {
        console.error("Failed to parse stored user session", err);
      }
    } else {
      // Default to Gurvinder Singh (Farmer) for immediate out-of-the-box readiness
      const defaultFarmer = DEMO_USERS[0];
      setUser(defaultFarmer);
      localStorage.setItem("krishibuddy_current_user", JSON.stringify(defaultFarmer));
      syncRoleCookie(defaultFarmer.role);
    }
    setLoading(false);
  }, []);

  const loginAsDemo = async (targetRole: UserRole) => {
    setLoading(true);
    const matched = DEMO_USERS.find((u) => u.role === targetRole) || DEMO_USERS[0];
    const sessionUser = { ...matched, lastLogin: Date.now() };
    setUser(sessionUser);
    localStorage.setItem("krishibuddy_current_user", JSON.stringify(sessionUser));
    syncRoleCookie(sessionUser.role);
    await dbService.saveUser(sessionUser);
    setLoading(false);
  };

  const loginWithPhoneOtp = async (
    phone: string,
    otp: string,
    role: UserRole = "farmer",
    name: string = "Indian Farmer"
  ): Promise<boolean> => {
    setLoading(true);
    // Verified if OTP is 6 digits or matching simulation "123456"
    if (otp && (otp.length === 6 || otp === "123456")) {
      const newUser: UserProfile = {
        uid: `user-phone-${phone.replace(/[^0-9]/g, "").slice(-10)}`,
        name: name,
        phone: phone,
        language: "hi",
        role: role,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        state: "Punjab",
        district: "Ludhiana",
      };
      setUser(newUser);
      localStorage.setItem("krishibuddy_current_user", JSON.stringify(newUser));
      syncRoleCookie(newUser.role);
      await dbService.saveUser(newUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const loginWithGoogle = async (role: UserRole = "farmer"): Promise<boolean> => {
    setLoading(true);
    if (auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const gUser = result.user;
        const profile: UserProfile = {
          uid: gUser.uid,
          name: gUser.displayName || "Google Farmer",
          email: gUser.email || undefined,
          phone: gUser.phoneNumber || "+91 99887 76655",
          language: "en",
          role: role,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          avatarUrl: gUser.photoURL || undefined,
        };
        setUser(profile);
        localStorage.setItem("krishibuddy_current_user", JSON.stringify(profile));
        syncRoleCookie(profile.role);
        await dbService.saveUser(profile);
        setLoading(false);
        return true;
      } catch (err) {
        console.warn("Google popup auth error (falling back to simulated Google session):", err);
      }
    }

    // Simulated Google Login fallback
    const mockGoogleProfile: UserProfile = {
      uid: `google-${Date.now()}`,
      name: "Aarav Sharma (Verified Farmer)",
      email: "aarav.farmer@gmail.com",
      phone: "+91 98765 11223",
      language: "hi",
      role: role,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setUser(mockGoogleProfile);
    localStorage.setItem("krishibuddy_current_user", JSON.stringify(mockGoogleProfile));
    syncRoleCookie(mockGoogleProfile.role);
    await dbService.saveUser(mockGoogleProfile);
    setLoading(false);
    return true;
  };

  const logout = async () => {
    setLoading(true);
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn("Firebase signout fallback:", err);
      }
    }
    setUser(null);
    localStorage.removeItem("krishibuddy_current_user");
    syncRoleCookie(null);
    setLoading(false);
  };

  const updateUserRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem("krishibuddy_current_user", JSON.stringify(updated));
      syncRoleCookie(newRole);
      dbService.saveUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "farmer",
        loading,
        loginWithPhoneOtp,
        loginWithGoogle,
        loginAsDemo,
        logout,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
