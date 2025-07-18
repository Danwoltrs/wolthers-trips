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
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-52 cursor-pointer ${
      isPast ? 'opacity-60' : 'hover:border-gray-300'
    }`}>
      <div className="p-4 h-full flex flex-col">
        {/* Top Section - Trip Info */}
        <div className="flex-none">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{trip.title}</h3>
          <p className="text-sm text-gray-600 truncate">{trip.client}</p>
          <p className="text-sm text-gray-500 mt-1">
            {isPast ? (
              `${tripDuration} days completed`
            ) : (
              `${daysToTrip > 0 ? `${daysToTrip} days to trip` : 'Trip in progress'} | ${tripDuration} days`
            )}
          </p>
        </div>
        
        {/* Visual Separator */}
        <div className="border-t border-gray-200 my-3"></div>
        
        {/* Bottom Section - Team & Logistics */}
        <div className="flex-1 text-sm text-gray-600 space-y-2">
          <div>
            <span className="font-medium text-gray-700">Wolthers Staff:</span>
            <span className="ml-1 truncate block">{formatStaffList(trip.staff)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Vehicle:</span>
            <span className="ml-1 truncate">{trip.vehicle} + {trip.driver}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Cities:</span>
            <span className="ml-1 truncate block">{formatCitiesList(trip.cities)}</span>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current & Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* ROW 2: Past Trips */}
      <div>
        <h2 className="text-2xl font-bold text-gray-500 mb-6">Past Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={true} />
          ))}
        </div>
      </div>
    </div>
  );
}