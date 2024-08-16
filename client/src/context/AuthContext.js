// AuthContext.js
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Create the AuthContext with default values
const AuthContext = createContext({ user: null });

// AuthProvider component to provide auth state to children
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = Cookies.get("token");

  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get(
            "http://localhost:55555/api/v1/auth/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
