import { useEffect, useState, useRef, ComponentType } from 'react';
import {
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  FileText,
  Check } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { relativeTime } from '../../utils/date';
import type { Notification, NotificationType } from '../../types/Notification';
const ICONS: Record<
  NotificationType,
  ComponentType<{
    className?: string;
  }>> =
{
  application: FileText,
  message: MessageSquare,
  email: Mail,
  system: Bell
};
const ICON_COLORS: Record<NotificationType, string> = {
  application: 'text-blue-600 bg-blue-50',
  message: 'text-purple-600 bg-purple-50',
  email: 'text-emerald-600 bg-emerald-50',
  system: 'text-gray-600 bg-gray-100'
};
export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
  useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node))
      {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  const handleClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
    }
    setIsOpen(false);
  };
  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}>
        
        <Bell className="h-6 w-6" />
        {unreadCount > 0 &&
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1"
          aria-label={`${unreadCount} unread notifications`}>
          
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        }
      </button>

      {isOpen &&
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 &&
          <button
            onClick={markAllAsRead}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1">
            
                <Check className="w-3 h-3" />
                Mark all as read
              </button>
          }
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ?
          <div className="px-6 py-12 flex flex-col items-center text-center">
                <BellOff className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No new notifications</p>
              </div> :

          notifications.map((n) => {
            const Icon = ICONS[n.type];
            const colorClass = ICON_COLORS[n.type];
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                
                    <div className="flex gap-3">
                      <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${colorClass}`}>
                    
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                        className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        
                            {n.title}
                          </p>
                          {!n.read &&
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      }
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {relativeTime(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>);

          })
          }
          </div>
        </div>
      }
    </div>);

}