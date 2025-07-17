import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    hasMicrosoftClientId: !!process.env.MICROSOFT_CLIENT_ID,
    hasMicrosoftClientSecret: !!process.env.MICROSOFT_CLIENT_SECRET,
    microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
    // Don't expose the actual secrets, just check if they exist
    secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    clientSecretLength: process.env.MICROSOFT_CLIENT_SECRET?.length || 0,
  };

  return NextResponse.json(debugInfo);
}