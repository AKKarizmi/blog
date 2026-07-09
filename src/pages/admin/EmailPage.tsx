import { useState, useEffect } from 'react';
import { emailService, Email } from '../../lib/services/emailService';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/Dialog';
import { Mail, Send, Trash2, Eye } from 'lucide-react';

export default function EmailPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    body: '',
    sender: 'admin@foroz.org',
  });

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const data = await emailService.getAll();
      setEmails(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emails');
      toast({
        title: 'Error',
        description: 'Failed to fetch emails',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emailService.send(formData);
      toast({
        title: 'Success',
        description: 'Email sent successfully',
        variant: 'success',
      });
      setIsComposeOpen(false);
      setFormData({
        recipient: '',
        subject: '',
        body: '',
        sender: 'admin@foroz.org',
      });
      fetchEmails();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to send email',
        variant: 'destructive',
      });
    }
  };

  const handleView = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      try {
        await emailService.markAsRead(email.id);
        setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e)));
      } catch (err) {
        console.error('Failed to mark email as read');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await emailService.delete(id);
      toast({
        title: 'Success',
        description: 'Email deleted successfully',
        variant: 'success',
      });
      fetchEmails();
      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete email',
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
        <Button onClick={fetchEmails} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email</h1>
          <p className="text-muted-foreground">Manage your inbox and send messages</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          Compose
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Inbox ({emails.filter((e) => !e.is_read).length} unread)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow 
                      key={email.id}
                      className={`cursor-pointer ${!email.is_read ? 'bg-blue-50 font-medium' : ''}`}
                      onClick={() => handleView(email)}
                    >
                      <TableCell className="max-w-[100px] truncate">{email.sender}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{email.subject}</TableCell>
                    </TableRow>
                  ))}
                  {emails.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                        No emails found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedEmail ? selectedEmail.subject : 'Select an email to view'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">From: {selectedEmail.sender}</p>
                    <p className="text-sm text-muted-foreground">To: {selectedEmail.recipient}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleDelete(selectedEmail.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Received: {new Date(selectedEmail.created_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an email from the inbox to view its contents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose New Email</DialogTitle>
            <DialogDescription>Write and send a new email message</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                type="email"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
