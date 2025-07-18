'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    setError('');
    
    if (!isEmailEntered) {
      // First step: validate email or trip code
      if (inputValue.length === 0) {
        setError('Please enter your email or trip access code');
        return;
      }

      // Check if it's an email
      if (validateEmail(inputValue)) {
        setEmail(inputValue);
        setIsEmailEntered(true);
        setInputValue('');
      } else {
        // Assume it's a trip code
        setIsLoading(true);
        try {
          // TODO: Implement trip code authentication
          // For now, just show error
          setError('Trip code authentication coming soon');
        } catch (err) {
          setError('Invalid trip code');
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // Second step: validate password
      if (inputValue.length === 0) {
        setError('Please enter your password');
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Implement email/password authentication
        // For now, just show error
        setError('Email/password authentication coming soon');
      } catch (err) {
        setError('Invalid password');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRequestOTP = async () => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Implement OTP request
      setShowOTP(true);
      setError('OTP functionality coming soon');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f0b90b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/images/logos/wolthers-logo-green.svg"
            alt="Wolthers & Associates"
            width={200}
            height={80}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#f0b90b] mb-8">
          Trip Itineraries
        </h1>

        {/* Main Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
          {/* Input Section */}
          <div className="space-y-4">
            {isEmailEntered && (
              <div className="text-sm text-gray-400 mb-2">
                Signing in as: <span className="font-medium text-white">{email}</span>
                <button
                  onClick={() => {
                    setIsEmailEntered(false);
                    setEmail('');
                    setInputValue('');
                    setError('');
                  }}
                  className="ml-2 text-primary hover:underline"
                >
                  Change
                </button>
              </div>
            )}
            
            <input
              type={isEmailEntered ? 'password' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isEmailEntered 
                  ? 'Enter your password' 
                  : 'Enter your email or trip access code'
              }
              className="w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f0b90b] focus:border-transparent"
              disabled={isLoading}
            />

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {isEmailEntered && !showOTP && (
              <button
                onClick={handleRequestOTP}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Forgot password? Request OTP
              </button>
            )}

            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-[#f0b90b] hover:bg-[#d4a309] text-black font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>

          {/* Microsoft Sign In */}
          <button
            onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/assets/images/icons/ms_signin.svg"
              alt="Microsoft"
              width={20}
              height={20}
            />
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}