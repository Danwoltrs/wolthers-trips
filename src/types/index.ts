export interface User {
  id: string
  email: string
  name?: string
  organization_id?: string
  role: 'admin' | 'user' | 'guest'
  created_at: string
  updated_at: string
}

export interface Trip {
  id: string
  title: string
  description?: string
  destination: string
  start_date: string
  end_date: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  organization_id: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  domain?: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface TripParticipant {
  id: string
  trip_id: string
  user_id: string
  role: 'organizer' | 'participant'
  status: 'invited' | 'confirmed' | 'declined'
  created_at: string
}