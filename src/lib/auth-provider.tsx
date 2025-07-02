'use client';
import React, { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, userRole: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock auth state for development to bypass login
  const value = {
    user: {
      uid: 'dev-user-id',
      email: 'developer@example.com',
    } as User,
    userRole: 'admin',
    loading: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
