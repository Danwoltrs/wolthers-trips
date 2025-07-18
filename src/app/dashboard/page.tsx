'use client';

import { useAuth } from '@/hooks/use-auth';
import { MapPin, Calendar, Users, Plane, Clock, Plus } from 'lucide-react';

// Simple trip data
const trips = [
  {
    id: 1,
    title: 'Brazil Coffee Origins Tour',
    destination: 'São Paulo & Santos, Brazil',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    participants: 8,
    status: 'Active',
    statusColor: 'badge-green',
    type: 'current'
  },
  {
    id: 2,
    title: 'Colombia Specialty Coffee',
    destination: 'Medellín, Colombia',
    startDate: '2024-02-10',
    endDate: '2024-02-17',
    participants: 6,
    status: 'Upcoming',
    statusColor: 'badge-blue',
    type: 'current'
  },
  {
    id: 3,
    title: 'Guatemala Highland Farms',
    destination: 'Antigua, Guatemala',
    startDate: '2024-03-05',
    endDate: '2024-03-12',
    participants: 4,
    status: 'Planning',
    statusColor: 'badge-yellow',
    type: 'current'
  },
  {
    id: 4,
    title: 'Costa Rica Micromill Tour',
    destination: 'Central Valley, Costa Rica',
    startDate: '2023-11-20',
    endDate: '2023-11-27',
    participants: 5,
    status: 'Completed',
    statusColor: 'badge-gray',
    type: 'past'
  },
  {
    id: 5,
    title: 'Ecuador Specialty Farms',
    destination: 'Quito & Loja, Ecuador',
    startDate: '2023-10-15',
    endDate: '2023-10-22',
    participants: 7,
    status: 'Completed',
    statusColor: 'badge-gray',
    type: 'past'
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function TripCard({ trip, isPast = false }: { trip: any, isPast?: boolean }) {
  return (
    <div className={`card hover:shadow-md transition-shadow cursor-pointer ${isPast ? 'opacity-60' : ''}`}>
      <div className="card-header">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title">{trip.title}</h3>
            <div className="flex items-center mt-1 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{trip.destination}</span>
            </div>
          </div>
          <span className={`badge ${trip.statusColor}`}>
            {trip.status}
          </span>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{trip.participants} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  const currentTrips = trips.filter(trip => trip.type === 'current');
  const pastTrips = trips.filter(trip => trip.type === 'past');

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your travel itineraries and track your coffee origin trips.
        </p>
      </div>

      {/* Current & Upcoming Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Plane className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Current & Upcoming Trips</h2>
          </div>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Past Trips */}
      <div>
        <div className="flex items-center mb-6">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-500">Past Trips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={true} />
          ))}
        </div>
      </div>
    </div>
  );
}