import React, { useState, useEffect } from 'react';
import { Stack, TextField, PrimaryButton, List, Text, Spinner, Label, DefaultButton, IconButton } from '@fluentui/react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../msalConfig';
import { mockEmails } from '../../data/mockEmails';
import { AIService } from '../../services/aiService';

const aiService = new AIService();

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
  const { instance, accounts } = useMsal();
  const account = accounts[0];
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
      const reply = await aiService.generateReply(email.id, email);
      setReplyDrafts((prev) => ({ ...prev, [email.id]: reply }));
    } catch (error) {
      console.error('Error generating reply:', error);
    }
  };

  const handleGetSummary = async (email: Email) => {
    try {
      const summary = await aiService.generateSummary(email.id, email);
      setSummaries((prev) => ({ ...prev, [email.id]: summary }));
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
                  <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>AI Summary</Text>
                  <Text>{summaries[email.id].summary}</Text>
                  {summaries[email.id].keyPoints.length > 0 && (
                    <>
                      <Text variant="small" styles={{ root: { fontWeight: 600 } }}>Key Points:</Text>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {summaries[email.id].keyPoints.map((point: string, idx: number) => (
                          <li key={idx}><Text variant="small">{point}</Text></li>
                        ))}
                      </ul>
                    </>
                  )}
                  {summaries[email.id].actionItems.length > 0 && (
                    <>
                      <Text variant="small" styles={{ root: { fontWeight: 600 } }}>Action Items:</Text>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {summaries[email.id].actionItems.map((item: string, idx: number) => (
                          <li key={idx}><Text variant="small">{item}</Text></li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Stack horizontal tokens={{ childrenGap: 8 }}>
                    <Label styles={{ root: { background: summaries[email.id].urgency === 'high' ? '#d13438' : '#ffaa44', color: 'white', borderRadius: '4px' } }}>
                      {summaries[email.id].urgency.toUpperCase()}
                    </Label>
                    <Label styles={{ root: { background: '#0078d4', color: 'white', borderRadius: '4px' } }}>
                      {summaries[email.id].category}
                    </Label>
                  </Stack>
                </Stack>
              )}

              {replyDrafts[email.id] && (
                <Stack 
                  tokens={{ childrenGap: 5 }} 
                  styles={{ 
                    root: { 
                      background: '#f0f7ff', 
                      padding: 12, 
                      borderRadius: 4, 
                      marginTop: 8 
                    } 
                  }}
                >
                  <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>AI-Generated Reply</Text>
                  <Text styles={{ root: { whiteSpace: 'pre-line' } }}>{replyDrafts[email.id].reply}</Text>
                  <Stack horizontal tokens={{ childrenGap: 8 }}>
                    <Label styles={{ root: { background: '#0078d4', color: 'white', borderRadius: '4px' } }}>
                      {replyDrafts[email.id].tone.toUpperCase()}
                    </Label>
                    <Label styles={{ root: { background: '#107c10', color: 'white', borderRadius: '4px' } }}>
                      {Math.round(replyDrafts[email.id].confidence * 100)}% Confidence
                    </Label>
                  </Stack>
                  {replyDrafts[email.id].suggestions.length > 0 && (
                    <>
                      <Text variant="small" styles={{ root: { fontWeight: 600 } }}>Suggestions:</Text>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {replyDrafts[email.id].suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx}><Text variant="small">{suggestion}</Text></li>
                        ))}
                      </ul>
                    </>
                  )}
                </Stack>
              )}
            </Stack>
          ) : null
        )}
      />
    </Stack>
  );
}; 