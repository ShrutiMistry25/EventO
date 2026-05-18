import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { addBooking, getCurrentUser, getVenueById } from '../../utils/localStorage';
import type { Booking } from '../../types';
import { toast } from 'sonner';

export default function Payment() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('pending_booking');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      navigate('/user/venues');
    }
  }, [navigate]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiry(formatExpiry(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvv || !cardName) {
      alert('Please fill in all payment details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return;
    }

    if (cvv.length !== 3) {
      alert('Please enter a valid 3-digit CVV');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Get current user
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      // Get venue to find provider
      const venue = getVenueById(bookingData.venue.id);
      if (!venue) {
        toast.error('Venue not found.');
        navigate('/user/venues');
        return;
      }

      // Save booking to localStorage with all required fields
      const booking: Booking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerId: currentUser.id,
        providerId: venue.providerId,
        venueId: bookingData.venue.id,
        venueName: bookingData.venue.name,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        totalPrice: bookingData.total,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
      addBooking(booking);

      // Clear pending booking
      sessionStorage.removeItem('pending_booking');

      setProcessing(false);
      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/user');
      }, 3000);
    }, 2000);
  };

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your venue has been successfully booked. We've sent a confirmation email to your address.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{bookingData.venue.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>{new Date(bookingData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{bookingData.timeSlot}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="font-semibold text-gray-900">Total Paid</span>
              <span className="font-bold text-green-600">₹{bookingData.total}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
      >
        ← Back to Booking
      </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Payment Details
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Complete your booking securely
                  </p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-5">
                {/* Card Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure.</p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{bookingData.total}
                      <Lock className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {bookingData.venue.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {bookingData.venue.location}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {new Date(bookingData.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    {bookingData.timeSlot}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Venue Price</span>
                    <span className="font-semibold">₹{bookingData.venue.price}</span>
                  </div>
                  {bookingData.services.length > 0 && (
                    <div className="text-sm text-gray-600">
                      + {bookingData.services.length} additional service(s)
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-gray-300 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600">
                    ₹{bookingData.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
