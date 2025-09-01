import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

// Initialize Firebase Auth

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoggedIn(!!user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in function
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const value = {
    user,
    loggedIn,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
