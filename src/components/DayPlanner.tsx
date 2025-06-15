import React, { useEffect, useState } from 'react';
import { Stack, Text, Spinner, Label, DefaultButton, Icon, Modal, TextField, PrimaryButton } from '@fluentui/react';
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
    return <Text>Please sign in to view your day planner.</Text>;
  }
  if (loading) {
    return <Spinner label="Loading events..." />;
  }

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, background: '#f8fafd', borderRadius: 16, boxShadow: '0 2px 12px #0001', minWidth: 320 } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="large" styles={{ root: { fontWeight: 700, letterSpacing: '0.5px' } }}>Day Planner</Text>
        <DefaultButton iconProps={{ iconName: 'Add' }} style={{ borderRadius: 8 }} onClick={handleAddEvent}>
          <Plus size={16} style={{ marginRight: 4 }} /> Add Event
        </DefaultButton>
      </Stack>
      {error && <Label styles={{ root: { background: '#fffbe6', color: '#b8860b' } }}>{error}</Label>}
      {events.length === 0 ? (
        <Text>No upcoming events.</Text>
      ) : (
        events.map(event => (
          <Stack key={event.id} tokens={{ childrenGap: 2 }} styles={{ root: {
            borderBottom: '1px solid #eee',
            paddingBottom: 10,
            marginBottom: 10,
            background: event.id === nextEventId ? '#e6f7ff' : undefined,
            borderRadius: event.id === nextEventId ? 8 : 0,
            boxShadow: event.id === nextEventId ? '0 2px 8px #0078d41a' : undefined,
          } }}>
            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
              <Calendar size={18} style={{ color: '#0078d4' }} />
              <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>{event.subject}</Text>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
              <Icon iconName="Clock" styles={{ root: { color: '#666' } }} />
              <Text variant="small">{formatDate(event.start.dateTime)}</Text>
              <MapPin size={14} style={{ color: '#b8860b', marginLeft: 8 }} />
              <Text variant="small">{event.location.displayName}</Text>
            </Stack>
          </Stack>
        ))
      )}
      <Modal isOpen={showModal} onDismiss={() => setShowModal(false)}>
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32, minWidth: 320 } }}>
          <Text variant="xLarge">Add New Event</Text>
          <TextField label="Title" value={newEvent.subject} onChange={(_, v) => setNewEvent(e => ({ ...e, subject: v || '' }))} />
          <TextField label="Date & Time" type="datetime-local" value={newEvent.dateTime} onChange={(_, v) => setNewEvent(e => ({ ...e, dateTime: v || '' }))} />
          <TextField label="Location" value={newEvent.location} onChange={(_, v) => setNewEvent(e => ({ ...e, location: v || '' }))} />
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton text="Save" onClick={handleSaveEvent} disabled={!newEvent.subject || !newEvent.dateTime} />
            <DefaultButton text="Cancel" onClick={() => setShowModal(false)} />
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
}