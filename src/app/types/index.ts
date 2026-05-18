export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  isBlocked?: boolean;
}

export interface Venue {
  id: string;
  providerId: string;
  name: string;
  location: string;
  price: number;
  description: string;
  image: string;
  availability: boolean;
  isApproved: boolean;
  createdAt: string;
  capacity?: number;
  amenities?: string[];
  rating?: number;
}

export interface TimeSlot {
  id: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface VenueAvailability {
  id: string;
  venueId: string;
  date: string;
  timeSlots: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  venueId: string;
  venueName: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
}