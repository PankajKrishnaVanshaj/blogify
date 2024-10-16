"use client"; // Ensure it's at the top

import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "@/api/auth.api"; // Import API logic

export const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to set user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
