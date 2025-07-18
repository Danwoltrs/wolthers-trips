'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export type UserRole = 'GLOBAL_ADMIN' | 'WOLTHERS_STAFF' | 'COMPANY_ADMIN' | 'CLIENT_ADMIN' | 'FINANCE_DEPARTMENT' | 'CLIENT' | 'DRIVER';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: UserRole;
  company?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: UserRole | null;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  // Clear error when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      setError(null);
    }
  }, [status]);

  // Handle session errors
  useEffect(() => {
    if (status === 'unauthenticated' && session === null) {
      // Check if there was an authentication error
      const urlParams = new URLSearchParams(window.location.search);
      const authError = urlParams.get('error');
      if (authError) {
        setError(`Authentication failed: ${authError}`);
      }
    }
  }, [status, session]);

  const user = session?.user as AuthUser | null;
  const isAuthenticated = status === 'authenticated' && !!user;
  const isLoading = status === 'loading';
  const role = user?.role as UserRole | null;

  const hasRole = (targetRole: UserRole): boolean => {
    return role === targetRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return role ? roles.includes(role) : false;
  };

  const signOut = async (): Promise<void> => {
    try {
      const { signOut } = await import('next-auth/react');
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    hasRole,
    hasAnyRole,
    signOut,
  };
}