'use server'

import { revalidateTag } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { sendTripNotification } from '@/lib/notifications'

interface AddCompanyRepresentativeParams {
  companyId: string
  name: string
  email: string
  phone?: string
  tripId: string
}

// Adds a company representative to a trip and sends an invite if needed
export async function addCompanyRepresentative({ companyId, name, email, phone, tripId }: AddCompanyRepresentativeParams) {
  const normalizedEmail = email.trim().toLowerCase()

  // 1) users: upsert (status='invited' if new)
  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        email: normalizedEmail,
        full_name: name,
        phone,
        status: 'invited'
      },
      { onConflict: 'email', returning: 'representation' }
    )
    .select()
    .single()

  if (userError) {
    throw new Error(`Failed to upsert user: ${userError.message}`)
  }

  const userId = user.id

  // 2) company_staff link table insert
  await supabase
    .from('company_staff')
    .upsert(
      {
        company_id: companyId,
        user_id: userId
      },
      { onConflict: 'company_id,user_id' }
    )

  // 3) trip_participants link insert for this trip
  await supabase
    .from('trip_participants')
    .upsert(
      {
        trip_id: tripId,
        user_id: userId,
        role: 'company_staff'
      },
      { onConflict: 'trip_id,user_id' }
    )

  // 4) send invite email
  await sendTripNotification({ type: 'invited', tripId, inviteEmail: normalizedEmail })

  // 5) revalidate cache
  revalidateTag('trips')
  revalidateTag(`trips:user:${userId}`)

  return { userId }
}

