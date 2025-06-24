import React, { useState } from 'react';
import Modal from './Modal';
import { useEmail } from '../contexts/EmailContext';
import { Email } from '../types/email';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: Email;
}

export default function CalendarModal({ isOpen, onClose, email }: CalendarModalProps) {
  const { addToast } = useEmail();
  const [title, setTitle] = useState(email?.subject || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [attendees, setAttendees] = useState(email?.sender?.email || '');
  const [location, setLocation] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const handleSchedule = async () => {
    if (!title || !date || !time) return;
    setScheduling(true);
    setTimeout(() => {
      addToast('Meeting scheduled successfully!', 'success');
      setScheduling(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Meeting">
      <div className="space-y-4">
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">Meeting Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            placeholder="Meeting title"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-dark-text-primary font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            />
          </div>
          <div>
            <label className="block text-dark-text-primary font-medium mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            />
          </div>
        </div>
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">Attendees</label>
          <input
            type="text"
            value={attendees}
            onChange={e => setAttendees(e.target.value)}
            className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary border border-dark-border focus:ring-2 focus:ring-dark-accent"
            placeholder="Meeting room or video call link"
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleSchedule}
            disabled={scheduling || !title || !date || !time}
            className="flex-1 py-2 bg-dark-accent text-dark-primary font-semibold rounded-lg hover:bg-dark-accent/90 transition disabled:opacity-50"
          >
            {scheduling ? 'Scheduling...' : 'Schedule Meeting'}
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