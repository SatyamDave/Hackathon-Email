import React, { useState, useEffect } from 'react';
import { Stack, TextField, PrimaryButton, List, Text, Spinner, Label, DefaultButton, IconButton } from '@fluentui/react';
import { mockEmails } from '../../data/mockEmails';

interface Email {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  preview: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  urgency: string;
  labels: string[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

export const CustomInbox: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [filtered, setFiltered] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<{ [id: string]: any }>({});
  const [summaries, setSummaries] = useState<{ [id: string]: any }>({});
  const [readStatus, setReadStatus] = useState<{ [id: string]: boolean }>({});

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, use mock emails
      setEmails(mockEmails);
      setFiltered(mockEmails);
      setReadStatus({});
    } catch (err) {
      setError('Failed to load emails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

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
          email.content.toLowerCase().includes(lower)
      )
    );
  };

  const handleSmartReply = async (email: Email) => {
    try {
      // Mock AI reply generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockReply = `Thank you for your email regarding "${email.subject}". I appreciate you reaching out and will review the details you've provided. I'll get back to you with a comprehensive response shortly.`;
      setReplyDrafts((prev) => ({ ...prev, [email.id]: mockReply }));
    } catch (error) {
      console.error('Error generating reply:', error);
    }
  };

  const handleGetSummary = async (email: Email) => {
    try {
      // Mock AI summary generation
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockSummary = `This email from ${email.sender.name} discusses ${email.subject.toLowerCase()}. It appears to be ${email.isImportant ? 'important' : 'standard'} communication requiring ${email.urgency === 'high' ? 'immediate' : 'standard'} attention.`;
      setSummaries((prev) => ({ ...prev, [email.id]: mockSummary }));
    } catch (error) {
      console.error('Error generating summary:', error);
    }
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
    <Stack tokens={{ childrenGap: 15 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>AI-Powered Inbox</Text>
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
            <Stack 
              tokens={{ childrenGap: 5 }} 
              styles={{ 
                root: { 
                  padding: '15px', 
                  margin: '10px 0',
                  borderRadius: '8px',
                  border: '1px solid #eee',
                  background: !readStatus[email.id] ? '#f3f6fd' : undefined,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                } 
              }}
            >
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>{email.subject}</Text>
                {!readStatus[email.id] && <Label styles={{ root: { background: '#0078d4', color: 'white', borderRadius: '4px' } }}>Unread</Label>}
                {email.labels.map((label, idx) => (
                  <Label key={idx} styles={{ root: { background: '#f3f2f1', borderRadius: '4px' } }}>{label}</Label>
                ))}
                <IconButton 
                  iconProps={{ iconName: readStatus[email.id] ? 'Mail' : 'MailUnread' }} 
                  title="Toggle Read" 
                  ariaLabel="Toggle Read" 
                  onClick={() => handleToggleRead(email)} 
                />
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                {email.sender.avatar && (
                  <img 
                    src={email.sender.avatar} 
                    alt={email.sender.name} 
                    style={{ width: 24, height: 24, borderRadius: '50%' }} 
                  />
                )}
                <Text variant="small">{email.sender.name}</Text>
                <Text variant="small" styles={{ root: { color: '#666' } }}>{formatDate(email.timestamp)}</Text>
              </Stack>
              <Text variant="small">{email.preview}</Text>
              
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                <DefaultButton 
                  text="AI Summary" 
                  onClick={() => handleGetSummary(email)}
                  styles={{
                    root: { borderRadius: '4px' }
                  }}
                />
                <DefaultButton 
                  text="Smart Reply" 
                  onClick={() => handleSmartReply(email)}
                  styles={{
                    root: { borderRadius: '4px' }
                  }}
                />
              </Stack>

              {summaries[email.id] && (
                <Stack 
                  tokens={{ childrenGap: 5 }} 
                  styles={{ 
                    root: { 
                      background: '#f8f8f8', 
                      padding: 12, 
                      borderRadius: 4, 
                      marginTop: 8 
                    } 
                  }}
                >
                  <Text variant="small" styles={{ root: { fontWeight: 600 } }}>AI Summary:</Text>
                  <Text variant="small">{summaries[email.id]}</Text>
                </Stack>
              )}

              {replyDrafts[email.id] && (
                <Stack 
                  tokens={{ childrenGap: 5 }} 
                  styles={{ 
                    root: { 
                      background: '#f0f8ff', 
                      padding: 12, 
                      borderRadius: 4, 
                      marginTop: 8 
                    } 
                  }}
                >
                  <Text variant="small" styles={{ root: { fontWeight: 600 } }}>AI Reply Draft:</Text>
                  <Text variant="small">{replyDrafts[email.id]}</Text>
                </Stack>
              )}
            </Stack>
          ) : null
        )}
      />
    </Stack>
  );
}; 