import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Client-side Supabase client (with auth session management)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Server-side Supabase client (bypasses RLS for admin operations)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

// Server-side client for API routes (respects RLS)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Utility function for creating authenticated server client
export function createServerClient(accessToken?: string) {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    })
  }

  return client
}

// Database connection and health check functions
export async function testDatabaseConnection() {
  try {
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { error: 'Missing Supabase environment variables' }
    }

    // Test 1: Simple connection test
    const { data: healthCheck, error: healthError } = await supabase
      .from('companies')
      .select('count')
      .limit(1)

    if (healthError) {
      console.error('Database connection failed:', healthError)
      return { error: `Database connection failed: ${healthError.message}` }
    }

    // Test 2: Check if Wolthers company exists
    const { data: wolthers, error: wolthersError } = await supabase
      .from('companies')
      .select('*')
      .eq('name', 'Wolthers & Associates')
      .single()

    if (wolthersError) {
      console.error('Wolthers company not found:', wolthersError)
      return { error: `Wolthers company not found: ${wolthersError.message}` }
    }

    console.log('Database connection successful!')
    console.log('Wolthers company found:', wolthers)
    
    return { data: wolthers, success: true }

  } catch (error) {
    console.error('Unexpected database error:', error)
    return { error: error instanceof Error ? error.message : 'Unknown database error' }
  }
}

// Test all database tables for basic connectivity
export async function testAllTables() {
  const tables = [
    'companies',
    'company_locations', 
    'company_contacts',
    'users',
    'trips',
    'trip_participants',
    'meetings',
    'expenses',
    'payment_cards',
    'vehicles',
    'vehicle_logs',
    'flight_bookings',
    'finance_tasks',
    'out_of_office_messages'
  ]

  const results = []

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      results.push({
        table,
        status: error ? 'error' : 'success',
        error: error?.message
      })
    } catch (error) {
      results.push({
        table,
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
}

// Environment configuration check
export function checkEnvironmentConfig() {
  const config = {
    supabaseUrl: {
      value: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      name: 'NEXT_PUBLIC_SUPABASE_URL'
    },
    supabaseAnonKey: {
      value: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    },
    supabaseServiceKey: {
      value: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      optional: true
    },
    nextAuthUrl: {
      value: !!process.env.NEXTAUTH_URL,
      name: 'NEXTAUTH_URL'
    },
    nextAuthSecret: {
      value: !!process.env.NEXTAUTH_SECRET,
      name: 'NEXTAUTH_SECRET'
    },
    smtpConfig: {
      host: !!process.env.SMTP_HOST,
      port: !!process.env.SMTP_PORT,
      user: !!process.env.SMTP_USER,
      password: !!process.env.SMTP_PASSWORD
    }
  }

  const missing = Object.entries(config)
    .filter(([key, value]) => {
      if (typeof value === 'object' && 'value' in value) {
        return !value.value && !value.optional
      }
      if (typeof value === 'object') {
        return Object.values(value).some(v => !v)
      }
      return false
    })
    .map(([key]) => key)

  return {
    config,
    isValid: missing.length === 0,
    missing
  }
}

// User role validation helpers
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

export function canAccessTrip(userRole: string, userId: string, tripOwnerId: string): boolean {
  const adminRoles = ['GLOBAL_ADMIN', 'WOLTHERS_STAFF', 'FINANCE_DEPARTMENT']
  return adminRoles.includes(userRole) || userId === tripOwnerId
}

// Database utility functions for common operations
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  return { data, error }
}

export async function getCompanyById(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

export async function getTripsByUser(userId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      trip_participants!inner(user_id),
      companies(name)
    `)
    .eq('trip_participants.user_id', userId)
    .order('start_date', { ascending: false })

  return { data, error }
}
