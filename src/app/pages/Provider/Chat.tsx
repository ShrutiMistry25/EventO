import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Send, User, Building2, MessageSquare } from 'lucide-react';
import { getChatMessagesByBookingId, addChatMessage, getBookings, getUsers } from '../../utils/localStorage';
import { getCurrentUser } from '../../utils/localStorage';
import type { ChatMessage, Booking, User as UserType } from '../../types';

export default function ProviderChat() {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookingId || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const providerBookings = getBookings().filter(booking => booking.providerId === currentUser.id);

      // Filter bookings to only show those with chat messages
      const conversationsWithMessages = providerBookings.filter(booking => {
        const messages = getChatMessagesByBookingId(booking.id);
        return messages.length > 0;
      });

      setConversations(conversationsWithMessages);

      // If no bookingId in URL, select the first conversation with messages or stay on general chat
      if (!selectedBookingId && conversationsWithMessages.length > 0) {
        setSelectedBookingId(conversationsWithMessages[0].id);
      }
    }
    // Depend only on currentUser id to prevent effect running every render due to object identity
  }, [currentUser?.id]);

  // Handle URL parameter changes
  useEffect(() => {
    console.debug('[ProviderChat] bookingId change', { bookingId, selectedBookingId, conversationsLength: conversations.length });
    if (bookingId) {
      setSelectedBookingId(bookingId);
    } else if (!bookingId && conversations.length > 0) {
      // If no bookingId in URL but we have conversations, select the first one
      setSelectedBookingId(conversations[0].id);
    } else if (!bookingId) {
      // If no bookingId in URL and no conversations, clear selection
      setSelectedBookingId('');
    }
  }, [bookingId, conversations]);

  useEffect(() => {
    if (selectedBookingId) {
      loadMessages();
    }
  }, [selectedBookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    if (selectedBookingId) {
      const storedMessages = getChatMessagesByBookingId(selectedBookingId);
      setMessages(storedMessages);
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBookingId || !currentUser) return;

    const booking = conversations.find(b => b.id === selectedBookingId);
    if (!booking) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      bookingId: selectedBookingId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      receiverId: booking.customerId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    addChatMessage(message);
    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    // Simulate customer response after 2 seconds
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        bookingId: selectedBookingId,
        senderId: booking.customerId,
        senderName: 'Customer',
        receiverId: currentUser.id,
        message: 'Thank you for the information! I\'ll review and get back to you.',
        timestamp: new Date().toISOString(),
        read: false,
      };
      addChatMessage(response);
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-2 mt-6 mb-4">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/provider');
            }
          }}
          className="flex items-center gap-1 text-sm text-purple-700 hover:underline font-medium px-3 py-2 rounded transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>
      {/* Conversation Selector */}
      {conversations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Conversations
            </h3>
            <div className="grid gap-3">
              {conversations.map((booking) => {
                const customer = getUsers().find(u => u.id === booking.customerId);
                return (
                  <div
                    key={booking.id}
                    onClick={() => navigate(`/provider/chat/${booking.id}`)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBookingId === booking.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{customer?.fullName || 'Customer'}</h4>
                        <p className="text-sm text-gray-600">{booking.venueName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">Status: {booking.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{booking.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-12rem)]">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                {selectedBookingId ? (
                  (() => {
                    const booking = conversations.find(b => b.id === selectedBookingId);
                    const customer = booking ? getUsers().find(u => u.id === booking.customerId) : null;
                    return (
                      <>
                        <h2 className="text-xl font-bold text-gray-900">
                          {customer?.fullName || 'Customer'}
                        </h2>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          Online
                        </p>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900">Select a Conversation</h2>
                    <p className="text-sm text-gray-600">Choose a customer conversation to continue</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!selectedBookingId ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-600">
                  {conversations.length > 0 
                    ? 'Select a customer conversation from above to start chatting'
                    : 'No customers have started conversations with you yet.'
                  }
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600">
                  Messages from customers will appear here
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === currentUser?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-3 max-w-md ${
                        isOwn ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isOwn
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}
                      >
                        {isOwn ? (
                          <Building2 className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            isOwn
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1 opacity-80">
                            {isOwn ? 'You' : message.senderName}
                          </p>
                          <p>{message.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {new Date(message.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedBookingId ? "Type your message..." : "Select a conversation to start chatting"}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={!selectedBookingId}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !selectedBookingId}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}
