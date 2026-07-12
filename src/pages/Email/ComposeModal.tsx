import React, { useEffect, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import type { Email, EmailAttachment } from '../../types/Email';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: Omit<Email, 'id' | 'sentAt' | 'status' | 'folder'> & { files?: File[] }) => void;
  initialTo?: string[];
  initialSubject?: string;
}
export function ComposeModal({
  isOpen,
  onClose,
  onSend,
  initialTo,
  initialSubject
}: Props) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setTo(initialTo?.join(', ') || '');
      setSubject(initialSubject || '');
      setBody('');
      setAttachments([]);
      setError(null);
    }
  }, [isOpen, initialTo, initialSubject]);
  const handleSend = async () => {
    if (sending) return;
    setSending(true);
    setError(null);

    const recipients = to.
    split(',').
    map((s) => s.trim()).
    filter(Boolean);
    if (recipients.length === 0) {
      setSending(false);
      return setError('At least one recipient is required');
    }
    const invalid = recipients.find(
      (r) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)
    );
    if (invalid) {
      setSending(false);
      return setError(`Invalid email: ${invalid}`);
    }
    if (!subject.trim()) {
      setSending(false);
      return setError('Subject is required');
    }
    if (!body.trim()) {
      setSending(false);
      return setError('Message body is required');
    }

    const mappedAttachments: EmailAttachment[] = attachments.map((f) => ({
      name: f.name,
      size: f.size,
      url: '#'
    }));

    try {
      await onSend({
        from: 'admin@volunteerhub.org',
        to: recipients,
        subject,
        body,
        attachments: mappedAttachments.length > 0 ? mappedAttachments : undefined,
        files: attachments.length > 0 ? attachments : undefined
      });
    } finally {
      setSending(false);
    }
  };
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Email" size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="email@example.com, email2@example.com" />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <Textarea
          label="Message"
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)} />
        

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            <Paperclip className="w-4 h-4" />
            Add files
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAttachments((prev) => [...prev, ...files]);
              }}
              className="sr-only" />
            
          </label>
          {attachments.length > 0 &&
          <ul className="mt-3 space-y-1">
              {attachments.map((f, i) =>
            <li
              key={i}
              className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-md">
              
                  <span className="truncate">
                    {f.name}{' '}
                    <span className="text-gray-400">
                      ({formatSize(f.size)})
                    </span>
                  </span>
                  <button
                onClick={() =>
                setAttachments((prev) =>
                prev.filter((_, idx) => idx !== i)
                )
                }
                className="text-gray-400 hover:text-rose-600"
                aria-label="Remove attachment">
                
                    <X className="w-4 h-4" />
                  </button>
                </li>
            )}
            </ul>
          }
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </div>
    </Modal>);

}