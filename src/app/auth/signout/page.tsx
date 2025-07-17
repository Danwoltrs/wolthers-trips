'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-md w-full">
        <div className="card-header">
          <h1 className="card-title text-2xl text-center">Signing Out...</h1>
        </div>
        <div className="card-content">
          <p className="text-center text-muted-foreground">
            Please wait while we sign you out.
          </p>
        </div>
      </div>
    </div>
  );
}