import { ComponentType } from 'react';
import {
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  FileText,
  Check } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
export function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
  useNotifications();
  const navigate = useNavigate();
  const handleClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.link) navigate(n.link);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay on top of activity across the workspace.
          </p>
        </div>
        {unreadCount > 0 &&
        <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        }
      </div>

      <Card className="overflow-hidden">
        {loading ?
        <div className="divide-y divide-gray-100">
            {[...Array(4)].map((_, i) =>
          <div key={i} className="p-4 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
          )}
          </div> :
        notifications.length === 0 ?
        <div className="px-6 py-16 flex flex-col items-center text-center">
            <BellOff className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-700">
              No notifications
            </p>
            <p className="text-sm text-gray-500">You're all caught up.</p>
          </div> :

        <ul className="divide-y divide-gray-100">
            {notifications.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <li key={n.id}>
                  <button
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                  
                    <div className="flex gap-3">
                      <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${ICON_COLORS[n.type]}`}>
                      
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
                        <p className="text-sm text-gray-500 mt-0.5">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {relativeTime(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>);

          })}
          </ul>
        }
      </Card>
    </div>);

}