import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getCurrentUser, setCurrentUser, logout as logoutFromStorage } from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state directly from localStorage on mount
    return getCurrentUser();
  });

  useEffect(() => {
    // Listen for custom login event
    const handleLoginEvent = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    // Also check on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Listen for custom login events
    window.addEventListener('userLoggedIn', handleLoginEvent);
    
    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    setUser(null);
    logoutFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
