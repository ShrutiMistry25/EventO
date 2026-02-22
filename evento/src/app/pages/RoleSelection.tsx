import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Building2, User } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { selectRole } = useAuth();

  const handleRoleSelect = (role: 'user' | 'provider') => {
    selectRole(role);
    if (role === 'user') {
      navigate('/user');
    } else {
      navigate('/provider');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Role</h1>
          <p className="text-lg text-gray-600">How would you like to use VenueBook?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking User Card */}
          <button
            onClick={() => handleRoleSelect('user')}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Booking User</h2>
                <p className="text-gray-600">
                  Find and book amazing venues and plots for your events
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Search and browse venues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Book venues instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Chat with venue providers</span>
                </div>
              </div>

              <div className="pt-4 w-full">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium group-hover:bg-blue-100 transition-colors">
                  Continue as Customer →
                </div>
              </div>
            </div>
          </button>

          {/* Provider Card */}
          <button
            onClick={() => handleRoleSelect('provider')}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Venue Provider</h2>
                <p className="text-gray-600">
                  List your venues and plots to reach more customers
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Manage your venues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Track bookings & earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Connect with customers</span>
                </div>
              </div>

              <div className="pt-4 w-full">
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium group-hover:bg-purple-100 transition-colors">
                  Continue as Provider →
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
