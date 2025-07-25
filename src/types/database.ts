// Database type definitions for Supabase integration
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          fantasy_name: string | null
          industry: string | null
          company_type: 'client' | 'exporter' | 'farm' | 'cooperative' | null
          annual_trip_budget: number | null
          primary_language: string | null
          time_zone: string | null
          business_culture: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          fantasy_name?: string | null
          industry?: string | null
          company_type?: 'client' | 'exporter' | 'farm' | 'cooperative' | null
          annual_trip_budget?: number | null
          primary_language?: string | null
          time_zone?: string | null
          business_culture?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          fantasy_name?: string | null
          industry?: string | null
          company_type?: 'client' | 'exporter' | 'farm' | 'cooperative' | null
          annual_trip_budget?: number | null
          primary_language?: string | null
          time_zone?: string | null
          business_culture?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'GLOBAL_ADMIN' | 'WOLTHERS_STAFF' | 'COMPANY_ADMIN' | 'CLIENT_ADMIN' | 'FINANCE_DEPARTMENT' | 'CLIENT' | 'DRIVER'
          company_id: string | null
          auth_method: 'microsoft' | 'email_otp' | 'trip_code'
          reports_to: string | null
          preferences: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: 'GLOBAL_ADMIN' | 'WOLTHERS_STAFF' | 'COMPANY_ADMIN' | 'CLIENT_ADMIN' | 'FINANCE_DEPARTMENT' | 'CLIENT' | 'DRIVER'
          company_id?: string | null
          auth_method?: 'microsoft' | 'email_otp' | 'trip_code'
          reports_to?: string | null
          preferences?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'GLOBAL_ADMIN' | 'WOLTHERS_STAFF' | 'COMPANY_ADMIN' | 'CLIENT_ADMIN' | 'FINANCE_DEPARTMENT' | 'CLIENT' | 'DRIVER'
          company_id?: string | null
          auth_method?: 'microsoft' | 'email_otp' | 'trip_code'
          reports_to?: string | null
          preferences?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'GLOBAL_ADMIN' | 'WOLTHERS_STAFF' | 'COMPANY_ADMIN' | 'CLIENT_ADMIN' | 'FINANCE_DEPARTMENT' | 'CLIENT' | 'DRIVER'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
EOF < /dev/null