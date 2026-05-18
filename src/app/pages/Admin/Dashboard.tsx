import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  UserCog,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { getUsers, getVenues, getBookings, getCurrentUser, logout } from '../../utils/localStorage';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalVenues: 0,
    approvedVenues: 0,
    pendingVenues: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/login');
      return;
    }

    loadStats();
  }, [navigate]);

  const loadStats = () => {
    const users = getUsers();
    const venues = getVenues();
    const bookings = getBookings();

    const providers = users.filter(u => u.role === 'provider');
    const customers = users.filter(u => u.role === 'customer');
    const approvedVenues = venues.filter(v => v.isApproved);
    const pendingVenues = venues.filter(v => !v.isApproved);
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    setStats({
      totalUsers: users.length,
      totalProviders: providers.length,
      totalCustomers: customers.length,
      totalVenues: venues.length,
      approvedVenues: approvedVenues.length,
      pendingVenues: pendingVenues.length,
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      totalRevenue,
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">System Management</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="text-sm text-gray-500 mt-1">
                {stats.totalProviders} providers, {stats.totalCustomers} customers
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Venues</CardTitle>
              <Building2 className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalVenues}</div>
              <div className="text-sm text-gray-500 mt-1">
                {stats.approvedVenues} approved, {stats.pendingVenues} pending
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
              <Calendar className="w-5 h-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
              <div className="text-sm text-gray-500 mt-1">
                {stats.completedBookings} completed
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                Platform revenue
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View, edit, block, or delete user accounts</p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                View Users
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/venues')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Manage Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Approve, reject, or delete venue listings</p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700">
                View Venues
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/bookings')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Manage Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View all bookings and payment status</p>
              <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700">
                View Bookings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">System Status</p>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Platform Health</p>
                  <p className="text-sm text-gray-600">{stats.totalVenues} active venues, {stats.totalUsers} registered users</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
