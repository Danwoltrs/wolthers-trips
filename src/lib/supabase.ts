import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Add this function to your existing lib/supabase.ts file

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
  
      console.log('✅ Database connection successful!')
      console.log('✅ Wolthers company found:', wolthers)
      
      return { data: wolthers, success: true }
  
    } catch (error) {
      console.error('Unexpected database error:', error)
      return { error: error instanceof Error ? error.message : 'Unknown database error' }
    }
  }