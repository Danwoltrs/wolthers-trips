import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      url_preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      anon_key_preview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      platform: process.platform,
      node_version: process.version,
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}