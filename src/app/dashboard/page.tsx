'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';

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
    type: 'current',
    status: 'in_progress'
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
    type: 'current',
    status: 'scheduled'
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
    type: 'current',
    status: 'to_be_confirmed'
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
    type: 'past',
    status: 'completed'
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
    type: 'past',
    status: 'completed'
  },
];

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

function getStatusBadge(status: string) {
  const statusConfig = {
    in_progress: { label: 'Trip in progress', className: 'bg-success text-white' },
    scheduled: { label: 'Scheduled', className: 'bg-info text-white' },
    to_be_confirmed: { label: 'To be confirmed', className: 'bg-warning text-white' },
    completed: { label: 'Completed', className: 'bg-muted text-muted-foreground' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { 
    label: status, 
    className: 'bg-muted text-muted-foreground' 
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function TripCard({ trip }: { trip: any }) {
  const tripDuration = calculateTripDuration(trip.startDate, trip.endDate);
  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-4">
        {/* Header with title and status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground flex-1 mr-2">{trip.title}</h3>
          {getStatusBadge(trip.status)}
        </div>
        
        {/* Company name as subtitle */}
        <p className="text-muted-foreground text-sm mb-4">{trip.client}</p>
        
        {/* Trip duration pill and start date */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-accent-foreground">
            {tripDuration + 1} days
          </span>
          <p className="text-sm text-muted-foreground mt-2">Starts {startDate}</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3 pt-0">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Wolthers Staff</p>
          <p className="text-sm text-muted-foreground">{formatStaffList(trip.staff)}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Vehicle</p>
          <p className="text-sm text-muted-foreground">{trip.vehicle} • Driver: {trip.driver}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Cities</p>
          <p className="text-sm text-muted-foreground">{formatCitiesList(trip.cities)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const currentTrips = trips.filter(trip => trip.type === 'current');
  const pastTrips = trips.filter(trip => trip.type === 'past');

  return (
    <>
      {/* Current & Upcoming Trips */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Current & Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Past Trips */}
      <div>
        <h2 className="text-2xl font-bold text-muted-foreground mb-6">Past Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </>
  );
}