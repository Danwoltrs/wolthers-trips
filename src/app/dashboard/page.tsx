'use client';

// Using simple text and HTML entities instead of icons

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
    statusColor: 'bg-accent-100 text-accent-800',
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
    statusColor: 'bg-primary-100 text-primary-800',
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
    statusColor: 'bg-yellow-100 text-yellow-800',
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
    statusColor: 'bg-secondary-100 text-secondary-700',
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
    statusColor: 'bg-secondary-100 text-secondary-700',
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
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${isPast ? 'opacity-60' : 'hover:border-primary-200'}`}>
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{trip.title}</h3>
            <div className="flex items-center mt-1 text-gray-500">
              <span className="text-sm mr-1">📍</span>
              <span className="text-sm">{trip.destination}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trip.statusColor}`}>
            {trip.status}
          </span>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <span className="text-sm mr-2">📅</span>
            <span className="text-sm">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <span className="text-sm mr-2">👥</span>
            <span className="text-sm">{trip.participants} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const currentTrips = trips.filter(trip => trip.type === 'current');
  const pastTrips = trips.filter(trip => trip.type === 'past');

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-secondary-900">
          Welcome back
        </h1>
        <p className="text-secondary-600 mt-2">
          Manage your travel itineraries and track your coffee origin trips.
        </p>
      </div>

      {/* Current & Upcoming Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-xl mr-2">✈️</span>
            <h2 className="text-xl font-semibold text-secondary-900">Current & Upcoming Trips</h2>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <span className="mr-2">+</span>
            New Trip
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Past Trips */}
      <div>
        <div className="flex items-center mb-6">
          <span className="text-xl mr-2">🕐</span>
          <h2 className="text-xl font-semibold text-secondary-500">Past Trips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={true} />
          ))}
        </div>
      </div>
    </div>
  );
}