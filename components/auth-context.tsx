'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionType: 'basic' | 'premium' | 'pro' | null;
  subscriptionEndDate?: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('🔐 Checking authentication...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found in localStorage');
        setLoading(false);
        return;
      }

      console.log('📡 Making auth verification request...');
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🔑 Auth response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Auth successful, user data:', data.user);
        setUser(data.user);
      } else {
        console.log('❌ Auth failed, removing token');
        localStorage.removeItem('token');
        localStorage.removeItem('returnUrl');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('returnUrl');
    } finally {
      console.log('🏁 Setting auth loading to false');
      setLoading(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    checkAuth();
    
    // Get return URL or default to signals page
    const returnUrl = localStorage.getItem('returnUrl') || '/signals';
    localStorage.removeItem('returnUrl');
    
    // Redirect to previous page or signals
    window.location.href = returnUrl;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('returnUrl');
    setUser(null);
  };

  useEffect(() => {
    // Store current URL before page refresh (only on client)
    if (typeof window !== 'undefined') {
      // Set return URL if user is being redirected
      const handleBeforeUnload = () => {
        if (user) {
          localStorage.setItem('returnUrl', window.location.pathname);
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      checkAuth();
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  // Redirect to previous page after auth check completes
  useEffect(() => {
    if (!loading && user) {
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl && returnUrl !== window.location.pathname) {
        localStorage.removeItem('returnUrl');
        window.location.href = returnUrl;
      }
    }
  }, [loading, user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 