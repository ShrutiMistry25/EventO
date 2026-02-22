export interface Venue {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  available: boolean;
  capacity: number;
  amenities: string[];
  description: string;
  rating: number;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Grand Ballroom Plaza',
    location: 'Downtown Manhattan, NY',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8287c?w=800',
    available: true,
    capacity: 500,
    amenities: ['Parking', 'Catering', 'WiFi', 'AC'],
    description: 'Elegant ballroom perfect for weddings and corporate events',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Sunset Garden Venue',
    location: 'Beverly Hills, CA',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    available: true,
    capacity: 300,
    amenities: ['Outdoor Space', 'Garden', 'Catering', 'Lighting'],
    description: 'Beautiful outdoor garden with stunning sunset views',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Modern Conference Center',
    location: 'Austin, TX',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    available: true,
    capacity: 200,
    amenities: ['AV Equipment', 'WiFi', 'Parking', 'AC'],
    description: 'State-of-the-art conference facility for business events',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Rustic Barn Retreat',
    location: 'Nashville, TN',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    available: false,
    capacity: 150,
    amenities: ['Outdoor Space', 'Parking', 'Rustic Decor'],
    description: 'Charming rustic barn with countryside charm',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Lakeside Pavilion',
    location: 'Seattle, WA',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    available: true,
    capacity: 400,
    amenities: ['Lake View', 'Outdoor Space', 'Catering', 'Parking'],
    description: 'Stunning lakeside venue with panoramic water views',
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Urban Rooftop Lounge',
    location: 'Chicago, IL',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
    available: true,
    capacity: 250,
    amenities: ['City Views', 'Bar', 'WiFi', 'Lighting'],
    description: 'Chic rooftop space with breathtaking city skyline',
    rating: 4.8,
  },
];

export const timeSlots = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
  '9:00 PM - 12:00 AM',
];

export const locations = [
  'All Locations',
  'New York',
  'California',
  'Texas',
  'Tennessee',
  'Washington',
  'Illinois',
];

// Storage utilities
export const getVenues = (): Venue[] => {
  const stored = localStorage.getItem('venuebooking_venues');
  return stored ? JSON.parse(stored) : mockVenues;
};

export const saveVenues = (venues: Venue[]) => {
  localStorage.setItem('venuebooking_venues', JSON.stringify(venues));
};

export const getBookings = (): Booking[] => {
  const stored = localStorage.getItem('venuebooking_bookings');
  return stored ? JSON.parse(stored) : [];
};

export const saveBooking = (booking: Booking) => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('venuebooking_bookings', JSON.stringify(bookings));
};

export const getMessages = (): Message[] => {
  const stored = localStorage.getItem('venuebooking_messages');
  return stored ? JSON.parse(stored) : [];
};

export const saveMessage = (message: Message) => {
  const messages = getMessages();
  messages.push(message);
  localStorage.setItem('venuebooking_messages', JSON.stringify(messages));
};

// Initialize venues if not already in storage
if (!localStorage.getItem('venuebooking_venues')) {
  saveVenues(mockVenues);
}
