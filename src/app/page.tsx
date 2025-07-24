'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-green-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img src="/assets/images/logos/wolthers-logo-green.svg" alt="Wolthers Associates" className="h-8" />
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/assets/images/logos/wolthers-logo-green.svg" alt="Wolthers Associates" className="h-8" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#B8860B' }}>
              Travel Itineraries
            </h1>
            <p className="text-gray-600">
              Welcome to Wolthers & Associates trip management system
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
            {/* Card Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In</h2>
              <p className="text-sm text-gray-600">Access your travel itineraries and trip information</p>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              {isEmailEntered && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-green-800">Signing in as: <span className="font-medium">{email}</span></span>
                    </div>
                    <button
                      onClick={() => {
                        setIsEmailEntered(false);
                        setEmail('');
                        setInputValue('');
                        setError('');
                      }}
                      className="text-green-600 hover:text-green-800 font-medium hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isEmailEntered ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Mail className="h-5 w-5 text-gray-400" />
                  )}
                </div>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400 text-gray-900"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {isEmailEntered && !showOTP && (
                <div className="text-center">
                  <button
                    onClick={handleRequestOTP}
                    className="text-sm text-green-600 hover:text-green-800 hover:underline"
                    disabled={isLoading}
                  >
                    Forgot password? Request OTP
                  </button>
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Microsoft Sign In */}
            <button
              onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/assets/images/icons/ms_signin.svg"
                alt="Microsoft"
                width={20}
                height={20}
              />
              <span>Sign in with Microsoft</span>
            </button>

            {/* Additional Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>Having trouble accessing your account?</p>
                <p>Contact your trip coordinator for assistance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}