import { supabase } from './supabase'

export interface Trip {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  type: string
  status: string
  regions: string[] | null
  main_clients: string[] | null
  estimated_cost: number | null
  created_at: string
  updated_at: string
}

export interface TripWithDetails extends Trip {
  participants?: TripParticipant[]
  companies?: Company[]
  duration: number
  formattedStartDate: string
}

export interface TripParticipant {
  id: string
  trip_id: string
  user_id: string
  company_id: string | null
  role: string
  users: {
    full_name: string
    email: string
  }[]
}

export interface Company {
  id: string
  name: string
  fantasy_name: string | null
}

export async function getAllTrips(): Promise<{ data: TripWithDetails[] | null; error: any }> {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        type,
        status,
        regions,
        main_clients,
        estimated_cost,
        created_at,
        updated_at
      `)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching trips:', error)
      return { data: null, error }
    }

    // Transform trips data to match the dashboard format
    const transformedTrips: TripWithDetails[] = trips?.map(trip => {
      const startDate = new Date(trip.start_date)
      const endDate = new Date(trip.end_date)
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
      
      return {
        ...trip,
        duration,
        formattedStartDate: startDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
    }) || []

    return { data: transformedTrips, error: null }
  } catch (error) {
    console.error('Unexpected error fetching trips:', error)
    return { data: null, error }
  }
}

export async function getTripParticipants(tripId: string): Promise<{ data: any[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('trip_participants')
      .select(`
        id,
        trip_id,
        user_id,
        company_id,
        role,
        users!inner (
          full_name,
          email
        )
      `)
      .eq('trip_id', tripId)

    if (error) {
      console.error('Error fetching trip participants:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching participants:', error)
    return { data: null, error }
  }
}

export async function getTripCompanies(tripId: string): Promise<{ data: Company[] | null; error: any }> {
  try {
    // Get companies associated with the trip through main_clients or participants
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('main_clients')
      .eq('id', tripId)
      .single()

    if (tripError) {
      console.error('Error fetching trip companies:', tripError)
      return { data: null, error: tripError }
    }

    // For now, we'll create mock company data based on main_clients
    const companies: Company[] = trip.main_clients?.map((clientName: string, index: number) => ({
      id: `company-${index}`,
      name: clientName,
      fantasy_name: null
    })) || []

    return { data: companies, error: null }
  } catch (error) {
    console.error('Unexpected error fetching trip companies:', error)
    return { data: null, error }
  }
}

// Helper function to format trip status for display
export function getStatusConfig(status: string) {
  const statusConfig = {
    'scheduled': { label: 'Scheduled', className: 'bg-info text-white' },
    'in_progress': { label: 'Trip in progress', className: 'bg-success text-white' },
    'completed': { label: 'Completed', className: 'bg-muted text-muted-foreground' },
    'cancelled': { label: 'Cancelled', className: 'bg-destructive text-white' },
    'to_be_confirmed': { label: 'To be confirmed', className: 'bg-warning text-white' }
  }
  
  return statusConfig[status as keyof typeof statusConfig] || { 
    label: status, 
    className: 'bg-muted text-muted-foreground' 
  }
}

// Helper function to determine if trip is current, upcoming, or past
export function getTripTimeCategory(startDate: string, endDate: string): 'current' | 'upcoming' | 'past' {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (now >= start && now <= end) {
    return 'current'
  } else if (now < start) {
    return 'upcoming'
  } else {
    return 'past'
  }
}