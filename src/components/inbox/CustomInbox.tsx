import React, { useState, useEffect } from 'react';
import { Stack, TextField, PrimaryButton, List, Text, Spinner, Label, DefaultButton, IconButton } from '@fluentui/react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../msalConfig';

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

function getSuggestion(email: Email) {
  const text = (email.subject + ' ' + email.preview).toLowerCase();
  if (text.includes('meeting')) return 'Suggest scheduling a meeting.';
  if (text.includes('follow up')) return 'Follow up recommended.';
  if (text.includes('reply')) return 'Reply suggested.';
  return null;
}

export const CustomInbox: React.FC = () => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const [prompt, setPrompt] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [filtered, setFiltered] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<{ [id: string]: string }>({});
  const [readStatus, setReadStatus] = useState<{ [id: string]: boolean }>({});

  const fetchEmails = async () => {
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
        'https://graph.microsoft.com/v1.0/me/messages?$top=20',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      const mapped: Email[] = (data.value || []).map((msg: any) => ({
        id: msg.id,
        subject: msg.subject,
        from: msg.from?.emailAddress?.name || 'Unknown',
        receivedDateTime: msg.receivedDateTime,
        preview: msg.bodyPreview,
      }));
      setEmails(mapped);
      setFiltered(mapped);
      setReadStatus({});
    } catch (err) {
      setError('Failed to load emails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    // eslint-disable-next-line
  }, [account, instance]);

  const handleSearch = () => {
    if (!prompt.trim()) {
      setFiltered(emails);
      return;
    }
    const lower = prompt.toLowerCase();
    setFiltered(
      emails.filter(
        (email) =>
          email.subject.toLowerCase().includes(lower) ||
          email.preview.toLowerCase().includes(lower)
      )
    );
  };

  const handleSmartReply = (email: Email) => {
    setReplyDraft((prev) => ({ ...prev, [email.id]: getSmartReply(email) }));
  };

  const handleRefresh = () => {
    fetchEmails();
  };

  const handleToggleRead = (email: Email) => {
    setReadStatus((prev) => ({ ...prev, [email.id]: !prev[email.id] }));
  };

  if (!account) {
    return <Text>Please sign in to view your inbox.</Text>;
  }
  if (loading) {
    return <Spinner label="Loading emails..." />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>Custom Inbox</Text>
        <IconButton iconProps={{ iconName: 'Refresh' }} title="Refresh" ariaLabel="Refresh" onClick={handleRefresh} />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <TextField
          label="Enter a keyword to filter emails"
          value={prompt}
          onChange={(_, newValue) => setPrompt(newValue || '')}
          placeholder="e.g., project, invoice, meeting"
          styles={{ root: { flex: 1 } }}
        />
        <PrimaryButton
          text="Search"
          onClick={handleSearch}
          disabled={loading}
        />
      </Stack>
      <List
        items={filtered}
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
              {getSuggestion(email) && <Label styles={{ root: { background: '#f59e42', color: '#222' } }}>{getSuggestion(email)}</Label>}
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