'use client';

// Mock trip data with varying content lengths for testing fixed heights
const trips = [
  {
    id: 1,
    title: 'Brazil Coffee Origins Tour',
    client: 'Green Coffee Co.',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    staff: ['John Smith', 'Maria Santos', 'Pedro Oliveira'],
    vehicle: 'Toyota Hilux',
    driver: 'Carlos Silva',
    cities: ['São Paulo', 'Santos', 'Campinas', 'Ribeirão Preto', 'Franca'],
    type: 'current'
  },
  {
    id: 2,
    title: 'Colombia Specialty Coffee Visit',
    client: 'Premium Roasters Ltd.',
    startDate: '2024-02-10',
    endDate: '2024-02-17',
    staff: ['Ana Rodriguez', 'James Wilson'],
    vehicle: 'Ford Ranger',
    driver: 'Miguel Torres',
    cities: ['Medellín', 'Armenia', 'Manizales'],
    type: 'current'
  },
  {
    id: 3,
    title: 'Guatemala Highland Farms Exploration',
    client: 'Specialty Coffee Imports',
    startDate: '2024-03-05',
    endDate: '2024-03-12',
    staff: ['Sarah Johnson', 'Roberto Gutierrez', 'Lisa Chen', 'David Brown'],
    vehicle: 'Nissan Frontier',
    driver: 'Juan Morales',
    cities: ['Antigua', 'Huehuetenango', 'Cobán', 'Chimaltenango', 'Quetzaltenango', 'Sololá'],
    type: 'current'
  },
  {
    id: 4,
    title: 'Costa Rica Micromill Tour',
    client: 'Artisan Coffee Co.',
    startDate: '2023-11-20',
    endDate: '2023-11-27',
    staff: ['Michael Davis', 'Carmen Lopez'],
    vehicle: 'Chevrolet Colorado',
    driver: 'Fernando Vega',
    cities: ['San José', 'Cartago', 'Turrialba', 'Tarrazú'],
    type: 'past'
  },
  {
    id: 5,
    title: 'Ecuador Specialty Farms Assessment',
    client: 'Global Coffee Solutions',
    startDate: '2023-10-15',
    endDate: '2023-10-22',
    staff: ['Patricia Wilson', 'Carlos Mendoza', 'Elena Vargas'],
    vehicle: 'Toyota Land Cruiser',
    driver: 'Ricardo Moreno',
    cities: ['Quito', 'Loja', 'Zamora', 'Vilcabamba'],
    type: 'past'
  },
];

function calculateDaysToTrip(startDate: string) {
  const today = new Date();
  const tripDate = new Date(startDate);
  const timeDiff = tripDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

function calculateTripDuration(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

function formatCitiesList(cities: string[]) {
  if (cities.length <= 4) {
    return cities.join(', ');
  }
  return cities.slice(0, 4).join(', ') + '...';
}

function formatStaffList(staff: string[]) {
  if (staff.length <= 3) {
    return staff.join(', ');
  }
  return staff.slice(0, 3).join(', ') + '...';
}

function TripCard({ trip, isPast = false }: { trip: any, isPast?: boolean }) {
  const daysToTrip = calculateDaysToTrip(trip.startDate);
  const tripDuration = calculateTripDuration(trip.startDate, trip.endDate);
  
  return (
    <div className={`trip-card h-52 ${
      isPast ? 'opacity-60' : ''
    }`}>
      <div className="trip-card-content">
        {/* Top Section - Trip Info */}
        <div className="flex-none">
          <h3 className="trip-card-title truncate">{trip.title}</h3>
          <p className="trip-card-client truncate">{trip.client}</p>
          <p className="trip-card-details">
            {isPast ? (
              `${tripDuration} days completed`
            ) : (
              `${daysToTrip > 0 ? `${daysToTrip} days to trip` : 'Trip in progress'} | ${tripDuration} days`
            )}
          </p>
        </div>
        
        {/* Visual Separator */}
        <div className="trip-card-separator"></div>
        
        {/* Bottom Section - Team & Logistics */}
        <div className="flex-1 space-y-1">
          <div className="trip-card-staff">
            <span className="font-medium">Wolthers Staff:</span>
            <span className="ml-1 block truncate">{formatStaffList(trip.staff)}</span>
          </div>
          <div className="trip-card-vehicle">
            <span className="font-medium">Vehicle:</span>
            <span className="ml-1 truncate">{trip.vehicle} + {trip.driver}</span>
          </div>
          <div className="trip-card-cities">
            <span className="font-medium">Cities:</span>
            <span className="ml-1 block truncate">{formatCitiesList(trip.cities)}</span>
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
      {/* ROW 1: Current & Upcoming Trips */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Current & Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* ROW 2: Past Trips */}
      <div>
        <h2 className="text-2xl font-bold text-muted-foreground mb-6">Past Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={true} />
          ))}
        </div>
      </div>
    </div>
  );
}