import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { 
  getVenuesByProviderId, 
  getBookingsByProviderId, 
  deleteVenue, 
  updateVenue,
  getCurrentUser 
} from '../../utils/localStorage';
import type { Venue, Booking } from '../../types';
import { toast } from 'sonner';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
  });

  useEffect(() => {
    // Check authentication and get current user
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'provider') {
      toast.error('Access denied. Provider only.');
      navigate('/login');
      return;
    }

    loadData(currentUser.id);
  }, [navigate]);

  const loadData = (providerId: string) => {
    // PRIVACY RULE: Only fetch venues belonging to this provider
    const providerVenues = getVenuesByProviderId(providerId);
    const providerBookings = getBookingsByProviderId(providerId);
    
    setVenues(providerVenues);
    setBookings(providerBookings);

    // Calculate stats from provider's own data
    const totalEarnings = providerBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    const upcomingBookings = providerBookings.filter((b) => {
      const bookingDate = new Date(b.date);
      return bookingDate >= new Date() && (b.status === 'confirmed' || b.status === 'pending');
    }).length;

    setStats({
      totalVenues: providerVenues.length,
      totalBookings: providerBookings.length,
      totalEarnings,
      upcomingBookings,
    });
  };

  const handleDeleteVenue = (venueId: string) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      deleteVenue(venueId);
      
      // Reload data
      const currentUser = getCurrentUser();
      if (currentUser) {
        loadData(currentUser.id);
      }
      
      toast.success('Venue deleted successfully');
    }
  };

  const toggleAvailability = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      updateVenue(venueId, { availability: !venue.availability });
      
      // Reload data
      const currentUser = getCurrentUser();
      if (currentUser) {
        loadData(currentUser.id);
      }
      
      toast.success(`Venue marked as ${!venue.availability ? 'available' : 'unavailable'}`);
    }
  };

  return (
    <DashboardLayout role="provider">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Manage your venues and bookings</p>
          </div>
          <button
            onClick={() => navigate('/provider/add-venue')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            Add New Venue
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">My Venues</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalVenues}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">My Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">My Earnings</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalEarnings.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Upcoming Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.upcomingBookings}</p>
          </div>
        </div>

        {/* My Venues */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Venues</h2>
          
          {venues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No venues yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first venue
              </p>
              <button
                onClick={() => navigate('/provider/add-venue')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Venue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {venue.name}
                          </h3>
                          <p className="text-gray-600 text-sm">{venue.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              venue.availability
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {venue.availability ? 'Available' : 'Unavailable'}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              venue.isApproved
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {venue.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2">
                        {venue.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Capacity: {venue.capacity || 'N/A'}</span>
                        <span>•</span>
                        <span className="font-semibold text-blue-600">
                          ₹{venue.price}/hour
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => toggleAvailability(venue.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            venue.availability
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {venue.availability ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                        <button
                          onClick={() => handleDeleteVenue(venue.id)}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600">
                Bookings will appear here once customers book your venues
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Venue
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {booking.venueName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {booking.timeSlot}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ₹{booking.totalPrice}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}