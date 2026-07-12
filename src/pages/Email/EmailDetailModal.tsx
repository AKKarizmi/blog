import React from 'react';
import { Paperclip, Reply } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/date';
import type { Email } from '../../types/Email';
interface Props {
  email: Email | null;
  onClose: () => void;
  onReply: (email: Email) => void;
}
const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
export function EmailDetailModal({ email, onClose, onReply }: Props) {
  if (!email) return null;
  return (
    <Modal
      isOpen={email !== null}
      onClose={onClose}
      title={email.subject}
      size="lg">
      
      <div className="space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
            <span className="text-gray-500">From:</span>
            <span className="text-gray-900 font-medium">{email.from}</span>
            <span className="text-gray-500">To:</span>
            <span className="text-gray-900">{email.to.join(', ')}</span>
            <span className="text-gray-500">Date:</span>
            <span className="text-gray-900">
              {formatDate(email.sentAt)} at{' '}
              {new Date(email.sentAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
          {email.body}
        </div>

        {email.attachments && email.attachments.length > 0 &&
        <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Attachments
            </p>
            <ul className="space-y-1">
              {email.attachments.map((a, i) =>
            <li
              key={i}
              className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-md">
              
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <span>{a.name}</span>
                  <span className="text-gray-400 text-xs">
                    ({formatSize(a.size)})
                  </span>
                </li>
            )}
            </ul>
          </div>
        }

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onReply(email)}>
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
        </div>
      </div>
    </Modal>);

}