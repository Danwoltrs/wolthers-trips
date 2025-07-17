'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-md w-full">
        <div className="card-header">
          <h1 className="card-title text-2xl text-center">Sign in to Wolthers Travel</h1>
        </div>
        <div className="card-content space-y-4">
          <button
            onClick={() => signIn('azure-ad', { callbackUrl })}
            className="btn btn-primary w-full"
          >
            Sign in with Microsoft
          </button>
          <p className="text-sm text-muted-foreground text-center">
            Use your @wolthers.com email for automatic access
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card max-w-md w-full">
          <div className="card-header">
            <h1 className="card-title text-2xl text-center">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}