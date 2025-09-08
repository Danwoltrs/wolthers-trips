'use server'

import { revalidateTag } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { sendTripNotification } from '@/lib/notifications'

interface AddWolthersStaffParams {
  name: string
  email: string
  tripId: string
}

// Adds a Wolthers staff member to a trip and sends invite if needed
export async function addWolthersStaff({ name, email, tripId }: AddWolthersStaffParams) {
  // 1) normalize email
  const normalizedEmail = email.trim().toLowerCase()

  // 2) users: upsert (if not exists → status='invited')
  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        email: normalizedEmail,
        full_name: name,
        status: 'invited'
      },
      {
        onConflict: 'email',
        returning: 'representation'
      }
    )
    .select()
    .single()

  if (userError) {
    throw new Error(`Failed to upsert user: ${userError.message}`)
  }

  const userId = user.id

  // 3) org_members: insert if missing (org='Wolthers & Associates')
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('name', 'Wolthers & Associates')
    .single()

  if (org?.id) {
    await supabase
      .from('org_members')
      .upsert(
        {
          org_id: org.id,
          user_id: userId,
          role: 'staff'
        },
        { onConflict: 'org_id,user_id' }
      )
  }

  // 4) trip_staff: insert (role='staff')
  await supabase
    .from('trip_staff')
    .upsert(
      {
        trip_id: tripId,
        user_id: userId,
        role: 'staff'
      },
      { onConflict: 'trip_id,user_id' }
    )

  // 5) send invite
  await sendTripNotification({ type: 'invited', tripId, inviteEmail: normalizedEmail })

  // Revalidate caches
  revalidateTag('trips')
  revalidateTag(`trips:user:${userId}`)

  return { userId }
}

