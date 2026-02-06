'use client';

import Link from 'next/link';
import SignInForm from './signin-form';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        // Get user info from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const userInfo = await userInfoResponse.json();

        // Send to your backend
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            googleId: userInfo.sub,
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
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed');
      toast.error('Google login failed');
    },
  });

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 auth-page-enter">
      <div className="w-full max-w-225 flex rounded-2xl shadow-2xl overflow-hidden bg-card">
        {/* Left Side - Sign In Form */}
        <div className="flex-2 flex flex-col items-center justify-center bg-card px-8 py-12 sm:px-16 auth-form-slide-left">
          <div className="w-full max-w-92.5 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-foreground font-bold text-3xl sm:text-4xl mb-3">
                Login to Your Account
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email and password to sign in!
              </p>
            </div>

            {/* Google Sign In - Custom Button */}
            <div className="flex justify-center">
              <button
                onClick={() => googleLogin()}
                disabled={isGoogleLoading}
                className="flex items-center justify-center gap-3 w-full max-w-xs px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19.8055 10.2292C19.8055 9.55056 19.7495 8.86717 19.6295 8.19788H10.2002V12.0488H15.6014C15.377 13.2911 14.6571 14.3898 13.6106 15.0879V17.5866H16.8248C18.7171 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                  <path d="M10.2002 20.0006C12.9515 20.0006 15.2664 19.1151 16.8294 17.5865L13.6152 15.0879C12.7362 15.6979 11.6044 16.0433 10.2049 16.0433C7.54355 16.0433 5.29065 14.2834 4.51927 11.9169H1.21582V14.4927C2.81488 17.8695 6.35427 20.0006 10.2002 20.0006Z" fill="#34A853"/>
                  <path d="M4.51459 11.9169C4.09045 10.6746 4.09045 9.33008 4.51459 8.08777V5.51196H1.21582C-0.154209 8.33808 -0.154209 11.6665 1.21582 14.4927L4.51459 11.9169Z" fill="#FBBC04"/>
                  <path d="M10.2002 3.95805C11.6794 3.936 13.1065 4.47247 14.1856 5.45722L17.0291 2.60289C15.1754 0.904767 12.7318 -0.0292369 10.2002 0.000549919C6.35427 0.000549919 2.81488 2.13165 1.21582 5.51197L4.51459 8.08778C5.28131 5.71655 7.53888 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
                </svg>
                <span className="text-gray-700 font-medium text-sm">
                  {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                </span>
              </button>
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
        <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center gradient-persona-primary p-8 text-center auth-form-slide-right">
          <h1 className="text-white font-bold text-3xl sm:text-4xl mb-6">
            New Here?
          </h1>
          <p className="text-white/90 mb-8 text-sm max-w-xs">
            Create an account to access all features and start your journey with us!
          </p>
          <Link href="/signup" className="transform transition-transform hover:scale-105">
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