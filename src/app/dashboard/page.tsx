'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Bell, Settings, User } from 'lucide-react';
import { getAllTrips, getTripTimeCategory, type TripWithDetails } from '@/lib/trips';

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

function getDaysUntilTrip(startDate: string, endDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = start.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Check if trip is ongoing (started but not finished)
  if (daysDiff <= 0 && today <= end) {
    return 'ongoing';
  }
  
  return daysDiff;
}

function TripCard({ trip, isUpcoming }: { trip: TripWithDetails; isUpcoming: boolean }) {
  const daysUntil = getDaysUntilTrip(trip.start_date, trip.end_date);
  
  return (
    <div 
      className={`${isUpcoming ? 'bg-white' : 'bg-gray-100 opacity-75 hover:opacity-90'} rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer w-60 group`}
    >
      <div className="p-4 h-96 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h3 className={`text-base font-bold ${isUpcoming ? 'text-gray-900' : 'text-gray-700'} mb-2 truncate h-6`}>
            {trip.title}
          </h3>
          <div className={`-mx-4 px-4 py-1 ${isUpcoming ? 'bg-[#F5F1E8]' : 'bg-[#F0F0F0]'}`}>
            <p className={`text-sm font-medium ${isUpcoming ? 'text-gray-700' : 'text-gray-600'} truncate h-5`}>
              {trip.main_clients ? trip.main_clients.slice(0, 2).join(', ') : 'No clients specified'}
            </p>
          </div>
          
          {/* Days status bar */}
          <div className={`-mx-4 px-4 py-2 text-xs font-medium mb-2 ${isUpcoming ? 'bg-[#E8E2D4]' : 'bg-[#E5E5E5]'}`}>
            <span className={isUpcoming ? 'text-gray-700' : 'text-gray-600'}>
              {isUpcoming 
                ? (daysUntil === 'ongoing' ? 'Ongoing' : `${daysUntil} days until`) 
                : 'Completed'
              } | {trip.duration} days total
            </span>
          </div>
          
          <p className={`text-xs ${isUpcoming ? 'text-gray-500' : 'text-gray-400'}`}>
            {formatDateRange(trip.start_date, trip.end_date)}
          </p>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {/* Trip Type */}
          <div className="flex items-start space-x-1">
            <Calendar className={`w-3 h-3 ${isUpcoming ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
            <div>
              <p className={`text-xs font-medium ${isUpcoming ? 'text-gray-700' : 'text-gray-600'}`}>Type</p>
              <p className={`text-xs ${isUpcoming ? 'text-gray-600' : 'text-gray-500'} line-clamp-1`}>
                {trip.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>

          {/* Regions */}
          <div className="flex items-start space-x-1">
            <MapPin className={`w-3 h-3 ${isUpcoming ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
            <div>
              <p className={`text-xs font-medium ${isUpcoming ? 'text-gray-700' : 'text-gray-600'}`}>Regions</p>
              <p className={`text-xs ${isUpcoming ? 'text-gray-600' : 'text-gray-500'} line-clamp-1`}>
                {trip.regions ? trip.regions.join(', ') : 'No regions specified'}
              </p>
            </div>
          </div>

          {/* Estimated Cost */}
          {trip.estimated_cost && (
            <div className="flex items-start space-x-1">
              <Clock className={`w-3 h-3 ${isUpcoming ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
              <div>
                <p className={`text-xs font-medium ${isUpcoming ? 'text-gray-700' : 'text-gray-600'}`}>Estimated Cost</p>
                <p className={`text-xs ${isUpcoming ? 'text-gray-600' : 'text-gray-500'} line-clamp-1`}>
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                  }).format(trip.estimated_cost)}
                </p>
              </div>
            </div>
          )}

          {/* Main Clients */}
          {trip.main_clients && trip.main_clients.length > 0 && (
            <div className="flex items-start space-x-1">
              <Users className={`w-3 h-3 ${isUpcoming ? 'text-gray-500' : 'text-gray-400'} mt-0.5 flex-shrink-0`} />
              <div>
                <p className={`text-xs font-medium ${isUpcoming ? 'text-gray-700' : 'text-gray-600'}`}>Key Visits</p>
                <p className={`text-xs ${isUpcoming ? 'text-gray-600' : 'text-gray-500'} line-clamp-2`}>
                  {trip.main_clients.slice(0, 3).join(', ')}{trip.main_clients.length > 3 ? '...' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
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
        console.log('🔍 Starting to fetch trips...');
        console.log('Environment check:', {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
        });
        
        const { data, error } = await getAllTrips();
        
        console.log('📊 Trip fetch result:', { data, error });
        
        if (error) {
          setError(`Failed to load trips: ${error.message || 'Unknown error'}`);
          console.error('❌ Error fetching trips:', error);
        } else {
          console.log(`✅ Successfully fetched ${data?.length || 0} trips`);
          setTrips(data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`An unexpected error occurred: ${errorMessage}`);
        console.error('💥 Unexpected error:', err);
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-green-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img src="/assets/images/logos/wolthers-logo-green.svg" alt="Wolthers Associates" className="h-8" />
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button className="p-2 hover:bg-green-700 rounded">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-green-700 rounded">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-green-700 rounded">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-green-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img src="/assets/images/logos/wolthers-logo-green.svg" alt="Wolthers Associates" className="h-8" />
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button className="p-2 hover:bg-green-700 rounded">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-green-700 rounded">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-green-700 rounded">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/assets/images/logos/wolthers-logo-green.svg" alt="Wolthers Associates" className="h-8" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 hover:bg-green-700 rounded">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-green-700 rounded">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-green-700 rounded">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Username */}
          <div className="hidden md:block pb-2">
            <p className="text-green-200 text-sm">Welcome back, Daniel Wolthers</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#B8860B' }}>Travel Itineraries</h1>

        {/* Upcoming Trips Section */}
        <section className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Upcoming Trips</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 max-w-5xl mx-auto justify-center">
            {/* Create New Trip Card */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-dashed hover:shadow-md hover:bg-green-50 transition-all duration-200 cursor-pointer w-20 h-96 group" style={{ borderColor: '#D4C6B0' }}>
              <div className="h-full flex items-center justify-center">
                <Plus className="w-8 h-8 group-hover:text-green-600 transition-colors duration-200" style={{ color: '#B8A082' }} />
              </div>
            </div>

            {/* Upcoming Trip Cards */}
            {currentAndUpcomingTrips.length === 0 ? (
              <div className="text-center py-12 text-gray-500 w-full">
                <p>No current or upcoming trips found.</p>
              </div>
            ) : (
              currentAndUpcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isUpcoming={true} />
              ))
            )}
          </div>
        </section>

        {/* Past Trips Section */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-500">Past Trips</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 max-w-5xl mx-auto justify-center">
            {pastTrips.length === 0 ? (
              <div className="text-center py-12 text-gray-500 w-full">
                <p>No past trips found.</p>
              </div>
            ) : (
              pastTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isUpcoming={false} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}