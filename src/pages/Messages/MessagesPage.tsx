import React, { useEffect, useState } from 'react';
import { MessageSquareOff } from 'lucide-react';
import { ConversationThread } from './ConversationThread';
import { getConversations } from '../../services/messagesService';
import { relativeTime } from '../../utils/date';
import type { Conversation } from '../../types/Message';
export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    getConversations().then(setConversations);
  }, []);
  const selected = conversations.find((c) => c.id === selectedId) || null;
  const handleSelect = (c: Conversation) => {
    setSelectedId(c.id);
    setConversations((prev) =>
    prev.map((conv) =>
    conv.id === c.id ?
    {
      ...conv,
      unreadCount: 0
    } :
    conv
    )
    );
  };
  const getInitials = (name: string) =>
  name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Direct conversations with team members.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Conversation list - hidden on mobile when chat is open */}
        <aside
          className={`md:w-72 flex-shrink-0 ${selected ? 'hidden md:block' : 'block'}`}>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {conversations.length === 0 ?
            <div className="p-12 text-center">
                <MessageSquareOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div> :

            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {conversations.map((c) =>
              <li key={c.id}>
                    <button
                  onClick={() => handleSelect(c)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedId === c.id ? 'bg-indigo-50' : ''}`}>
                  
                      <div className="flex items-start gap-3">
                        {c.participantAvatar ?
                    <img
                      src={c.participantAvatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0" /> :


                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials(c.participantName)}
                          </div>
                    }
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {c.participantName}
                            </p>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {relativeTime(c.lastMessageAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {c.lastMessage}
                          </p>
                        </div>
                        {c.unreadCount > 0 &&
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    }
                      </div>
                    </button>
                  </li>
              )}
              </ul>
            }
          </div>
        </aside>

        {/* Thread or empty state */}
        <div
          className={`flex-1 min-w-0 ${selected ? 'block' : 'hidden md:block'}`}>
          
          {selected ?
          <ConversationThread
            conversation={selected}
            onBack={() => setSelectedId(null)} /> :


          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col items-center justify-center text-center p-8">
              <MessageSquareOff className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700">
                Select a conversation to start messaging
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

}