# VenueBook - Venue Booking Web Application

A complete, production-ready venue and plot booking platform built with React, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication
- **Login Page**: Email and password authentication with validation
- **Role Selection**: Choose between Booking User (Customer) or Venue Provider
- **Persistent Sessions**: User data stored in localStorage

### 👤 Booking User Features
- **Home Dashboard**: Search venues by location, date, and time
- **Venue Listing**: Browse venues with filtering and search
  - Beautiful cards with images, ratings, and pricing
  - Availability status badges
  - Filter by location and availability
- **Booking Flow**:
  - Select date and time slots
  - Choose number of guests
  - Add additional services (catering, decoration, etc.)
  - Real-time price calculation
- **Payment Page**: Secure payment form with card validation
- **Chat Interface**: Real-time style messaging with venue providers

### 🏢 Venue Provider Features
- **Dashboard Overview**:
  - Total venues, bookings, and earnings statistics
  - Upcoming bookings overview
  - Recent bookings table
- **Venue Management**:
  - Add new venues with detailed information
  - Upload images, set pricing, capacity
  - Toggle availability status
  - Delete venues
- **Availability Calendar**:
  - Interactive monthly calendar
  - Set available time slots for specific dates
  - Visual indicators for available dates
- **Chat Interface**: Communicate with customers

## Technical Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **LocalStorage** for data persistence
- **Date-fns** for date handling

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── DashboardLayout.tsx    # Shared dashboard layout with sidebar
│   │   └── LoadingSpinner.tsx     # Reusable loading component
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication state management
│   ├── pages/
│   │   ├── BookingUser/
│   │   │   ├── Dashboard.tsx      # User home with search
│   │   │   ├── Venues.tsx         # Venue listing and filtering
│   │   │   ├── Booking.tsx        # Booking flow
│   │   │   ├── Payment.tsx        # Payment processing
│   │   │   └── Chat.tsx           # Customer chat
│   │   ├── Provider/
│   │   │   ├── Dashboard.tsx      # Provider dashboard with stats
│   │   │   ├── AddVenue.tsx       # Add new venue form
│   │   │   ├── Availability.tsx   # Calendar availability management
│   │   │   └── Chat.tsx           # Provider chat
│   │   ├── Login.tsx              # Login page
│   │   └── RoleSelection.tsx      # Role selection page
│   ├── utils/
│   │   └── mockData.ts            # Mock data and storage utilities
│   ├── routes.tsx                 # React Router configuration
│   └── App.tsx                    # Root component
└── styles/
    ├── index.css                  # Custom animations and global styles
    ├── theme.css                  # Design tokens
    └── tailwind.css               # Tailwind imports

## Data Persistence

All data is stored in browser localStorage:

- **venuebooking_user**: Current user and role
- **venuebooking_venues**: All venues (with mock data pre-loaded)
- **venuebooking_bookings**: All bookings
- **venuebooking_messages**: Chat messages
- **venue_availability**: Provider availability calendar

## Design Features

- **Modern SaaS UI**: Clean, professional interface with soft color palette
- **Gradient Accents**: Blue to purple gradients for primary actions
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Smooth Animations**: Fade-in, hover effects, and transitions
- **Loading States**: Spinner animations for async operations
- **Form Validation**: Client-side validation for all forms
- **Custom Scrollbars**: Styled scrollbars for better UX

## Getting Started

### Demo Credentials
The application uses dummy authentication - any email and password will work for login.

### User Flow

1. **Login**: Enter any email and password
2. **Select Role**: Choose "Booking User" or "Venue Provider"
3. **Booking User**:
   - Search for venues
   - Select a venue and book it
   - Complete payment
   - Chat with providers
4. **Provider**:
   - View dashboard stats
   - Add new venues
   - Manage availability
   - Chat with customers

## Key Components

### Authentication Flow
- Login validation with error messages
- Role-based routing
- Persistent user sessions

### Booking Flow
1. Search/browse venues
2. Select venue and date/time
3. Add additional services
4. Review booking summary
5. Complete payment
6. Confirmation screen

### Provider Flow
1. View analytics dashboard
2. Add venues with full details
3. Set calendar availability
4. Manage existing venues
5. Communicate with customers

## Color Palette

- **Primary**: Blue (#3B82F6) to Purple (#9333EA) gradients
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray shades for text and backgrounds

## Future Enhancements

- Email notifications
- Advanced search filters
- Reviews and ratings system
- Payment gateway integration
- Photo upload functionality
- Booking history and invoices
- Multi-language support
- Dark mode toggle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
