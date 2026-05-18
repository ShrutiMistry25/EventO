import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';
import { getVenues, deleteVenue, updateVenue, getCurrentUser, getUserById } from '../../utils/localStorage';
import type { Venue } from '../../types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export default function AdminVenues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/login');
      return;
    }

    loadVenues();
  }, [navigate]);

  const loadVenues = () => {
    const allVenues = getVenues();
    setVenues(allVenues);
  };

  const filteredVenues = venues.filter(venue => {
    const query = searchQuery.toLowerCase();
    return (
      venue.name.toLowerCase().includes(query) ||
      venue.location.toLowerCase().includes(query)
    );
  });

  const handleApproveVenue = (venue: Venue) => {
    updateVenue(venue.id, { isApproved: true });
    loadVenues();
    toast.success('Venue approved successfully');
  };

  const handleRejectVenue = (venue: Venue) => {
    updateVenue(venue.id, { isApproved: false });
    loadVenues();
    toast.success('Venue rejected');
  };

  const handleDeleteVenue = () => {
    if (!selectedVenue) return;

    deleteVenue(selectedVenue.id);
    loadVenues();
    toast.success('Venue deleted successfully');
    setDeleteDialogOpen(false);
    setSelectedVenue(null);
  };

  const getProviderName = (providerId: string) => {
    const provider = getUserById(providerId);
    return provider?.fullName || 'Unknown Provider';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Venues</h1>
              <p className="text-sm text-gray-600">Approve, reject, or delete venue listings</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by venue name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Venues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venues.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {venues.filter(v => v.isApproved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {venues.filter(v => !v.isApproved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {venues.filter(v => v.availability).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No venues found
            </div>
          ) : (
            filteredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://media.istockphoto.com/id/1184628725/photo/3d-wedding-reception-background-illustration.jpg?s=612x612&w=0&k=20&c=XpFfBNDKM99vaK0N0QkvkvDFNRWIRmJNTkP6qDJbSI8=';
                    }}
                  />
                  {venue.isApproved ? (
                    <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{venue.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {venue.location}
                    </div>
                    <div className="flex items-center gap-2">
                      ₹{venue.price}/hour
                    </div>
                    <div className="text-xs text-gray-500">
                      Provider: {getProviderName(venue.providerId)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!venue.isApproved ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveVenue(venue)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRejectVenue(venue)}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedVenue(venue);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the venue <strong>{selectedVenue?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVenue} className="bg-red-600 hover:bg-red-700">
              Delete Venue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
