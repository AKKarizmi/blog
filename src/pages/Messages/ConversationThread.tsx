import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getMessages, sendMessage } from '../../services/messagesService';
import { dateGroupLabel } from '../../utils/date';
import type { Conversation, Message } from '../../types/Message';
interface Props {
  conversation: Conversation;
  onBack: () => void;
}
export function ConversationThread({ conversation, onBack }: Props) {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    getMessages(conversation.id).then(setMessages);
  }, [conversation.id]);
  useEffect(() => {
    if (scrollRef.current)
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage({
      conversationId: conversation.id,
      senderId: currentUser?.id ?? 'usr_admin_1',
      senderName: currentUser?.fullName ?? 'Admin User',
      body: text
    }).then((m) => {
      setMessages((prev) => [...prev, m]);
      setDraft('');
    });
  };
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  // Group messages by date
  const grouped: {
    label: string;
    messages: Message[];
  }[] = [];
  for (const m of messages) {
    const label = dateGroupLabel(m.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.label === label) last.messages.push(m);else

    grouped.push({
      label,
      messages: [m]
    });
  }
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md"
          aria-label="Back">
          
          <ArrowLeft className="w-5 h-5" />
        </button>
        {conversation.participantAvatar ?
        <img
          src={conversation.participantAvatar}
          alt=""
          className="w-9 h-9 rounded-full object-cover" /> :


        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {conversation.participantName.
          split(' ').
          map((n) => n[0]).
          join('').
          slice(0, 2)}
          </div>
        }
        <div>
          <div className="text-sm font-medium text-gray-900">
            {conversation.participantName}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {grouped.map((group, gi) =>
        <div key={gi}>
            <div className="text-center my-3">
              <span className="inline-block px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                {group.label}
              </span>
            </div>
            <div className="space-y-2">
              {group.messages.map((m) => {
              const isMe = m.senderId === currentUser?.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  
                    <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                    
                      {m.body}
                      <div
                      className={`text-[10px] mt-1 ${isMe ? 'text-indigo-100' : 'text-gray-500'}`}>
                      
                        {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-3 flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-h-32" />
        
        <button
          onClick={handleSend}
          disabled={!draft.trim()}
          className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none hover:bg-indigo-700"
          aria-label="Send message">
          
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>);

}