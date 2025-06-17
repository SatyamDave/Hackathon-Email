import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface OutlookAuthConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
}

export interface OutlookEmail {
  id: string;
  subject: string;
  bodyPreview: string;
  body: {
    content: string;
    contentType: string;
  };
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  receivedDateTime: string;
  isRead: boolean;
  importance: string;
  hasAttachments: boolean;
  conversationId: string;
}

class OutlookService {
  private config: OutlookAuthConfig;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_OUTLOOK_CLIENT_ID || 'mock_client_id',
      tenantId: import.meta.env.VITE_OUTLOOK_TENANT_ID || 'mock_tenant_id',
      redirectUri: window.location.origin + '/auth/callback',
      scopes: [
        'https://graph.microsoft.com/Mail.Read',
        'https://graph.microsoft.com/Mail.Send',
        'https://graph.microsoft.com/Calendars.ReadWrite',
        'https://graph.microsoft.com/User.Read'
      ]
    };
  }

  // Mock authentication - in real implementation, this would use MSAL
  async authenticate(): Promise<{ accessToken: string; user: any }> {
    // Simulate authentication flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 'user_123',
      displayName: 'John Doe',
      mail: 'john.doe@company.com',
      userPrincipalName: 'john.doe@company.com'
    };

    const mockAccessToken = 'mock_access_token_' + Date.now();

    return {
      accessToken: mockAccessToken,
      user: mockUser
    };
  }

  // Sync emails from Outlook
  async syncEmails(userId: string, accessToken: string): Promise<any[]> {
    try {
      console.log('[OutlookService] syncEmails called with:', { userId, accessToken });
      if (userId && userId.includes('@')) {
        console.warn('[OutlookService] userId looks like an email, but emails.user_id expects a UUID. This may cause issues.');
      }

      // Mock Outlook Graph API response for now
      const mockOutlookEmails = [
        {
          id: "outlook_msg_001",
          subject: "Q4 Strategy Meeting - Action Required",
          bodyPreview: "Hi team, we need to schedule our Q4 strategy session. Can we meet next Friday at 2PM?",
          body: {
            content: `Hi team,

I hope this email finds you well. We need to schedule our Q4 strategy session to discuss our upcoming initiatives and budget allocation.

Can we meet next Friday at 2PM in the conference room? I'll send out the agenda tomorrow.

Please confirm your availability by end of day.

Best regards,
Sarah`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "Sarah Chen",
              address: "sarah.chen@company.com"
            }
          },
          receivedDateTime: new Date().toISOString(),
          isRead: false,
          importance: "high",
          hasAttachments: false,
          conversationId: "thread_001"
        }
      ];

      // Process emails
      const processedEmails = mockOutlookEmails.map(email => ({
        user_id: userId,
        outlook_message_id: email.id,
        sender_name: email.from.emailAddress.name,
        sender_email: email.from.emailAddress.address,
        subject: email.subject,
        content: email.body.content,
        preview: email.bodyPreview,
        received_at: email.receivedDateTime,
        is_read: email.isRead,
        urgency: email.importance === 'high' ? 'high' : 'normal',
        has_attachments: email.hasAttachments,
        ai_processed: false
      }));

      // First, check if the emails table exists
      const { error: tableCheckError } = await supabase
        .from('emails')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        if (tableCheckError.code === '42P01') { // Table doesn't exist
          throw new Error('The emails table does not exist. Please run the database migration first.');
        }
        throw new Error(`Database error: ${tableCheckError.message}`);
      }

      // Store emails in Supabase
      const { data: insertedEmails, error } = await supabase
        .from('emails')
        .upsert(processedEmails, { 
          onConflict: 'outlook_message_id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error('Error storing emails:', error);
        throw new Error(`Failed to store emails: ${error.message}`);
      }

      // Process emails with AI
      if (insertedEmails) {
        await this.processEmailsWithAI(insertedEmails);
      }

      return insertedEmails || [];

    } catch (error) {
      console.error('Email sync error:', error);
      throw error;
    }
  }

  // Process emails with AI
  private async processEmailsWithAI(emails: any[]) {
    for (const email of emails) {
      try {
        // Generate AI summary
        const summaryResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-email-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailId: email.id,
            action: 'summarize',
            emailContent: {
              subject: email.subject,
              content: email.content,
              sender: email.sender_name
            }
          })
        });

        if (summaryResponse.ok) {
          const summaryResult = await summaryResponse.json();
          
          // Store AI summary
          await supabase
            .from('ai_summaries')
            .insert({
              email_id: email.id,
              summary: summaryResult.result.summary,
              key_points: summaryResult.result.keyPoints,
              action_items: summaryResult.result.actionItems,
              sentiment: summaryResult.result.category,
              confidence_score: 0.8
            });
        }

        // Generate auto-reply
        const replyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-email-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailId: email.id,
            action: 'generate_reply',
            emailContent: {
              subject: email.subject,
              content: email.content,
              sender: email.sender_name
            }
          })
        });

        if (replyResponse.ok) {
          const replyResult = await replyResponse.json();
          
          // Store auto-reply
          await supabase
            .from('auto_replies')
            .insert({
              email_id: email.id,
              reply_content: replyResult.result.reply,
              tone: replyResult.result.tone
            });
        }

        // Check for meeting requests
        const meetingResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-email-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailId: email.id,
            action: 'extract_meeting',
            emailContent: {
              subject: email.subject,
              content: email.content,
              sender: email.sender_name
            }
          })
        });

        if (meetingResponse.ok) {
          const meetingResult = await meetingResponse.json();
          
          if (meetingResult.result.hasMeetingRequest) {
            // Store meeting request
            await supabase
              .from('meeting_requests')
              .insert({
                email_id: email.id,
                title: meetingResult.result.extractedInfo?.title || email.subject,
                proposed_date: meetingResult.result.proposedDates?.[0] || null,
                proposed_time: meetingResult.result.proposedTimes?.[0] || null,
                location: meetingResult.result.suggestedLocations?.[0] || null,
                attendees: meetingResult.result.extractedInfo?.attendees || [],
                status: 'pending'
              });
          }
        }

        // Mark email as AI processed
        await supabase
          .from('emails')
          .update({ ai_processed: true })
          .eq('id', email.id);

      } catch (error) {
        console.error(`Error processing email ${email.id} with AI:`, error);
      }
    }
  }

  // Send email reply
  async sendReply(emailId: string, replyContent: string, accessToken: string): Promise<boolean> {
    try {
      // In a real implementation, this would call Microsoft Graph API
      // For now, we'll simulate sending and update our database
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update auto-reply as sent
      await supabase
        .from('auto_replies')
        .update({ 
          is_sent: true, 
          sent_at: new Date().toISOString() 
        })
        .eq('email_id', emailId);

      return true;
    } catch (error) {
      console.error('Error sending reply:', error);
      return false;
    }
  }

  // Schedule meeting
  async scheduleMeeting(meetingData: any, accessToken: string): Promise<any> {
    try {
      // Call calendar integration function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-integration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_event',
          eventData: meetingData,
          accessToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule meeting');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Meeting scheduling failed');
      }

      // Update meeting request with event ID
      if (meetingData.meetingRequestId) {
        await supabase
          .from('meeting_requests')
          .update({ 
            outlook_event_id: result.result.eventId,
            status: 'accepted'
          })
          .eq('id', meetingData.meetingRequestId);
      }

      return result.result;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }

  // Get user's availability
  async getAvailability(startDate: string, endDate: string, accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-integration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_availability',
          eventData: { startDate, endDate },
          accessToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get availability');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error getting availability:', error);
      throw error;
    }
  }
}

export const outlookService = new OutlookService();