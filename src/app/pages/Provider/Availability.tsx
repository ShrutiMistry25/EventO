import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, Plus, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { timeSlots } from '../../utils/mockData';
import { getCurrentUser, getVenuesByProviderId, saveVenueAvailability } from '../../utils/localStorage';
import type { Venue, VenueAvailability } from '../../types';

interface AvailabilitySlot extends VenueAvailability {}

export default function Availability() {
  const navigate = useNavigate();
  const [providerVenues, setProviderVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => {
    const stored = localStorage.getItem('venue_availability');
    return stored ? JSON.parse(stored) : [];
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'provider') {
      navigate('/login');
      return;
    }

    const venues = getVenuesByProviderId(currentUser.id);
    setProviderVenues(venues);
    if (venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [navigate]);

  // Get current month dates for calendar
  const getCurrentMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    return dates;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
    setSelectedDate(''); // Clear selection when changing months
    setSelectedDateObj(null);
  };

  const dates = getCurrentMonthDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedVenueAvailability = availability.filter(
    (a) => a.venueId === selectedVenueId
  );

  const selectedVenue = providerVenues.find((v) => v.id === selectedVenueId);

  const toggleTimeSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleAddAvailability = () => {
    if (!selectedVenueId || !selectedDateObj || selectedSlots.length === 0) {
      alert('Please select a venue, a date, and at least one time slot');
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      venueId: selectedVenueId,
      date: selectedDateObj.toISOString().split('T')[0],
      timeSlots: selectedSlots,
    };

    const updatedAvailability = [...availability, newSlot];
    setAvailability(updatedAvailability);
    saveVenueAvailability(updatedAvailability);

    // Reset form
    setSelectedDate('');
    setSelectedDateObj(null);
    setSelectedSlots([]);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const removeAvailability = (id: string) => {
    const updated = availability.filter((a) => a.id !== id);
    setAvailability(updated);
    saveVenueAvailability(updated);
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return selectedVenueAvailability.some((a) => a.date === dateStr);
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return selectedVenueAvailability.filter((a) => a.date === dateStr);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/provider')}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
      >
        ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
              <p className="text-gray-600 text-sm">
                Set available dates and time slots for your venues
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Availability added successfully!
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Calendar</h2>

            {/* Month Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
              </div>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Date Jump Input */}
            <div className="flex items-center justify-center gap-3">
              <label className="text-sm font-medium text-gray-700">Jump to date:</label>
              <input
                type="date"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const selectedDate = new Date(value + 'T00:00:00');
                    setCurrentMonth(selectedDate);
                    setSelectedDate(''); // Clear any selection
                    setSelectedDateObj(null);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Quick Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                const isCurrent = date.getMonth() === currentMonth.getMonth() &&
                                date.getFullYear() === currentMonth.getFullYear();
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentMonth(date)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </button>
                );
              })}
            </div>

            {/* Calendar Grid */}
            <div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-7 gap-2 ml-8">
                {/* Empty cells for alignment */}
                {Array.from({ length: dates[0]?.getDay() || 0 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Date cells */}
                {dates.map((date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = date < today;
                  const isToday = date.toDateString() === today.toDateString();
                  const hasAvailability = isDateAvailable(date);
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;

                  return (
                    <div key={date.toISOString()} className="relative">
                      <button
                        onClick={() => {
                          if (!isPast) {
                            setSelectedDate(dateStr);
                            setSelectedDateObj(new Date(date));
                          }
                        }}
                        disabled={isPast}
                        className={`aspect-square rounded-lg text-sm font-medium transition-all relative flex items-center justify-center ${
                          isPast
                            ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                            : isSelected
                            ? 'bg-blue-600 text-white shadow-lg'
                            : hasAvailability
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {date.getDate()}
                        {isToday && !isSelected && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-gray-600">Not Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </div>

          {/* Time Slots Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Select Venue */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Select Venue</h2>
              </div>
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="">Select a venue</option>
                {providerVenues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Availability */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Add Time Slots</h2>
              </div>

              {selectedDateObj ? (
                <>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      {selectedDateObj.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Select available time slots:
                    </p>
                    {timeSlots.map((slot) => (
                      <label
                        key={slot}
                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSlots.includes(slot)}
                          onChange={() => toggleTimeSlot(slot)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{slot}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleAddAvailability}
                    disabled={selectedSlots.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Availability
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Select a date from the calendar to add time slots
                  </p>
                </div>
              )}
            </div>

            {/* Existing Availability */}
            {selectedDateObj && selectedVenueId && getAvailabilityForDate(selectedDateObj).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Current Availability</h3>
                {getAvailabilityForDate(selectedDateObj).map((avail) => (
                  <div
                    key={avail.id}
                    className="border border-gray-200 rounded-lg p-3 space-y-2"
                  >
                    {avail.timeSlots.map((slot) => (
                      <div
                        key={slot}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{slot}</span>
                        <button
                          onClick={() => removeAvailability(avail.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
