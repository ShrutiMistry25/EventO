# VenueBook - Implementation Notes

## Overview
Complete venue booking marketplace platform with three user roles: Admin, Provider, and Customer.

## Key Features Implemented

### 1. Authentication System
- **Signup Page** (`/signup`)
  - Full name, email, password validation
  - Password confirmation
  - Role selection (Customer, Provider, Admin disabled for signup)
  - Email format and password minimum length validation
  
- **Login Page** (`/login`)
  - Email and password authentication
  - Role-based routing
  - Account blocking detection
  - Demo credentials provided

### 2. Admin Dashboard (`/admin`)
- **Overview**: Platform statistics (users, venues, bookings, revenue)
- **Manage Users** (`/admin/users`): 
  - View all users
  - Block/unblock users
  - Delete users (except admins)
  - Search functionality
  
- **Manage Venues** (`/admin/venues`):
  - View all venues
  - Approve/reject venues
  - Delete venues
  - Search by name/location
  
- **Manage Bookings** (`/admin/bookings`):
  - View all bookings
  - Cancel bookings
  - Track payment status
  - Revenue analytics

### 3. Provider Dashboard (`/provider`)
- **PRIVACY RULE IMPLEMENTED**: 
  - Providers see ONLY their own venues
  - Providers see ONLY bookings for their venues
  - Stats calculated from their own data only
  
- **Features**:
  - Add new venues (pending admin approval)
  - Manage venue availability
  - View earnings from their venues
  - Track upcoming bookings
  - Delete venues

### 4. Customer Dashboard (`/user`)
- Search and book venues
- View booking history
- Make payments
- Chat with providers

## Data Structure

### User
```typescript
{
  id: string
  fullName: string
  email: string
  password: string
  role: 'customer' | 'provider' | 'admin'
  createdAt: string
  isBlocked: boolean
}
```

### Venue
```typescript
{
  id: string
  providerId: string  // IMPORTANT: Links venue to provider
  name: string
  location: string
  price: number
  description: string
  image: string
  availability: boolean
  isApproved: boolean  // Admin approval required
  createdAt: string
  capacity: number
  amenities: string[]
}
```

### Booking
```typescript
{
  id: string
  customerId: string
  providerId: string  // For filtering provider bookings
  venueId: string
  venueName: string
  date: string
  timeSlot: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
}
```

## Privacy Implementation

### Provider Privacy Rule
- Each venue stores `providerId`
- When fetching venues: `getVenuesByProviderId(currentUser.id)`
- When fetching bookings: `getBookingsByProviderId(currentUser.id)`
- Stats calculated only from provider's own data

### Admin Access
- Admins see ALL data across the platform
- Can manage users, venues, and bookings
- Cannot delete or block other admins

### Customer Access
- Customers see approved venues only
- Can book available venues
- See their own booking history

## Mock Data
Located in `/src/app/utils/initializeMockData.ts`
- Pre-loaded sample users (2 providers, 2 customers)
- Pre-loaded sample venues (6 venues)
- Pre-loaded sample bookings (3 bookings)
- Default admin: admin@venuebook.com / admin123

## localStorage Keys
- `venuebook_users` - All user accounts
- `venuebook_venues` - All venue listings
- `venuebook_bookings` - All bookings
- `venuebook_chat_messages` - Chat messages
- `venuebook_time_slots` - Venue availability slots
- `venuebook_current_user` - Current session user

## Demo Credentials

### Admin
- Email: admin@venuebook.com
- Password: admin123

### Provider
- Email: sarah@venues.com
- Password: provider123

### Customer
- Email: emily@customer.com
- Password: customer123

## Technical Stack
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Radix UI components
- localStorage for data persistence
- Sonner for toast notifications
- Lucide React for icons

## File Structure
```
/src/app/
  ├── pages/
  │   ├── Signup.tsx
  │   ├── Login.tsx
  │   ├── Admin/
  │   │   ├── Dashboard.tsx
  │   │   ├── Users.tsx
  │   │   ├── Venues.tsx
  │   │   └── Bookings.tsx
  │   ├── Provider/
  │   │   ├── Dashboard.tsx
  │   │   ├── AddVenue.tsx
  │   │   ├── Availability.tsx
  │   │   └── Chat.tsx
  │   └── BookingUser/
  │       ├── Dashboard.tsx
  │       ├── Venues.tsx
  │       ├── Booking.tsx
  │       ├── Payment.tsx
  │       └── Chat.tsx
  ├── types/
  │   └── index.ts
  ├── utils/
  │   ├── localStorage.ts
  │   └── initializeMockData.ts
  └── App.tsx
```

## Future Enhancements
- Real backend API integration
- Image upload functionality
- Advanced search filters
- Booking calendar view
- Email notifications
- Payment gateway integration
- Reviews and ratings
- Multi-language support
