import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add this function to your existing lib/supabase.ts file

export async function testDatabaseConnection() {
    try {
      // Test 1: Check if we can connect
      const { data: healthCheck, error: healthError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
  
      if (healthError) {
        console.error('Database connection failed:', healthError)
        return { error: healthError.message }
      }
  
      // Test 2: Check if Wolthers company exists
      const { data: wolthers, error: wolthersError } = await supabase
        .from('companies')
        .select('*')
        .eq('name', 'Wolthers & Associates')
        .single()
  
      if (wolthersError) {
        console.error('Wolthers company not found:', wolthersError)
        return { error: wolthersError.message }
      }
  
      console.log('✅ Database connection successful!')
      console.log('✅ Wolthers company found:', wolthers)
      
      return { data: wolthers, success: true }
  
    } catch (error) {
      console.error('Unexpected database error:', error)
      return { error: error.message }
    }
  }