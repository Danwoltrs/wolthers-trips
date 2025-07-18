import Link from 'next/link';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-md w-full">
        <div className="card-header">
          <h1 className="card-title text-2xl text-center">Check Your Email</h1>
        </div>
        <div className="card-content space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              A sign in link has been sent to your email address.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your email and click the link to sign in.
            </p>
          </div>
          <Link
            href="/"
            className="btn btn-outline w-full"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}