'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or it may have expired.';
      case 'Default':
        return 'An error occurred during sign in.';
      case 'Callback':
        return 'Error in the OAuth callback. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-md w-full">
        <div className="card-header">
          <h1 className="card-title text-2xl text-center text-destructive">
            Authentication Error
          </h1>
        </div>
        <div className="card-content space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {getErrorMessage(error)}
            </p>
            {error && (
              <p className="text-sm text-muted-foreground">
                Error code: {error}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <a
              href="/auth/signin"
              className="btn btn-primary w-full"
            >
              Try Again
            </a>
            <Link
              href="/"
              className="btn btn-outline w-full"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
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
      <ErrorContent />
    </Suspense>
  );
}