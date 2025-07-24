'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getAllTrips, getTripTimeCategory, getStatusConfig, type TripWithDetails } from '@/lib/trips';

function formatRegionsList(regions: string[] | null) {
  if (!regions || regions.length === 0) return 'No regions specified';
  if (regions.length <= 4) {
    return regions.join(', ');
  }
  return regions.slice(0, 4).join(', ') + '...';
}

function formatClientsList(clients: string[] | null) {
  if (!clients || clients.length === 0) return 'No clients specified';
  if (clients.length <= 3) {
    return clients.join(', ');
  }
  return clients.slice(0, 3).join(', ') + '...';
}

function getStatusBadge(status: string) {
  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function TripCard({ trip }: { trip: TripWithDetails }) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-4">
        {/* Header with title and status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground flex-1 mr-2">{trip.title}</h3>
          {getStatusBadge(trip.status)}
        </div>
        
        {/* Clients as subtitle */}
        <p className="text-muted-foreground text-sm mb-4">{formatClientsList(trip.main_clients)}</p>
        
        {/* Trip duration pill and start date */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-accent-foreground">
            {trip.duration} days
          </span>
          <p className="text-sm text-muted-foreground mt-2">Starts {trip.formattedStartDate}</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3 pt-0">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Trip Type</p>
          <p className="text-sm text-muted-foreground">{trip.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Regions</p>
          <p className="text-sm text-muted-foreground">{formatRegionsList(trip.regions)}</p>
        </div>
        
        {trip.estimated_cost && (
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Estimated Cost</p>
            <p className="text-sm text-muted-foreground">
              {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(trip.estimated_cost)}
            </p>
          </div>
        )}
        
        {trip.description && (
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Description</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<TripWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        const { data, error } = await getAllTrips();
        
        if (error) {
          setError('Failed to load trips. Please try again later.');
          console.error('Error fetching trips:', error);
        } else {
          setTrips(data || []);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  // Categorize trips by time
  const currentAndUpcomingTrips = trips.filter(trip => {
    const category = getTripTimeCategory(trip.start_date, trip.end_date);
    return category === 'current' || category === 'upcoming';
  });

  const pastTrips = trips.filter(trip => {
    const category = getTripTimeCategory(trip.start_date, trip.end_date);
    return category === 'past';
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Current & Upcoming Trips */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Current & Upcoming Trips ({currentAndUpcomingTrips.length})
        </h2>
        {currentAndUpcomingTrips.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No current or upcoming trips found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentAndUpcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {/* Past Trips */}
      <div>
        <h2 className="text-2xl font-bold text-muted-foreground mb-6">
          Past Trips ({pastTrips.length})
        </h2>
        {pastTrips.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No past trips found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pastTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}