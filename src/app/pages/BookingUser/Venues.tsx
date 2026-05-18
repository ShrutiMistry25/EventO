import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { MapPin, Users, Star, Search } from 'lucide-react';
import { getVenues, getVenueAvailability } from '../../utils/localStorage';
import type { Venue } from '../../types';

export default function Venues() {
    // debugCounts removed
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const matchesTimeframe = (slot: string, timeframe: string) => {
    if (timeframe === 'morning') return slot === '9:00 AM - 12:00 PM';
    if (timeframe === 'afternoon') return (
      slot === '12:00 PM - 3:00 PM' ||
      slot === '3:00 PM - 6:00 PM'
    );
    if (timeframe === 'evening') return (
      slot === '6:00 PM - 9:00 PM' ||
      slot === '9:00 PM - 12:00 AM'
    );
    return true;
  };

  useEffect(() => {
    // Filter only approved venues that are available
    const allVenues = getVenues().filter((v) => v.isApproved && v.availability);
    const venueAvailability = getVenueAvailability();

    let filtered = allVenues;
    const locationParam = searchParams.get('location');
    const dateParam = searchParams.get('date');
    // Normalize dateParam to YYYY-MM-DD to match stored availability dates
    let normalizedDate = dateParam || '';
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        normalizedDate = parsed.toISOString().slice(0, 10);
      }
    }
    const timeParam = searchParams.get('time');

    let afterLocation = filtered;
    let afterDate = filtered;
    let afterTime = filtered;

    if (locationParam) {
      afterLocation = filtered.filter((v) =>
        v.location.toLowerCase().includes(locationParam.toLowerCase())
      );
      filtered = afterLocation;
    }

    if (normalizedDate) {
      afterDate = filtered.filter((v) =>
        venueAvailability.some(
          (a) => a.venueId === v.id && a.date === normalizedDate && a.timeSlots.length > 0
        )
      );
      filtered = afterDate;
    }

    if (timeParam) {
      afterTime = filtered.filter((v) =>
        venueAvailability.some(
          (a) =>
            a.venueId === v.id &&
            (!normalizedDate || a.date === normalizedDate) &&
            a.timeSlots.some((slot) => matchesTimeframe(slot, timeParam))
        )
      );
      filtered = afterTime;
    }

    // If date/time filtering yields no results but location had matches,
    // fall back to showing location matches and surface a notice.
    let finalFiltered = filtered;
    let usedFallback = false;
    if (finalFiltered.length === 0 && locationParam && afterLocation.length > 0) {
      finalFiltered = afterLocation;
      usedFallback = true;
    }

    // debug counts removed

    setVenues(finalFiltered);
    setFilteredVenues(finalFiltered);
  }, [searchParams]);

  useEffect(() => {
    let filtered = venues;

    // Apply search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(lowerQuery) ||
          v.location.toLowerCase().includes(lowerQuery) ||
          v.description?.toLowerCase().includes(lowerQuery) ||
          v.amenities?.some((amenity) =>
            amenity.toLowerCase().includes(lowerQuery)
          )
      );
    }

    if (availableOnly) {
      filtered = filtered.filter((v) => v.availability);
    }

    setFilteredVenues(filtered);
  }, [searchQuery, availableOnly, venues]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Venues</h1>
          <p className="text-gray-600 mt-1">
            {filteredVenues.length} venues available
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <label className="flex items-center gap-2 bg-white px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Available Only
              </span>
            </label>
          </div>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No venues found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/img4.avif';
                    }}
                    className="w-full h-full object-cover"
                  />
                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                      {venue.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {/* Rating */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {venue.rating ?? 4.5}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {venue.location}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {venue.description || 'No description available.'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Up to {venue.capacity ?? 'N/A'}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1">
                    {venue.amenities?.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities && venue.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{venue.amenities.length - 3} more
                      </span>
                    )}
                    {!venue.amenities?.length && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        No amenities listed
                      </span>
                    )}
                  </div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{venue.price}
                      </span>
                      <span className="text-gray-600 text-sm">/day</span>
                    </div>
                    <button
                      onClick={() => navigate(`/user/booking/${venue.id}`)}
                      className="px-5 py-2.5 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
