import { createBrowserRouter, Navigate, Outlet } from "react-router";
import DashboardLayout from "./components/DashboardLayout";

// Layout components
const UserLayout = () => <DashboardLayout role="user"><Outlet /></DashboardLayout>;
const ProviderLayout = () => <DashboardLayout role="provider"><Outlet /></DashboardLayout>;
const AdminLayout = () => <DashboardLayout role="admin"><Outlet /></DashboardLayout>;
// Page imports - using ./ because 'pages' is in the same 'app' folder
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelection from "./pages/RoleSelection";

// Booking User Pages
import BookingUserDashboard from "./pages/BookingUser/Dashboard";
import BookingUserVenues from "./pages/BookingUser/Venues";
import BookingUserBooking from "./pages/BookingUser/Booking";
import BookingUserPayment from "./pages/BookingUser/Payment";
import BookingUserChat from "./pages/BookingUser/Chat";

// Provider Pages
import ProviderDashboard from "./pages/Provider/Dashboard";
import ProviderAddVenue from "./pages/Provider/AddVenue";
import ProviderAvailability from "./pages/Provider/Availability";
import ProviderChat from "./pages/Provider/Chat";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminVenues from "./pages/Admin/Venues";
import AdminBookings from "./pages/Admin/Bookings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/role-selection",
    element: <RoleSelection />,
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <BookingUserDashboard /> },
      { path: "venues", element: <BookingUserVenues /> },
      { path: "booking/:venueId", element: <BookingUserBooking /> },
      { path: "payment", element: <BookingUserPayment /> },
      { path: "chat", element: <BookingUserChat /> },
      { path: "chat/:bookingId", element: <BookingUserChat /> },
    ],
  },
  {
    path: "/provider",
    element: <ProviderLayout />,
    children: [
      { index: true, element: <ProviderDashboard /> },
      { path: "add-venue", element: <ProviderAddVenue /> },
      { path: "availability", element: <ProviderAvailability /> },
      { path: "chat", element: <ProviderChat /> },
      { path: "chat/:bookingId", element: <ProviderChat /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "venues", element: <AdminVenues /> },
      { path: "bookings", element: <AdminBookings /> },
    ],
  },
]);