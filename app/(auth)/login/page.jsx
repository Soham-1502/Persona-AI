'use client';

import Link from 'next/link';
import SignInForm from './signin-form';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleLogin = async (credentialResponse) => {
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
        setError(responseData.message || 'Google login failed');
        toast.error('Google login failed');
        return;
      }

      localStorage.setItem('token', responseData.data);
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to login with Google');
      toast.error('Failed to login with Google');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] flex rounded-2xl shadow-2xl overflow-hidden bg-card">
        {/* Left Side - Sign In Form */}
        <div className="flex-[2] flex flex-col items-center justify-center bg-card px-8 py-12 sm:px-16">
          <div className="w-full max-w-[370px] space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-foreground font-bold text-3xl sm:text-4xl mb-3">
                Login to Your Account
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email and password to sign in!
              </p>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setError('Google login failed');
                  toast.error('Google login failed');
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

            {/* Sign In Form */}
            <SignInForm />

            {/* Error Message */}
            {error && (
              <div className="w-full px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Sign Up Prompt */}
        <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center gradient-persona-primary p-8 text-center">
          <h1 className="text-white font-bold text-3xl sm:text-4xl mb-6">
            New Here?
          </h1>
          <p className="text-white/90 mb-8 text-sm max-w-xs">
            Create an account to access all features and start your journey with us!
          </p>
          <Link href="/signup">
            <button
              type="button"
              className="bg-white text-primary hover:bg-white/90 transition-colors duration-200 py-3 px-8 font-bold text-sm rounded-full shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Sign Up Link */}
      <div className="lg:hidden fixed bottom-8 left-0 right-0 text-center">
        <p className="text-muted-foreground text-sm mb-2">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}