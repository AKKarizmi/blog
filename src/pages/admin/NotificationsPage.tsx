import { useState, useEffect } from 'react';
import { notificationsService, Notification as NotificationType } from '../../lib/services/notificationsService';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getAll();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      toast({
        title: 'Success',
        description: 'Notification marked as read',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationsService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast({
        title: 'Success',
        description: 'Notification deleted',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <Button onClick={fetchNotifications} className="mt-4">Retry</Button>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your notifications and alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notifications ({notifications.length})
            {unreadCount > 0 && (
              <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  !notification.is_read
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-background'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${!notification.is_read ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </h3>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.is_read && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
