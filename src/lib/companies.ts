import { supabase } from './supabase'

export interface Company {
  id: string
  name: string
}

/**
 * Fetch companies that act as buyers for the current organization.
 * Only companies with the 'buyer' role are returned. Companies that
 * also have a 'supplier' role are still included, while supplier-only
 * companies are excluded.
 */
export async function getBuyerCompanies(orgId: string) {
  // Attempt to fetch using the company_roles join table (supports multi-role)
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, company_roles!inner(role)')
    .eq('org_id', orgId)
    .eq('company_roles.role', 'buyer')
    .order('name')

  if (error) {
    return { data: null, error }
  }

  // Remove potential duplicates from the join and return basic company info
  const unique = Array.from(
    new Map(data.map(c => [c.id, { id: c.id, name: c.name }])).values()
  )

  return { data: unique as Company[], error: null }
}
