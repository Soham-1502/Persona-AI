'use client';

import Link from 'next/link';
import SignUpForm from './signup-form';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          googleId: decoded.sub,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.message || 'Google signup failed');
        toast.error('Google signup failed');
        return;
      }

      localStorage.setItem('token', responseData.data);
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }

      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Failed to signup with Google');
      toast.error('Failed to signup with Google');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-225 flex rounded-2xl shadow-2xl overflow-hidden bg-card">
        {/* Left Side - Sign Up Prompt */}
        <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center gradient-persona-primary p-8 text-center">
          <h1 className="text-white font-bold text-3xl sm:text-4xl mb-6">
            Welcome Back!
          </h1>
          <p className="text-white/90 mb-8 text-sm max-w-xs">
            Already have an account? Sign in to continue your journey with us!
          </p>
          <Link href="/login">
            <button
              type="button"
              className="bg-white text-primary hover:bg-white/90 transition-colors duration-200 py-3 px-8 font-bold text-sm rounded-full shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </Link>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-2 flex flex-col items-center justify-center bg-card px-8 py-12 sm:px-16">
          <div className="w-full max-w-92.5 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-foreground font-bold text-3xl sm:text-4xl mb-3">
                Create Account
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign up to get started with PersonaAI!
              </p>
            </div>

            {/* Google Sign Up */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => {
                  setError('Google signup failed');
                  toast.error('Google signup failed');
                }}
              />
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-muted-foreground bg-card">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Sign Up Form */}
            <SignUpForm />

            {/* Error Message */}
            {error && (
              <div className="w-full px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sign In Link */}
      <div className="lg:hidden fixed bottom-8 left-0 right-0 text-center">
        <p className="text-muted-foreground text-sm mb-2">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}