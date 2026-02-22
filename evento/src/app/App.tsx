import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext'; // Use ./ instead of ../
import { router } from './routes'; // This is correct (same folder)
import { useEffect } from 'react';
import { initializeMockData } from './utils/initializeMockData'; // Now this needs 'utils'
import { Toaster } from './components/ui/sonner'; // Use ./ instead of ../

export default function App() {
  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}







/**
 * VenueBook - Complete Venue Booking Marketplace Platform
 * 
 * Three User Roles:
 * 
 * 👑 Admin (admin@venuebook.com / admin123)
 * - Full system control
 * - Manage users, venues, and bookings
 * - View platform analytics
 * 
 * 🏢 Provider (sarah@venues.com / provider123)
 * - Add and manage venues
 * - View bookings and earnings
 * - Set availability calendar
 * - Chat with customers
 * 
 * 👤 Customer (emily@customer.com / customer123)
 * - Search and book venues
 * - Make payments
 * - Chat with providers
 * - View booking history
 * 
 * All data is stored in localStorage for demo purposes.
 */