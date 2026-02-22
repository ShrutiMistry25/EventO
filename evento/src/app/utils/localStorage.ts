import type { User, Venue, Booking, ChatMessage, TimeSlot } from '../types';

// Keys for localStorage
const USERS_KEY = 'venuebook_users';
const VENUES_KEY = 'venuebook_venues';
const BOOKINGS_KEY = 'venuebook_bookings';
const CHAT_MESSAGES_KEY = 'venuebook_chat_messages';
const TIME_SLOTS_KEY = 'venuebook_time_slots';
const CURRENT_USER_KEY = 'venuebook_current_user';

// Initialize with default admin user if no users exist
const initializeDefaultUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: 'admin-1',
      fullName: 'Admin User',
      email: 'admin@venuebook.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isBlocked: false,
    };
    saveUsers([defaultAdmin]);
  }
};

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
};

export const deleteUser = (userId: string): void => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  saveUsers(filtered);
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
};

// Current User Session
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Venues
export const getVenues = (): Venue[] => {
  const data = localStorage.getItem(VENUES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveVenues = (venues: Venue[]): void => {
  localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
};

export const addVenue = (venue: Venue): void => {
  const venues = getVenues();
  venues.push(venue);
  saveVenues(venues);
};

export const updateVenue = (venueId: string, updates: Partial<Venue>): void => {
  const venues = getVenues();
  const index = venues.findIndex(v => v.id === venueId);
  if (index !== -1) {
    venues[index] = { ...venues[index], ...updates };
    saveVenues(venues);
  }
};

export const deleteVenue = (venueId: string): void => {
  const venues = getVenues();
  const filtered = venues.filter(v => v.id !== venueId);
  saveVenues(filtered);
};

export const getVenueById = (id: string): Venue | null => {
  const venues = getVenues();
  return venues.find(v => v.id === id) || null;
};

export const getVenuesByProviderId = (providerId: string): Venue[] => {
  const venues = getVenues();
  return venues.filter(v => v.providerId === providerId);
};

// Bookings
export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(BOOKINGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveBookings = (bookings: Booking[]): void => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const addBooking = (booking: Booking): void => {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): void => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    saveBookings(bookings);
  }
};

export const deleteBooking = (bookingId: string): void => {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.id !== bookingId);
  saveBookings(filtered);
};

export const getBookingsByCustomerId = (customerId: string): Booking[] => {
  const bookings = getBookings();
  return bookings.filter(b => b.customerId === customerId);
};

export const getBookingsByProviderId = (providerId: string): Booking[] => {
  const bookings = getBookings();
  return bookings.filter(b => b.providerId === providerId);
};

// Chat Messages
export const getChatMessages = (): ChatMessage[] => {
  const data = localStorage.getItem(CHAT_MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveChatMessages = (messages: ChatMessage[]): void => {
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
};

export const addChatMessage = (message: ChatMessage): void => {
  const messages = getChatMessages();
  messages.push(message);
  saveChatMessages(messages);
};

export const getChatMessagesByBookingId = (bookingId: string): ChatMessage[] => {
  const messages = getChatMessages();
  return messages.filter(m => m.bookingId === bookingId);
};

export const getConversationsForUser = (userId: string): ChatMessage[] => {
  const messages = getChatMessages();
  return messages.filter(m => m.senderId === userId || m.receiverId === userId);
};

// Time Slots
export const getTimeSlots = (): TimeSlot[] => {
  const data = localStorage.getItem(TIME_SLOTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTimeSlots = (slots: TimeSlot[]): void => {
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(slots));
};

export const addTimeSlot = (slot: TimeSlot): void => {
  const slots = getTimeSlots();
  slots.push(slot);
  saveTimeSlots(slots);
};

export const updateTimeSlot = (slotId: string, updates: Partial<TimeSlot>): void => {
  const slots = getTimeSlots();
  const index = slots.findIndex(s => s.id === slotId);
  if (index !== -1) {
    slots[index] = { ...slots[index], ...updates };
    saveTimeSlots(slots);
  }
};

export const getTimeSlotsByVenueId = (venueId: string): TimeSlot[] => {
  const slots = getTimeSlots();
  return slots.filter(s => s.venueId === venueId);
};

// Initialize defaults
initializeDefaultUsers();
