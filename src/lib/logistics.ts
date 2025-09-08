import { supabase } from './supabase'
import type { Tables, TablesInsert } from '../types/database'

export type TripLogistics = Tables<'trip_logistics'>
export type TripLogisticsInsert = TablesInsert<'trip_logistics'>

// Fetch logistics for a given trip
export async function getTripLogistics(tripId: string) {
  const { data, error } = await supabase
    .from('trip_logistics')
    .select('*')
    .eq('trip_id', tripId)
    .maybeSingle()
  return { data, error }
}

// Upsert logistics info
export async function upsertTripLogistics(input: TripLogisticsInsert) {
  const { data, error } = await supabase
    .from('trip_logistics')
    .upsert(input)
    .select()
    .single()
  return { data, error }
}
