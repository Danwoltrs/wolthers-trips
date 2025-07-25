import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Users, Car, Clock, ChevronDown, ChevronUp, Plus, MessageSquare, Paperclip, Camera, Send, Eye, EyeOff } from 'lucide-react';

// TypeScript interfaces
interface Guest {
  company: string;
  names: string[];
}

interface Vehicle {
  type: string;
  driver: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  attachments?: { name: string; type: 'image' | 'file'; url: string }[];
}

interface Activity {
  time: string;
  description: string;
  location?: string;
  host?: string;
  comments: Comment[];
  isExpanded?: boolean;
}

interface Day {
  date: string;
  dayName: string;
  fullDate: Date;
  activities: Activity[];
  isExpanded?: boolean;
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
  subtitle: string;
  guests: Guest[];
  vehicles: Vehicle[];
  days: Day[];
  reviews: TripReview[];
  routeMap?: string;
}

const CoffeTripItinerary: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mitsui-trip');
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});
  const [expandedActivities, setExpandedActivities] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', isPublic: false });
  const [currentUser] = useState('Daniel Wolthers'); // This would come from auth context
  const todayRef = useRef<HTMLDivElement>(null);

  // Sample data matching the document
  const [trips, setTrips] = useState<{ [key: string]: Trip }>({
    'mitsui-trip': {
      id: 'mitsui-trip',
      title: 'Mitsui Sul de Minas trip',
      subtitle: 'Mitsui and KEY Coffee visit to main Varginha suppliers, July 2025',
      guests: [
        { company: 'Mitsui', names: ['Nakaya', 'Okada', 'Kurobe'] },
        { company: 'KEY COFFEE', names: ['Mr. Iwasaki', 'Mr. Ueno'] },
        { company: 'Wolthers', names: ['Daniel', 'Svenn', 'Tom'] }
      ],
      vehicles: [
        { type: 'Land Rover Discovery', driver: 'Petter Anderson' },
        { type: 'Land Rover Discovery', driver: 'Svenn Wolthers' },
        { type: 'Jeep Wrangler', driver: 'Edgar Gomes' }
      ],
      reviews: [
        {
          id: '1',
          author: 'Nakaya',
          company: 'Mitsui',
          rating: 5,
          comment: 'Excellent organization and very informative visits. The cupping sessions were particularly valuable.',
          isPublic: true,
          timestamp: new Date('2025-07-23')
        }
      ],
      days: [
        {
          date: 'Saturday, July 19th, 2025',
          dayName: 'Saturday',
          fullDate: new Date('2025-07-19'),
          activities: [
            { 
              time: '10:00', 
              description: 'Meeting with Sucafina at Sucafina office (office will be empty due to weekend)',
              comments: [
                {
                  id: '1',
                  author: 'Tom Wolthers',
                  text: 'Meeting went very well, discussed Q3 contracts',
                  timestamp: new Date('2025-07-19T10:30:00')
                }
              ]
            },
            { time: '10:45', description: 'Head to Wolthers office for a coffee', comments: [] },
            { time: '11:00', description: 'Meeting with Cofco at Wolthers & Associates', comments: [] },
            { time: '11:45', description: 'Cupping at Wolthers & Associates', comments: [] },
            { time: '12:30', description: 'Lunch', comments: [] }
          ]
        },
        {
          date: 'Sunday, July 20th, 2025',
          dayName: 'Sunday',
          fullDate: new Date('2025-07-20'),
          activities: [
            { time: '08:00', description: 'Leave to Varginha in three cars (5 hours drive)', comments: [] },
            { time: '12:00', description: 'Lunch en route', comments: [] },
            { time: '19:00', description: 'Meet Key Coffee Sunday night (2 people from Key Coffee and 1 person from Mitsui) at the Class Hotel', comments: [] },
            { time: '20:00', description: 'Overnight at the Class Hotel', comments: [] }
          ]
        },
        {
          date: 'Monday, July 21st, 2025',
          dayName: 'Monday',
          fullDate: new Date('2025-07-21'),
          activities: [
            { time: '07:30', description: 'Leave hotel to Gardingo', comments: [] },
            { time: '08:00', description: 'Visit to Gardingo Trading', host: 'Leo and Abraão Gardingo', comments: [] },
            { time: '10:00', description: 'After Gardingo one car returns to São Paulo with Mr. Iwasaki and Mr. Ueno from Key Coffee (4 people + driver/ Jeep Wrangler)', comments: [] },
            { time: '11:00', description: 'Mitsui visit to Minasul with Nakaya, Daniel, Tom and Svenn (Land Rover Discovery)', comments: [] },
            { time: '12:30', description: 'Lunch', comments: [] },
            { time: '14:00', description: 'Visit to Café Três Corações', host: 'Mr. Rogerio Otaviano', comments: [] },
            { time: '15:00', description: 'Visit to Brascof', host: 'Artur Ornelas', comments: [] },
            { time: '17:00', description: 'Visit to Cocatrel', host: 'Francisco Pereira', comments: [] },
            { time: '19:00', description: 'Departure to Guaxupé City (3 hours drive)', comments: [] },
            { time: '22:00', description: 'Overnight at the Ibis Hotel', comments: [] }
          ]
        },
        {
          date: 'Tuesday, July 22nd, 2025',
          dayName: 'Tuesday',
          fullDate: new Date('2025-07-22'),
          activities: [
            { time: '08:00', description: 'Arrive at Cooxupé', comments: [] },
            { time: '11:00', description: 'Visit to SMC', comments: [] },
            { time: '12:00', description: 'Drive to Alfenas', comments: [] },
            { time: '13:00', description: 'Lunch with Monte Alegre', host: 'Mr. Jose Francisco and Mr. Helio Leite', comments: [] },
            { time: '14:00', description: 'Cupping at the farm', comments: [] },
            { time: '15:00', description: 'Brief visit at farm', comments: [] },
            { time: '16:00', description: 'Drive to São Paulo Pullman hotel', comments: [] }
          ]
        }
      ]
    }
  });

  const currentTrip = trips[activeTab];
  const today = new Date('2025-07-20'); // Simulating current date

  // Auto-scroll to current day on load
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTab]);

  const getDayStatus = (dayDate: Date) => {
    const dayTime = dayDate.getTime();
    const todayTime = today.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (dayTime < todayTime) return 'past';
    if (dayTime >= todayTime && dayTime < todayTime + oneDayMs) return 'today';
    return 'future';
  };

  const getDayColor = (dayDate: Date) => {
    const status = getDayStatus(dayDate);
    switch (status) {
      case 'past': return 'bg-gray-500';
      case 'today': return 'bg-yellow-600';
      case 'future': return 'bg-green-700';
      default: return 'bg-gray-600';
    }
  };

  const toggleDay = (dayIndex: number) => {
    const dayKey = `day-${dayIndex}`;
    setExpandedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  const toggleActivity = (dayIndex: number, activityIndex: number) => {
    const activityKey = `activity-${dayIndex}-${activityIndex}`;
    setExpandedActivities(prev => ({
      ...prev,
      [activityKey]: !prev[activityKey]
    }));
  };

  const addComment = (dayIndex: number, activityIndex: number) => {
    const commentKey = `comment-${dayIndex}-${activityIndex}`;
    const commentText = newComment[commentKey];
    
    if (!commentText.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      text: commentText,
      timestamp: new Date()
    };

    setTrips(prev => {
      const updated = { ...prev };
      updated[activeTab].days[dayIndex].activities[activityIndex].comments.push(newCommentObj);
      return updated;
    });

    setNewComment(prev => ({
      ...prev,
      [commentKey]: ''
    }));
  };

  const addReview = () => {
    if (!newReview.comment.trim()) return;

    const review: TripReview = {
      id: Date.now().toString(),
      author: currentUser,
      company: 'Wolthers Associates',
      rating: newReview.rating,
      comment: newReview.comment,
      isPublic: newReview.isPublic,
      timestamp: new Date()
    };

    setTrips(prev => {
      const updated = { ...prev };
      updated[activeTab].reviews.push(review);
      return updated;
    });

    setNewReview({ rating: 5, comment: '', isPublic: false });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white md:shadow-lg md:rounded-lg overflow-hidden md:mx-auto mx-0 shadow-none rounded-none">
      {/* Header */}
      <div className="bg-green-800 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src="/api/placeholder/120/40" alt="Wolthers Associates" className="h-8" />
          </div>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
            Add to Calendar
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{currentTrip.title}</h1>
        <p className="text-green-200 mb-4">{currentTrip.subtitle}</p>
        
        {/* Guests and Vehicles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm px-2 md:px-0">
          <div>
            <div className="flex items-center mb-2">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-semibold">Guests:</span>
            </div>
            {currentTrip.guests.map((guest, index) => (
              <div key={index} className="ml-6 mb-1">
                <span className="font-medium">{guest.company}:</span> {guest.names.join(', ')}
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Car className="w-4 h-4 mr-2" />
              <span className="font-semibold">Cars:</span>
            </div>
            {currentTrip.vehicles.map((vehicle, index) => (
              <div key={index} className="ml-6 mb-1">
                {vehicle.type} / Driver: {vehicle.driver}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto">
        <div className="flex min-w-max px-2 md:px-0">
          {Object.keys(trips).map((tripId) => (
            <button
              key={tripId}
              onClick={() => setActiveTab(tripId)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tripId
                  ? 'border-green-600 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {trips[tripId].title}
            </button>
          ))}
          <button className="px-4 py-3 text-gray-400 hover:text-gray-600">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Route Map Section */}
      <div className="bg-gray-50 p-2 md:p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Route Map - Sul de Minas and Varginha Region</h3>
        <div className="bg-blue-100 h-48 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-600">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Interactive Map Placeholder</p>
            <p className="text-sm">Route visualization would go here</p>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="p-2 md:p-6">
        {currentTrip.days.map((day, dayIndex) => {
          const isExpanded = expandedDays[`day-${dayIndex}`] !== false;
          const isToday = getDayStatus(day.fullDate) === 'today';
          
          return (
            <div 
              key={dayIndex} 
              className="mb-4"
              ref={isToday ? todayRef : null}
            >
              {/* Day Header */}
              <div 
                className={`${getDayColor(day.fullDate)} text-white p-3 md:p-4 md:rounded-t-lg cursor-pointer flex items-center justify-between ${
                  isToday ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''
                }`}
                onClick={() => toggleDay(dayIndex)}
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold text-sm md:text-base">{day.date}</span>
                  {isToday && <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-bold">TODAY</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm">
                    + Add day
                  </button>
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Activities */}
              {isExpanded && (
                <div className="md:border border-t-0 md:rounded-b-lg">
                  {day.activities.map((activity, activityIndex) => {
                    const activityKey = `activity-${dayIndex}-${activityIndex}`;
                    const isActivityExpanded = expandedActivities[activityKey];
                    const commentKey = `comment-${dayIndex}-${activityIndex}`;
                    
                    return (
                      <div key={activityIndex} className="md:border-b last:md:border-b-0 border-b last:border-b-0">
                        {/* Activity Main Row */}
                        <div 
                          className={`p-3 md:p-4 flex items-start space-x-2 md:space-x-4 cursor-pointer hover:bg-gray-50 ${
                            activityIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                          onClick={() => toggleActivity(dayIndex, activityIndex)}
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm md:text-base">{activity.time}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 text-sm md:text-base">{activity.description}</p>
                            {activity.host && (
                              <p className="text-xs md:text-sm text-gray-600 mt-1">Host: {activity.host}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {activity.comments.length > 0 && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {activity.comments.length}
                              </span>
                            )}
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            {isActivityExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Expanded Activity Details */}
                        {isActivityExpanded && (
                          <div className="bg-gray-50 md:border-t border-t">
                            {/* Comments Section */}
                            <div className="p-2 md:p-4">
                              <h4 className="font-medium text-gray-800 mb-3">Comments & Updates</h4>
                              
                              {/* Existing Comments */}
                              {activity.comments.map((comment) => (
                                <div key={comment.id} className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-800">{comment.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {comment.timestamp.toLocaleDateString()} {comment.timestamp.toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{comment.text}</p>
                                  {comment.attachments && comment.attachments.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {comment.attachments.map((attachment, i) => (
                                        <div key={i} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                                          {attachment.type === 'image' ? <Camera className="w-3 h-3" /> : <Paperclip className="w-3 h-3" />}
                                          <span>{attachment.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Add Comment */}
                              <div className="bg-white rounded-lg p-3 border-2 border-dashed border-gray-200">
                                <textarea
                                  value={newComment[commentKey] || ''}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [commentKey]: e.target.value }))}
                                  placeholder="Add a comment, update, or note..."
                                  className="w-full p-2 border rounded-lg text-sm resize-none"
                                  rows={2}
                                />
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex space-x-2">
                                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm">
                                      <Paperclip className="w-4 h-4" />
                                      <span>Attach</span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm">
                                      <Camera className="w-4 h-4" />
                                      <span>Photo</span>
                                    </button>
                                  </div>
                                  <button 
                                    onClick={() => addComment(dayIndex, activityIndex)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Post</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-gray-600 font-medium">End of Coffee Trip</p>
      </div>

      {/* Comments and Suggestions Section */}
      <div className="bg-gray-50 p-2 md:p-6 border-t">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Comments and Suggestions</h3>
        <p className="text-gray-600 mb-6">Share your experience and help us improve future trips</p>

        {/* Existing Reviews */}
        {currentTrip.reviews.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Trip Reviews</h4>
            {currentTrip.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{review.author}</span>
                    <span className="text-sm text-gray-500">({review.company})</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                    {review.isPublic ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{review.timestamp.toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Review */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3">Write a Review</h4>
          
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your thoughts about the trip, organization, visits, accommodation, etc..."
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
            />
          </div>

          {/* Public/Private toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newReview.isPublic}
                onChange={(e) => setNewReview(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Make this review public</span>
              <span className="text-xs text-gray-500 hidden md:inline">(visible to other trip participants and future guests)</span>
            </label>
            
            <button 
              onClick={addReview}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeTripItinerary;