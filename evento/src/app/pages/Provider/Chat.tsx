import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Send, User, Building2 } from 'lucide-react';
import { getMessages, saveMessage } from '../../utils/mockData';
import type { Message } from '../../utils/mockData';

export default function ProviderChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const storedMessages = getMessages();
    // For provider, reverse the isOwn property
    const providerMessages = storedMessages.map((msg) => ({
      ...msg,
      isOwn: !msg.isOwn,
      sender: msg.isOwn ? 'Customer' : 'You',
    }));
    setMessages(providerMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Venue Provider',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: false, // Store as not own, so it appears as own for provider
    };

    saveMessage(message);
    
    const displayMessage = {
      ...message,
      isOwn: true,
      sender: 'You',
    };
    
    setMessages((prev) => [...prev, displayMessage]);
    setNewMessage('');

    // Simulate customer response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'You',
        text: 'Thank you for the information! I\'ll review and get back to you.',
        timestamp: new Date().toISOString(),
        isOwn: true,
      };
      saveMessage(response);
      
      const displayResponse = {
        ...response,
        isOwn: false,
        sender: 'Customer',
      };
      
      setMessages((prev) => [...prev, displayResponse]);
    }, 2000);
  };

  return (
    <DashboardLayout role="provider">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-12rem)]">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer</h2>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
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
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-md ${
                      message.isOwn ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isOwn
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}
                    >
                      {message.isOwn ? (
                        <Building2 className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.isOwn
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1 opacity-80">
                          {message.sender}
                        </p>
                        <p>{message.text}</p>
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
              ))
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
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
