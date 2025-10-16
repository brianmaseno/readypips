'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth-context';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEmailVerificationError, setIsEmailVerificationError] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();

  // Get redirect URL from search params
  const redirectTo = searchParams.get('redirect') || '/signals';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log('✅ User already authenticated, redirecting to:', redirectTo);
      router.push(redirectTo);
    }
  }, [user, authLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsEmailVerificationError(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        toast.success('Welcome back!');
        router.push(redirectTo);
      } else {
        const errorMessage = data.error || 'Login failed';
        setError(errorMessage);
        
        // Check if it's an email verification error
        if (errorMessage.includes('verify your email address')) {
          setIsEmailVerificationError(true);
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    setIsResendingVerification(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification email sent successfully!');
        setIsEmailVerificationError(false);
        setError('');
      } else {
        toast.error(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="relative h-10">
            <img 
              src="/logo-light.png" 
              alt="Ready Pips Logo" 
              className="h-10 w-auto dark:hidden"
            />
            <img 
              src="/logo-dark.png" 
              alt="Ready Pips Logo" 
              className="h-10 w-auto hidden dark:block"
            />
          </Link>
        </div>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sign in to access your trading signals dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-black dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-black dark:text-white"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                  {isEmailVerificationError && (
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        Need a new verification email?
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={isResendingVerification}
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        {isResendingVerification ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Resend Verification Email
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">{`Don't have an account?`}</span>
              <Link href="/register" className="text-green-600 hover:text-green-700 hover:underline">
                Create one
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}