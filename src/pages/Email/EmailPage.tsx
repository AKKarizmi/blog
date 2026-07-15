import { useEffect, useState } from 'react';
import { Inbox, Send, Mail, PenSquare, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  DataTable,
  DataTableColumn } from
'../../components/DataTable/DataTable';
import { ComposeModal } from './ComposeModal';
import { EmailDetailModal } from './EmailDetailModal';
import { useApp } from '../../context/AppContext';
import { getEmails, markEmailAsRead, sendEmail } from '../../services/emailService';
import { formatDate } from '../../utils/date';
import type { Email } from '../../types/Email';
type Folder = 'inbox' | 'sent';
export function EmailPage() {
  const { addToast } = useApp();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [folder, setFolder] = useState<Folder>('inbox');
  const [selected, setSelected] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    to: string[];
    subject: string;
  } | null>(null);
  const load = () => {
    setLoading(true);
    setError(undefined);
    getEmails().
    then(setEmails).
    catch((e) => {
      const message = e instanceof Error ? e.message : 'Unable to load emails';
      setError(message);
      addToast(message, 'error');
    }).
    finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const inboxUnread = emails.filter(
    (e) => e.folder === 'inbox' && e.status === 'unread'
  ).length;
  const folderEmails = emails.filter((e) => e.folder === folder);
  const handleOpenEmail = async (email: Email) => {
    setSelected(email);
    if (email.status === 'unread') {
      await markEmailAsRead(email.id);
      setEmails((prev) =>
      prev.map((e) =>
      e.id === email.id ?
      {
        ...e,
        status: 'read'
      } :
      e
      )
      );
    }
  };
  const handleSend = (
  payload: Omit<Email, 'id' | 'sentAt' | 'status' | 'folder'> & { files?: File[] }) =>
  {
    return sendEmail(payload).then((sent) => {
      setEmails((prev) => [sent, ...prev]);
      addToast('Email sent', 'success');
      setComposeOpen(false);
      setReplyTo(null);
    }).catch((e) => {
      const message = e instanceof Error ? e.message : 'Unable to send email';
      addToast(message, 'error');
      throw e;
    });
  };
  const handleReply = (email: Email) => {
    setReplyTo({
      to: [email.from],
      subject: email.subject.startsWith('Re:') ?
      email.subject :
      `Re: ${email.subject}`
    });
    setSelected(null);
    setComposeOpen(true);
  };
  const openButton = (email: Email) =>
  <button
    onClick={() => handleOpenEmail(email)}
    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded-md"
    aria-label={`Open email: ${email.subject}`}>
    
      <Eye className="w-3.5 h-3.5" /> Open
    </button>;

  const columns: DataTableColumn<Email>[] =
  folder === 'inbox' ?
  [
  {
    key: 'from',
    label: 'From',
    sortable: true,
    render: (e) =>
    <span
      className={
      e.status === 'unread' ?
      'font-semibold text-gray-900' :
      'text-gray-700'
      }>
      
                {e.from}
              </span>

  },
  {
    key: 'subject',
    label: 'Subject',
    render: (e) =>
    <span
      className={
      e.status === 'unread' ?
      'font-semibold text-gray-900' :
      'text-gray-700'
      }>
      
                {e.subject}
              </span>

  },
  {
    key: 'sentAt',
    label: 'Date',
    sortable: true,
    render: (e) => formatDate(e.sentAt)
  },
  {
    key: 'status',
    label: 'Status',
    render: (e) =>
    e.status === 'unread' ?
    <Badge variant="default">Unread</Badge> :

    <Badge variant="neutral">Read</Badge>

  },
  {
    key: 'actions',
    label: '',
    className: 'text-right',
    render: openButton
  }] :

  [
  {
    key: 'to',
    label: 'To',
    render: (e) => e.to.join(', ')
  },
  {
    key: 'subject',
    label: 'Subject'
  },
  {
    key: 'sentAt',
    label: 'Date',
    sortable: true,
    render: (e) => formatDate(e.sentAt)
  },
  {
    key: 'actions',
    label: '',
    className: 'text-right',
    render: openButton
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your inbox and sent messages.
          </p>
        </div>
        <Button onClick={() => setComposeOpen(true)}>
          <PenSquare className="w-4 h-4 mr-2" />
          Compose
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-48 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setFolder('inbox')}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${folder === 'inbox' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              
              <span className="flex items-center gap-2">
                <Inbox className="w-4 h-4" /> Inbox
              </span>
              {inboxUnread > 0 &&
              <span className="bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {inboxUnread}
                </span>
              }
            </button>
            <button
              onClick={() => setFolder('sent')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${folder === 'sent' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              
              <Send className="w-4 h-4" /> Sent
            </button>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <DataTable
            columns={columns}
            data={folderEmails}
            loading={loading}
            error={error}
            onRetry={load}
            searchPlaceholder={`Search ${folder}...`}
            emptyMessage={
            folder === 'inbox' ? 'Inbox is empty' : 'No sent emails'
            }
            emptyIcon={Mail} />
          
        </div>
      </div>

      <ComposeModal
        isOpen={composeOpen}
        onClose={() => {
          setComposeOpen(false);
          setReplyTo(null);
        }}
        onSend={handleSend}
        initialTo={replyTo?.to}
        initialSubject={replyTo?.subject} />
      

      <EmailDetailModal
        email={selected}
        onClose={() => setSelected(null)}
        onReply={handleReply} />
      
    </div>);

}