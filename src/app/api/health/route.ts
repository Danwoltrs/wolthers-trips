import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Test database connection using service role (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Simple health check query that should always work
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database query failed:', error);
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'error',
        environment: process.env.NODE_ENV,
        error: `Database error: ${error.message}`,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      }, { status: 500 });
    }

    // Test storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    const storageStatus = storageError ? 'error' : 'connected';
    const requiredBuckets = ['receipts', 'dashboard-photos', 'documents'];
    const existingBuckets = buckets?.map(b => b.name) || [];
    const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.includes(bucket));

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      storage: storageStatus,
      environment: process.env.NODE_ENV,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      buckets: {
        existing: existingBuckets,
        missing: missingBuckets,
        required: requiredBuckets,
      },
      storageError: storageError?.message || null,
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    }, { status: 500 });
  }
}