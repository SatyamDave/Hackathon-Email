import React, { useState } from 'react';
import Modal from './Modal';
import { useEmail } from '../contexts/EmailContext';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailComposer({ isOpen, onClose }: EmailComposerProps) {
  const { addToast } = useEmail();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) return;
    setSending(true);
    setTimeout(() => {
      addToast('Email sent successfully!', 'success');
      setSending(false);
      onClose();
      setTo('');
      setSubject('');
      setBody('');
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Email">
      <div className="space-y-4">
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">To</label>
          <input
            type="email"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            placeholder="recipient@example.com"
          />
        </div>
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            placeholder="Email subject"
          />
        </div>
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full h-32 px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent resize-none"
            placeholder="Type your message here..."
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleSend}
            disabled={sending || !to || !subject || !body}
            className="flex-1 py-2 bg-dark-accent text-dark-primary font-semibold rounded-lg hover:bg-dark-accent/90 transition disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
} 