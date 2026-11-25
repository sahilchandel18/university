import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticateUser, initializeDatabase, getUserById } from '../lib/database';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string, expectedRole?: User['role'], expectedDept?: User['department']) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDatabase();
    const savedUser = localStorage.getItem('dav_portal_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const fresh = getUserById(parsed.id);
        setUser(fresh || parsed);
      } catch {
        localStorage.removeItem('dav_portal_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (
    username: string,
    password: string,
    expectedRole?: User['role'],
    expectedDept?: User['department']
  ) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    const authenticatedUser = authenticateUser(username, password);
    if (authenticatedUser) {
      if (expectedRole && authenticatedUser.role !== expectedRole) {
        setIsLoading(false);
        return { success: false, error: `Please use the ${authenticatedUser.role} sign-in tab for this account.` };
      }
      if (expectedDept && authenticatedUser.role === 'faculty' && authenticatedUser.department !== expectedDept) {
        setIsLoading(false);
        return { success: false, error: `These credentials belong to the ${authenticatedUser.department} department, not ${expectedDept}.` };
      }
      setUser(authenticatedUser);
      localStorage.setItem('dav_portal_current_user', JSON.stringify(authenticatedUser));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid credentials. Please check your username and password.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dav_portal_current_user');
  }, []);

  const refreshUser = useCallback(() => {
    if (user) {
      const fresh = getUserById(user.id);
      if (fresh) {
        setUser(fresh);
        localStorage.setItem('dav_portal_current_user', JSON.stringify(fresh));
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
