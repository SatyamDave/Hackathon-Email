import React, { useEffect, useState } from 'react';
import { Text, Spinner, Label, DefaultButton, Icon, Modal, TextField, PrimaryButton } from '@fluentui/react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { Calendar, MapPin, Plus } from 'lucide-react';

interface Event {
  id: string;
  subject: string;
  start: { dateTime: string };
  location: { displayName: string };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    subject: 'Hackathon Demo',
    start: { dateTime: new Date(Date.now() + 3600 * 1000).toISOString() },
    location: { displayName: 'Main Hall' },
  },
  {
    id: '2',
    subject: 'Team Sync',
    start: { dateTime: new Date(Date.now() + 7200 * 1000).toISOString() },
    location: { displayName: 'Zoom' },
  },
];

export default function DayPlanner() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ subject: '', dateTime: '', location: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      if (!account) return;
      setLoading(true);
      setError(null);
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account,
        });
        const accessToken = response.accessToken;
        const res = await fetch(
          'https://graph.microsoft.com/v1.0/me/events?$top=5&$orderby=start/dateTime',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await res.json();
        if (data.value && data.value.length > 0) {
          setEvents(data.value);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch (err) {
        setError('Failed to load events. Showing mock events.');
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [account, instance]);

  const handleAddEvent = () => {
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.subject || !newEvent.dateTime) return;
    setEvents(prev => [
      {
        id: (Date.now() + Math.random()).toString(),
        subject: newEvent.subject,
        start: { dateTime: newEvent.dateTime },
        location: { displayName: newEvent.location || 'No location' },
      },
      ...prev,
    ]);
    setShowModal(false);
    setNewEvent({ subject: '', dateTime: '', location: '' });
  };

  const nextEventId = events.length > 0 ? events[0].id : null;

  if (!account) {
    return (
      <div className="p-4 text-center">
        <p className="text-dark-text-secondary text-sm">Please sign in to view your day planner.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-4 text-center">
        <Spinner label="Loading events..." />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleAddEvent}
          className="flex items-center space-x-2 px-3 py-2 bg-dark-accent text-dark-primary rounded-lg hover:bg-dark-accent/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-400 text-xs">{error}</p>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-dark-text-secondary" />
          <p className="text-dark-text-secondary text-sm">No upcoming events.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border transition-all ${
                event.id === nextEventId
                  ? 'bg-dark-accent/10 border-dark-accent'
                  : 'bg-dark-muted border-dark-muted hover:bg-dark-muted/80'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-dark-accent mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-dark-text-primary leading-tight">
                    {event.subject}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-dark-text-secondary">
                    <span>{formatDate(event.start.dateTime)}</span>
                  </div>
                  {event.location.displayName && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-dark-text-secondary" />
                      <span className="text-xs text-dark-text-secondary">
                        {event.location.displayName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      <Modal isOpen={showModal} onDismiss={() => setShowModal(false)}>
        <div className="p-6 bg-dark-secondary rounded-lg min-w-[320px]">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add New Event</h3>
          <div className="space-y-4">
            <TextField
              label="Title"
              value={newEvent.subject}
              onChange={(_, v) => setNewEvent(e => ({ ...e, subject: v || '' }))}
              className="w-full"
            />
            <TextField
              label="Date & Time"
              type="datetime-local"
              value={newEvent.dateTime}
              onChange={(_, v) => setNewEvent(e => ({ ...e, dateTime: v || '' }))}
              className="w-full"
            />
            <TextField
              label="Location"
              value={newEvent.location}
              onChange={(_, v) => setNewEvent(e => ({ ...e, location: v || '' }))}
              className="w-full"
            />
            <div className="flex space-x-2 pt-2">
              <PrimaryButton
                text="Save"
                onClick={handleSaveEvent}
                disabled={!newEvent.subject || !newEvent.dateTime}
              />
              <DefaultButton text="Cancel" onClick={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}