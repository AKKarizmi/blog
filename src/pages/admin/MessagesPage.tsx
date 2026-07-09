import { useState, useEffect } from 'react';
import { Mail, Eye, CheckCircle, X } from 'lucide-react';
import { messagesService, type Message } from '../../lib/services/messagesService';
import { useToast } from '../../hooks/useToast';

export const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

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
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
      toast({
        title: 'Success',
        description: 'Message marked as read',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to mark as read',
        variant: 'destructive',
      });
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

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-600 mt-1">View contact form submissions and emails</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Messages List Pane */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Inbox</h2>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No messages yet</h3>
                <p className="text-slate-600 mt-1">Contact form submissions will appear here</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {messages.map((message) => (
                  <li key={message.id}>
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-indigo-50' : ''
                      } ${!message.is_read ? 'bg-indigo-25' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {!message.is_read && (
                          <span className="w-2 h-2 mt-2 bg-indigo-600 rounded-full flex-shrink-0"></span>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${!message.is_read ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {message.subject}
                          </h3>
                          <p className="text-sm text-slate-600 truncate">
                            {message.sender_name || message.sender_email}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Message Detail Pane */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                    <span className="font-medium">From:</span>
                    <span>{selectedMessage.sender_name || selectedMessage.sender_email}</span>
                    <span className="text-slate-400">&lt;{selectedMessage.sender_email}&gt;</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!selectedMessage.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.content}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
                <p className="text-slate-600">Select a message to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
