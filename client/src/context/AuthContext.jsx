"use client"; 

import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, isAuthenticated, logout } from "@/api/auth.api";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status and fetch user
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const authStatus = await isAuthenticated();
      if (authStatus) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};