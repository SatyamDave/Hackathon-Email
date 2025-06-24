import React, { useEffect, useState } from 'react';
import { Stack, List, Text, Spinner, Label, DefaultButton, IconButton } from '@fluentui/react';
import { mockEmails } from '../../data/mockEmails';

interface Email {
  id: string;
  subject: string;
  from: string;
  receivedDateTime: string;
  preview: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function getSummary(email: Email) {
  // Mock: first 100 chars of preview
  return email.preview.length > 100 ? email.preview.slice(0, 100) + '...' : email.preview;
}

function getLabel(email: Email) {
  const subj = email.subject.toLowerCase();
  if (subj.includes('action')) return 'Action Needed';
  if (subj.includes('proposal')) return 'Proposal';
  if (subj.includes('fyi')) return 'FYI';
  if (subj.includes('meeting')) return 'Meeting';
  return null;
}

function getSmartReply(email: Email) {
  return `Hi ${email.from},\n\nThank you for your email regarding "${email.subject}". I will review and get back to you soon.\n\nBest regards,`;
}

export const DefaultInbox: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<{ [id: string]: string }>({});
  const [readStatus, setReadStatus] = useState<{ [id: string]: boolean }>({});

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const mapped: Email[] = mockEmails.map((msg: any) => ({
        id: msg.id,
        subject: msg.subject,
        from: msg.sender.name,
        receivedDateTime: msg.timestamp,
        preview: msg.preview,
      }));
      setEmails(mapped);
      // Reset read status for new emails
      setReadStatus({});
    } catch (err) {
      setError('Failed to load emails.');
      console.error("Email fetch error:", err); // Debug output
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    // eslint-disable-next-line
  }, []);

  const handleSmartReply = (email: Email) => {
    setReplyDraft((prev) => ({ ...prev, [email.id]: getSmartReply(email) }));
  };

  const handleRefresh = () => {
    fetchEmails();
  };

  const handleToggleRead = (email: Email) => {
    setReadStatus((prev) => ({ ...prev, [email.id]: !prev[email.id] }));
  };

  if (loading) {
    return <Spinner label="Loading emails..." />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>Inbox</Text>
        <IconButton iconProps={{ iconName: 'Refresh' }} title="Refresh" ariaLabel="Refresh" onClick={handleRefresh} />
      </Stack>
      <List
        items={emails}
        onRenderCell={(email?: Email) => (
          email ? (
            <Stack tokens={{ childrenGap: 5 }} styles={{ root: { padding: '10px', borderBottom: '1px solid #eee', background: !readStatus[email.id] ? '#f3f6fd' : undefined } }}>
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <Text variant="mediumPlus">{email.subject}</Text>
                {!readStatus[email.id] && <Label styles={{ root: { background: '#0078d4', color: 'white' } }}>Unread</Label>}
                {getLabel(email) && <Label>{getLabel(email)}</Label>}
                <IconButton iconProps={{ iconName: readStatus[email.id] ? 'Mail' : 'MailUnread' }} title="Toggle Read" ariaLabel="Toggle Read" onClick={() => handleToggleRead(email)} />
              </Stack>
              <Text variant="small">{email.from}</Text>
              <Text variant="small">{formatDate(email.receivedDateTime)}</Text>
              <Text variant="small" styles={{ root: { fontStyle: 'italic', color: '#666' } }}>Summary: {getSummary(email)}</Text>
              <Text variant="small">{email.preview}</Text>
              <DefaultButton text="Smart Reply" onClick={() => handleSmartReply(email)} />
              {replyDraft[email.id] && (
                <Text variant="small" styles={{ root: { background: '#f4f4f4', padding: 8, borderRadius: 4, marginTop: 4 } }}>{replyDraft[email.id]}</Text>
              )}
            </Stack>
          ) : null
        )}
      />
    </Stack>
  );
}; 