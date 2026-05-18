# Evento – Venue Booking Platform

Evento is a full-stack venue booking web application designed to simplify the process of discovering, managing, and booking venues for different types of events.

The platform connects Customers, Venue Providers, and Admins in a structured, role-based system.

## Project Description

Evento is a role-based web application that supports three types of users: Admin, Venue Provider, and Customer (Booking User).

Customers can search venues based on location, date, and time, view venue details, check availability, communicate with providers through chat, and complete bookings using a simulated payment system.

Venue Providers can register their venues, manage pricing and availability, view bookings related only to their own venues, and interact with customers.

Admins have full control over the platform, including managing users, venues, and bookings.

The system ensures:

- Role-based authentication
- Provider-level data privacy
- Slot conflict prevention
- Separate dashboards for each role
- Scalable architecture

The platform is suitable for events such as weddings, parties, conferences, corporate meetings, and social gatherings.

## Tech Stack

Frontend:
- React 
- TypeScript
- Tailwind CSS
- JavaScript 

Backend:
- Node.js
- Express.js
- MongoDB

Tools:
- Git & GitHub
- VS Code

## Project Features

- Role-Based Authentication (Admin / Provider / Customer)
- Secure Signup and Login System
- Separate Dashboards for each role
- Venue Search by location, date, and time
- Real-Time Availability Check
- Slot Booking with Double-Booking Prevention
- Provider-Level Venue Privacy (Providers can only view their own venues)
- Venue Management System
- Booking Management System
- Chat Interface between Customer and Provider
- Simulated Online Payment Flow
- Responsive and Modern UI

## User Roles

### Admin
- View total users, venues, and bookings
- Manage users
- Manage venues
- View all bookings
- Monitor overall platform activity

### Venue Provider
- Register and login
- Add and manage venues
- Set pricing and availability
- View bookings for own venues only
- Track earnings
- Chat with customers

### Customer (Booking User)
- Register and login
- Search and view venues
- Select date and time slots
- Book available venues
- Make payments
- Chat with venue providers
- View booking history

## How to Run Locally

1. Clone the repository

git clone https://github.com/ShrutiMistry25/evento.git

2. Navigate to the project directory

cd evento

3. Install dependencies

npm install

4. Start the development server

npm run dev

The application should now be running on your local machine!

## Future Improvements

- JWT Authentication
- Full Backend API Integration
- MongoDB Database Connection
- Real Payment Gateway Integration
- Email Notifications
- Cloud Deployment (Vercel / Render)

## Contributing

Feel free to open issues or submit pull requests for improvements or new features.

## Author

Shruti Mistry
