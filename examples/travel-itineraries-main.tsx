import React, { useState } from 'react';
import { Calendar, MapPin, Users, Car, Clock, Plus, Menu, X, Bell, Settings, User, Eye, EyeOff, ExternalLink } from 'lucide-react';

// TypeScript interfaces
interface Guest {
  company: string;
  names: string[];
}

interface Vehicle {
  type: string;
  driver: string;
}

interface TripReview {
  id: string;
  author: string;
  company: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  timestamp: Date;
}

interface Trip {
  id: string;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  clientTraveling: string[];
  carDetails: string;
  wolthersStaff: string[];
  driver: string;
  regions: string[];
  mainClients: string[];
  status: 'upcoming' | 'past';
  description?: string;
}

const TravelItinerariesMain: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const currentUser = 'Daniel Wolthers';

  // Sample trips data
  const trips: Trip[] = [
    {
      id: 'mitsui-trip',
      title: 'Mitsui Sul de Minas trip',
      client: 'Mitsui & KEY Coffee',
      startDate: new Date('2025-07-19'),
      endDate: new Date('2025-07-22'),
      totalDays: 4,
      clientTraveling: ['Nakaya', 'Okada', 'Kurobe', 'Mr. Iwasaki', 'Mr. Ueno'],
      carDetails: '2 Land Rover Discovery + 1 Jeep Wrangler',
      wolthersStaff: ['Daniel', 'Svenn', 'Tom'],
      driver: 'Petter Anderson, Svenn Wolthers, Edgar Gomes',
      regions: ['Sul de Minas', 'Varginha', 'Guaxupé'],
      mainClients: ['Sucafina', 'Cofco', 'Gardingo Trading', 'Minasul', 'Café Três Corações', 'Brascof', 'Cocatrel', 'Cooxupé'],
      status: 'upcoming'
    },
    {
      id: 'colombia-trip',
      title: 'Colombia Origin Discovery',
      client: 'Nordic Coffee Importers',
      startDate: new Date('2025-08-04'),
      endDate: new Date('2025-08-08'),
      totalDays: 5,
      clientTraveling: ['Maria Silva', 'John Smith'],
      carDetails: '1 Toyota Land Cruiser',
      wolthersStaff: ['Daniel', 'Tom'],
      driver: 'Carlos Mendez',
      regions: ['Huila', 'Nariño', 'Cauca'],
      mainClients: ['Finca El Paraíso', 'Cooperativa de Caficultores', 'Granja La Esperanza', 'Finca Las Margaritas'],
      status: 'upcoming'
    },
    {
      id: 'ethiopia-trip',
      title: 'Ethiopian Highlands Expedition',
      client: 'Specialty Coffee Alliance',
      startDate: new Date('2025-08-15'),
      endDate: new Date('2025-08-22'),
      totalDays: 8,
      clientTraveling: ['Robert Johnson', 'Sarah Chen', 'Michael Brown'],
      carDetails: '2 Toyota Land Cruiser',
      wolthersStaff: ['Daniel', 'Svenn'],
      driver: 'Abebe Tadesse, Meron Kifle',
      regions: ['Yirgacheffe', 'Sidamo', 'Harrar'],
      mainClients: ['Yirgacheffe Coffee Union', 'Sidama Coffee Union', 'Oromia Coffee Farmers', 'Harrar Coffee Cooperative'],
      status: 'upcoming'
    },
    {
      id: 'guatemala-past',
      title: 'Guatemala Antigua Heritage Tour',
      client: 'European Coffee Buyers',
      startDate: new Date('2025-06-10'),
      endDate: new Date('2025-06-15'),
      totalDays: 6,
      clientTraveling: ['Hans Mueller', 'Pierre Dubois', 'Giovanni Rossi'],
      carDetails: '2 Ford Ranger',
      wolthersStaff: ['Daniel', 'Tom'],
      driver: 'Miguel Santos, Carlos Herrera',
      regions: ['Antigua', 'Atitlán', 'Huehuetenango'],
      mainClients: ['Finca El Injerto', 'Cooperativa La Voz', 'Finca San Sebastián', 'Anacafé'],
      status: 'past'
    },
    {
      id: 'kenya-past',
      title: 'Kenya AA Discovery Journey',
      client: 'Premium Coffee Roasters',
      startDate: new Date('2025-05-20'),
      endDate: new Date('2025-05-26'),
      totalDays: 7,
      clientTraveling: ['David Lee', 'Emma Wilson'],
      carDetails: '1 Toyota Hilux',
      wolthersStaff: ['Svenn', 'Tom'],
      driver: 'Joseph Kamau',
      regions: ['Central Kenya', 'Nyeri', 'Kirinyaga'],
      mainClients: ['Githiga FCS', 'Barichu Mill', 'Kiangoi FCS', 'New Kenya Planters'],
      status: 'past'
    }
  ];

  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
  const pastTrips = trips.filter(trip => trip.status === 'past');

  const getDaysUntilTrip = (startDate: Date) => {
    const today = new Date();
    const timeDiff = startDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check if trip is ongoing (started but not finished)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // Assuming average trip length, you'd get this from trip data
    
    if (daysDiff <= 0 && today <= endDate) {
      return 'ongoing';
    }
    
    return daysDiff;
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const openTripModal = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const closeTripModal = () => {
    setSelectedTrip(null);
  };

  const openTripItinerary = (tripId: string) => {
    // This would navigate to the detailed itinerary page
    console.log('Opening trip itinerary for:', tripId);
    closeTripModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/api/placeholder/120/40" alt="Wolthers Associates" className="h-8" />
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-green-700 rounded"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Username */}
          <div className="hidden md:block pb-2">
            <p className="text-green-200 text-sm">Welcome back, {currentUser}</p>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-700">
            <div className="px-4 py-3 space-y-3">
              <p className="text-green-200 text-sm">Welcome back, {currentUser}</p>
              <div className="flex space-x-4">
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
        )}
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
            {upcomingTrips.map((trip) => {
              const daysUntil = getDaysUntilTrip(trip.startDate);
              return (
                <div 
                  key={trip.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer w-60 group"
                  onClick={() => openTripModal(trip)}
                >
                  <div className="p-4 h-96 flex flex-col">
                    {/* Header */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-gray-900 mb-2 truncate h-6">{trip.title}</h3>
                      <div className="-mx-4 px-4 py-1" style={{ backgroundColor: '#F5F1E8' }}>
                        <p className="text-sm font-medium text-gray-700 truncate h-5">{trip.client}</p>
                      </div>
                      
                      {/* Days status bar */}
                      <div className="-mx-4 px-4 py-2 text-xs font-medium mb-2" style={{ backgroundColor: '#E8E2D4' }}>
                        <span className="text-gray-700">
                          {daysUntil === 'ongoing' ? 'Ongoing' : `${daysUntil} days until`} | {trip.totalDays} days total
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500">{formatDateRange(trip.startDate, trip.endDate)}</p>
                    </div>

                    {/* Content - scrollable */}
                    <div className="flex-1 space-y-2 overflow-hidden">
                      {/* Client Traveling */}
                      <div className="flex items-start space-x-1">
                        <Users className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Travelers</p>
                          <p className="text-xs text-gray-600 line-clamp-1">{trip.clientTraveling.join(', ')}</p>
                        </div>
                      </div>

                      {/* Car Details */}
                      <div className="flex items-start space-x-1">
                        <Car className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Vehicles</p>
                          <p className="text-xs text-gray-600 line-clamp-1">{trip.carDetails}</p>
                        </div>
                      </div>

                      {/* Wolthers Staff */}
                      <div className="flex items-start space-x-1">
                        <User className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Wolthers Staff</p>
                          <p className="text-xs text-gray-600 line-clamp-1">{trip.wolthersStaff.join(', ')}</p>
                        </div>
                      </div>

                      {/* Regions */}
                      <div className="flex items-start space-x-1">
                        <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Regions</p>
                          <p className="text-xs text-gray-600 line-clamp-1">{trip.regions.join(', ')}</p>
                        </div>
                      </div>

                      {/* Main Clients */}
                      <div className="flex items-start space-x-1">
                        <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Key Visits</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{trip.mainClients.slice(0, 3).join(', ')}{trip.mainClients.length > 3 ? '...' : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Past Trips Section */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-500">Past Trips</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 max-w-5xl mx-auto justify-center">
            {pastTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="bg-gray-100 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer opacity-75 hover:opacity-90 w-60 group"
                onClick={() => openTripModal(trip)}
              >
                <div className="p-4 h-96 flex flex-col">
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-gray-700 mb-2 truncate h-6">{trip.title}</h3>
                    <div className="-mx-4 px-4 py-1" style={{ backgroundColor: '#F0F0F0' }}>
                      <p className="text-sm font-medium text-gray-600 truncate h-5">{trip.client}</p>
                    </div>
                    
                    {/* Completed status bar */}
                    <div className="-mx-4 px-4 py-2 text-xs font-medium mb-2" style={{ backgroundColor: '#E5E5E5' }}>
                      <span className="text-gray-600">
                        Completed | {trip.totalDays} days total
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400">{formatDateRange(trip.startDate, trip.endDate)}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {/* Client Traveling */}
                    <div className="flex items-start space-x-1">
                      <Users className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Travelers</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{trip.clientTraveling.join(', ')}</p>
                      </div>
                    </div>

                    {/* Regions */}
                    <div className="flex items-start space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Regions</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{trip.regions.join(', ')}</p>
                      </div>
                    </div>

                    {/* Main Clients */}
                    <div className="flex items-start space-x-1">
                      <Clock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Key Visits</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{trip.mainClients.slice(0, 3).join(', ')}{trip.mainClients.length > 3 ? '...' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTrip.title}</h2>
                <button
                  onClick={closeTripModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Trip Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Trip Overview</h3>
                  <p className="text-gray-600"><strong>Client:</strong> {selectedTrip.client}</p>
                  <p className="text-gray-600"><strong>Duration:</strong> {selectedTrip.totalDays} days ({formatDateRange(selectedTrip.startDate, selectedTrip.endDate)})</p>
                  <p className="text-gray-600"><strong>Status:</strong> {selectedTrip.status === 'past' ? 'Completed' : 'Upcoming'}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Travelers</h3>
                  <p className="text-gray-600">{selectedTrip.clientTraveling.join(', ')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Wolthers Team</h3>
                  <p className="text-gray-600"><strong>Staff:</strong> {selectedTrip.wolthersStaff.join(', ')}</p>
                  <p className="text-gray-600"><strong>Driver(s):</strong> {selectedTrip.driver}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Transportation</h3>
                  <p className="text-gray-600">{selectedTrip.carDetails}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Regions</h3>
                  <p className="text-gray-600">{selectedTrip.regions.join(', ')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Key Visits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.mainClients.map((client, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  onClick={closeTripModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => openTripItinerary(selectedTrip.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelItinerariesMain;