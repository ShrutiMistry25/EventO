import type { User, Venue, Booking } from '../types';
import { 
  getUsers, 
  saveUsers, 
  getVenues, 
  saveVenues, 
  getBookings, 
  saveBookings 
} from './localStorage';

export const initializeMockData = () => {
  // Only initialize if there's no data yet
  const existingVenues = getVenues();
  const existingBookings = getBookings();
  
  if (existingVenues.length > 0 || existingBookings.length > 0) {
    return; // Data already exists
  }

  // Create sample users
  const sampleUsers: User[] = [
    {
      id: 'provider-1',
      fullName: 'Sarah Johnson',
      email: 'sarah@venues.com',
      password: 'provider123',
      role: 'provider',
      createdAt: '2025-01-15T10:00:00Z',
      isBlocked: false,
    },
    {
      id: 'provider-2',
      fullName: 'Michael Chen',
      email: 'michael@venues.com',
      password: 'provider123',
      role: 'provider',
      createdAt: '2025-01-20T10:00:00Z',
      isBlocked: false,
    },
    {
      id: 'customer-1',
      fullName: 'Emily Davis',
      email: 'emily@customer.com',
      password: 'customer123',
      role: 'customer',
      createdAt: '2025-02-01T10:00:00Z',
      isBlocked: false,
    },
    {
      id: 'customer-2',
      fullName: 'David Martinez',
      email: 'david@customer.com',
      password: 'customer123',
      role: 'customer',
      createdAt: '2025-02-05T10:00:00Z',
      isBlocked: false,
    },
  ];

  // Merge with existing users (keeping admin)
  const currentUsers = getUsers();
  const mergedUsers = [...currentUsers, ...sampleUsers.filter(su => !currentUsers.find(u => u.id === su.id))];
  saveUsers(mergedUsers);

  // Create sample venues
  const sampleVenues: Venue[] = [
    {
      id: 'venue-1',
      providerId: 'provider-1',
      name: 'Grand Ballroom',
      location: 'Downtown, New York',
      price: 500,
      description: 'Elegant ballroom perfect for weddings and corporate events. Features crystal chandeliers and marble floors.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8b13e?w=800',
      availability: true,
      isApproved: true,
      createdAt: '2025-01-16T10:00:00Z',
      capacity: 300,
      amenities: ['WiFi', 'Catering', 'Parking', 'Sound System'],
    },
    {
      id: 'venue-2',
      providerId: 'provider-1',
      name: 'Rooftop Terrace',
      location: 'Manhattan, New York',
      price: 350,
      description: 'Stunning rooftop venue with city views. Perfect for cocktail parties and private events.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      availability: true,
      isApproved: true,
      createdAt: '2025-01-17T10:00:00Z',
      capacity: 150,
      amenities: ['WiFi', 'Bar', 'Outdoor Seating', 'City View'],
    },
    {
      id: 'venue-3',
      providerId: 'provider-2',
      name: 'Conference Center',
      location: 'Silicon Valley, California',
      price: 400,
      description: 'Modern conference center with state-of-the-art technology. Ideal for business meetings and seminars.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      availability: true,
      isApproved: true,
      createdAt: '2025-01-21T10:00:00Z',
      capacity: 200,
      amenities: ['WiFi', 'Projector', 'Video Conferencing', 'Catering'],
    },
    {
      id: 'venue-4',
      providerId: 'provider-2',
      name: 'Garden Pavilion',
      location: 'Los Angeles, California',
      price: 300,
      description: 'Beautiful garden venue surrounded by lush greenery. Perfect for outdoor weddings and celebrations.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      availability: true,
      isApproved: true,
      createdAt: '2025-01-22T10:00:00Z',
      capacity: 100,
      amenities: ['Garden', 'Outdoor', 'Catering', 'Parking'],
    },
    {
      id: 'venue-5',
      providerId: 'provider-1',
      name: 'Art Gallery Space',
      location: 'Brooklyn, New York',
      price: 250,
      description: 'Contemporary art gallery available for private events. Features rotating exhibitions and modern aesthetics.',
      image: 'https://images.unsplash.com/photo-1513619869412-d0e49268c7e6?w=800',
      availability: true,
      isApproved: true,
      createdAt: '2025-01-25T10:00:00Z',
      capacity: 80,
      amenities: ['WiFi', 'Gallery Space', 'Modern Decor', 'Sound System'],
    },
    {
      id: 'venue-6',
      providerId: 'provider-2',
      name: 'Historic Mansion',
      location: 'Boston, Massachusetts',
      price: 600,
      description: 'Restored historic mansion with period architecture. Exclusive venue for elegant affairs.',
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
      availability: true,
      isApproved: false, // Pending approval
      createdAt: '2025-02-10T10:00:00Z',
      capacity: 120,
      amenities: ['Historic', 'Elegant', 'Parking', 'Gardens'],
    },
  ];

  saveVenues(sampleVenues);

  // Create sample bookings
  const sampleBookings: Booking[] = [
    {
      id: 'booking-1',
      customerId: 'customer-1',
      providerId: 'provider-1',
      venueId: 'venue-1',
      venueName: 'Grand Ballroom',
      date: '2025-03-15',
      timeSlot: '18:00 - 23:00',
      totalPrice: 2500,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2025-02-10T10:00:00Z',
    },
    {
      id: 'booking-2',
      customerId: 'customer-2',
      providerId: 'provider-2',
      venueId: 'venue-3',
      venueName: 'Conference Center',
      date: '2025-02-25',
      timeSlot: '09:00 - 17:00',
      totalPrice: 3200,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2025-02-08T10:00:00Z',
    },
    {
      id: 'booking-3',
      customerId: 'customer-1',
      providerId: 'provider-1',
      venueId: 'venue-2',
      venueName: 'Rooftop Terrace',
      date: '2025-04-01',
      timeSlot: '19:00 - 01:00',
      totalPrice: 2100,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2025-02-14T10:00:00Z',
    },
  ];

  saveBookings(sampleBookings);
};
