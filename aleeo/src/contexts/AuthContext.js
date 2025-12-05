import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkCurrentUser, logout as apiLogout } from '../utility/apiUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if we have stored user data
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }

        // Then verify with the server
        const currentUser = await checkCurrentUser();
        if (currentUser) {
          setUserData(currentUser);
          localStorage.setItem('userData', JSON.stringify(currentUser));
        } else {
          // If no current user from server, clear stored data
          setUserData(null);
          localStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUserData(null);
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (user) => {
    setUserData(user);
    localStorage.setItem('userData', JSON.stringify(user));
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUserData(null);
      localStorage.removeItem('userData');
    }
  };

  const value = {
    userData,
    login,
    logout,
    loading,
    isAuthenticated: !!userData && !loading // More robust check
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};