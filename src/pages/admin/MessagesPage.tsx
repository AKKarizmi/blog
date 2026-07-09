import { useState, useEffect } from 'react';
import { Mail, Eye, CheckCircle } from 'lucide-react';
import { messagesService, type Message } from '../../lib/services/messagesService';

export const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messagesService.getAll();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await messagesService.markAsRead(id);
      await loadMessages();
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-600 mt-1">View contact form submissions and emails</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No messages yet</h3>
            <p className="text-slate-600 mt-1">Contact form submissions will appear here</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-xl shadow-sm border ${message.is_read ? 'border-slate-200' : 'border-indigo-300'} p-6 hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!message.is_read && (
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    )}
                    <h3 className={`text-lg font-semibold ${message.is_read ? 'text-slate-900' : 'text-indigo-900'}`}>
                      {message.subject}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    From: {message.sender_name || message.sender_email} ({message.sender_email})
                  </p>
                  <p className="text-slate-700 line-clamp-2">{message.content}</p>
                  <p className="text-xs text-slate-500 mt-3">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(message);
                    }}
                    className="flex items-center justify-center gap-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  {!message.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message.id);
                      }}
                      className="flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{selectedMessage.subject}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <strong>From:</strong> {selectedMessage.sender_name || selectedMessage.sender_email} ({selectedMessage.sender_email})
              </div>
              <div className="text-sm text-slate-600">
                <strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {!selectedMessage.is_read && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
