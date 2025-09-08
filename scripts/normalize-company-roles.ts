#!/usr/bin/env ts-node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function normalizeCompanyRoles() {
  // Find companies that only have supplier role but are labeled as buyers
  const { data: suppliers, error } = await supabase
    .from('company_roles')
    .select('company_id')
    .eq('role', 'supplier')

  if (error) {
    console.error('Error fetching supplier roles:', error)
    return
  }

  for (const { company_id } of suppliers) {
    const { data: buyerRole } = await supabase
      .from('company_roles')
      .select('id')
      .match({ company_id, role: 'buyer' })
      .maybeSingle()

    if (!buyerRole) {
      // Remove any incorrect buyer role entries
      await supabase
        .from('company_roles')
        .delete()
        .match({ company_id, role: 'buyer' })

      // Update company table if it still references buyer
      await supabase
        .from('companies')
        .update({ role: 'supplier' })
        .match({ id: company_id, role: 'buyer' })
    }
  }

  console.log('Company role normalization complete.')
}

normalizeCompanyRoles()
