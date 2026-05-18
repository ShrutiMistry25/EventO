import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Calendar, Clock, DollarSign, MapPin, Users, Star } from 'lucide-react';
import { getVenueById, getBookings, getVenueAvailability } from '../../utils/localStorage';
import type { Venue } from '../../types';

const timeSlots = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
  '9:00 PM - 12:00 AM',
];

export default function Booking() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [guests, setGuests] = useState(50);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);

  useEffect(() => {
    const found = getVenueById(venueId || '');
    if (found && found.isApproved && found.availability) {
      setVenue(found);
    } else {
      navigate('/user/venues');
    }
  }, [venueId, navigate]);

  if (!venue) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue...</p>
        </div>
      </div>
    );
  }

  const services = [
    { id: 'catering', name: 'Premium Catering', price: 40000 },
    { id: 'decoration', name: 'Event Decoration', price: 20000 },
    { id: 'photography', name: 'Photography Package', price: 15000 },
    { id: 'sound', name: 'Sound System', price: 10000 },
  ];

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !venue) return timeSlots;

    const availability = getVenueAvailability();
    const availableSlotsForDate = availability
      .filter((a) => a.venueId === venue.id && a.date === selectedDate)
      .flatMap((a) => a.timeSlots);

    const timeSlotsToShow = availableSlotsForDate.length > 0
      ? Array.from(new Set(availableSlotsForDate))
      : timeSlots;

    const bookings = getBookings();
    const bookedSlots = bookings
      .filter(booking =>
        booking.venueId === venue.id &&
        booking.date === selectedDate &&
        (booking.status === 'confirmed' || booking.status === 'pending')
      )
      .map(booking => booking.timeSlot);

    return timeSlotsToShow.filter(slot => !bookedSlots.includes(slot));
  };

  const toggleService = (serviceId: string) => {
    setAdditionalServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    let total = venue.price;
    additionalServices.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) total += service.price;
    });
    return total;
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    // Store booking details in sessionStorage for payment page
    const bookingData = {
      venue,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      guests,
      services: additionalServices,
      total: calculateTotal(),
    };
    sessionStorage.setItem('pending_booking', JSON.stringify(bookingData));
    navigate('/user/payment');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/user/venues')}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
      >
        ← Back to Venues
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Info Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {venue.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {venue.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Up to {venue.capacity} guests
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      4.8
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">{venue.description}</p>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">
                Select Date & Time
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTimeSlot(''); // Clear time slot when date changes
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select a time slot</option>
                    {getAvailableTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 inline mr-1" />
                  Expected Guests: {guests}
                </label>
                <input
                  type="range"
                  min="10"
                  max={venue.capacity}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>10 guests</span>
                  <span>{venue.capacity} guests</span>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Additional Services
              </h2>
              <div className="space-y-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={additionalServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          +₹{service.price}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Booking Summary
              </h2>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Venue Price</span>
                  <span className="font-semibold">₹{venue.price}</span>
                </div>
                {additionalServices.map((serviceId) => {
                  const service = services.find((s) => s.id === serviceId);
                  return service ? (
                    <div
                      key={serviceId}
                      className="flex justify-between text-gray-700 text-sm"
                    >
                      <span>{service.name}</span>
                      <span className="font-semibold">+₹{service.price}</span>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-blue-600">
                  ₹{calculateTotal()}
                </span>
              </div>

              {selectedDate && selectedTimeSlot && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    {selectedTimeSlot}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4" />
                    {guests} guests
                  </p>
                </div>
              )}

              <button
                onClick={handleConfirmBooking}
                disabled={!selectedDate || !selectedTimeSlot}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  selectedDate && selectedTimeSlot
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Payment
              </button>

              <p className="text-xs text-gray-500 text-center">
                You won't be charged until you confirm the booking
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
