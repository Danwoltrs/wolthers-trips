'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

function AuthTestContent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Authentication Test - Signed In</h1>
            </div>
            <div className="card-content space-y-4">
              <div className="space-y-2">
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name || 'Not provided'}</p>
                <p><strong>Role:</strong> {session.user.role || 'Not assigned'}</p>
                <p><strong>Company:</strong> {session.user.company || 'Not assigned'}</p>
                <p><strong>Provider:</strong> {session.user.image ? 'Microsoft' : 'Email'}</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => signOut()}
                  className="btn btn-destructive"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn btn-primary"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title text-center">Authentication Test</h1>
            <p className="card-description text-center">
              Test the authentication system
            </p>
          </div>
          <div className="card-content space-y-4">
            <button
              onClick={() => signIn('microsoft')}
              className="btn btn-primary w-full"
            >
              Sign in with Microsoft
            </button>
            
            <div className="text-center text-sm text-muted-foreground">
              or
            </div>
            
            <button
              onClick={() => signIn('email')}
              className="btn btn-outline w-full"
            >
              Sign in with Email
            </button>
            
            <div className="text-xs text-muted-foreground">
              <p>Microsoft: Auto-approved for @wolthers.com</p>
              <p>Email: OTP sent to your email address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthTestPage() {
  return (
    <SessionProvider>
      <AuthTestContent />
    </SessionProvider>
  );
}