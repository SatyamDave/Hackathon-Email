import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('Supabase environment variables not found. Some features may be limited.');
}

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
          receivedDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          isRead: false,
          importance: "high",
          hasAttachments: false,
          conversationId: "thread_001"
        },
        {
          id: "outlook_msg_002",
          subject: "Project Alpha - Weekly Status Update",
          bodyPreview: "Here's the weekly status update for Project Alpha. We're on track and meeting all milestones.",
          body: {
            content: `Hi everyone,

Here's the weekly status update for Project Alpha:

✅ Milestone 1: Completed on time
✅ Milestone 2: 95% complete
🔄 Milestone 3: In progress, on track

Key achievements this week:
- User authentication system implemented
- Database optimization completed
- Frontend components finalized

Next week's priorities:
- Integration testing
- Performance optimization
- Documentation updates

Let me know if you have any questions.

Best regards,
Michael`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "Michael Rodriguez",
              address: "michael.rodriguez@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          isRead: true,
          importance: "normal",
          hasAttachments: true,
          conversationId: "thread_002"
        },
        {
          id: "outlook_msg_003",
          subject: "Security Alert - Unusual Login Activity",
          bodyPreview: "We detected unusual login activity on your account. Please review and take action if needed.",
          body: {
            content: `Dear User,

We detected unusual login activity on your account from an unrecognized device:

Location: New York, NY
Time: Today at 3:45 PM
Device: Windows 10 PC

If this was you, no action is needed. If this wasn't you, please:

1. Change your password immediately
2. Enable two-factor authentication
3. Contact our security team

Stay safe,
IT Security Team`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "IT Security",
              address: "security@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          isRead: false,
          importance: "high",
          hasAttachments: false,
          conversationId: "thread_003"
        },
        {
          id: "outlook_msg_004",
          subject: "Team Lunch - This Friday",
          bodyPreview: "Let's have a team lunch this Friday to celebrate our recent project success!",
          body: {
            content: `Hi team!

Great news - we've successfully completed the Q3 project ahead of schedule! 🎉

To celebrate this achievement, let's have a team lunch this Friday at 12:30 PM. I've made a reservation at the new Italian restaurant downtown.

Please RSVP by Wednesday so I can confirm the reservation.

Looking forward to seeing everyone there!

Cheers,
Jennifer`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "Jennifer Kim",
              address: "jennifer.kim@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          isRead: true,
          importance: "normal",
          hasAttachments: false,
          conversationId: "thread_004"
        },
        {
          id: "outlook_msg_005",
          subject: "Budget Approval - Marketing Campaign",
          bodyPreview: "Your budget request for the Q4 marketing campaign has been approved. Please proceed with implementation.",
          body: {
            content: `Hi David,

Great news! Your budget request for the Q4 marketing campaign has been approved by the executive team.

Approved amount: $50,000
Effective date: October 1st
Reporting requirements: Monthly updates

Please proceed with the implementation as outlined in your proposal. Remember to track all expenses and provide regular updates.

If you need any clarification or have questions, don't hesitate to reach out.

Best regards,
Finance Team`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "Finance Team",
              address: "finance@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          isRead: true,
          importance: "normal",
          hasAttachments: true,
          conversationId: "thread_005"
        },
        {
          id: "outlook_msg_006",
          subject: "Client Meeting - Tomorrow at 10 AM",
          bodyPreview: "Reminder: Client presentation tomorrow at 10 AM. Please prepare your slides and be ready for questions.",
          body: {
            content: `Hi team,

Just a reminder about tomorrow's client meeting:

📅 Date: Tomorrow
⏰ Time: 10:00 AM - 11:30 AM
📍 Location: Conference Room A
👥 Attendees: Client team, Sales team, Technical team

Agenda:
1. Project overview (15 min)
2. Technical demonstration (30 min)
3. Q&A session (30 min)
4. Next steps (15 min)

Please ensure your slides are ready and you're prepared for technical questions.

Let me know if you need any last-minute support.

Best regards,
Alex`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "Alex Thompson",
              address: "alex.thompson@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          isRead: false,
          importance: "high",
          hasAttachments: false,
          conversationId: "thread_006"
        },
        {
          id: "outlook_msg_007",
          subject: "New Employee Welcome - Lisa Park",
          bodyPreview: "Please welcome Lisa Park to our team! She joins us as a Senior Developer starting next Monday.",
          body: {
            content: `Hi everyone,

I'm excited to announce that Lisa Park will be joining our team as a Senior Developer starting next Monday!

Lisa brings 8 years of experience in full-stack development and has worked on several high-profile projects. She'll be working on the new mobile app initiative.

Please join me in welcoming Lisa to the team. I'll schedule a team introduction meeting for her first week.

Welcome, Lisa! 🎉

Best regards,
HR Team`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "HR Team",
              address: "hr@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          isRead: true,
          importance: "normal",
          hasAttachments: false,
          conversationId: "thread_007"
        },
        {
          id: "outlook_msg_008",
          subject: "System Maintenance - Scheduled Downtime",
          bodyPreview: "Scheduled maintenance this weekend. The system will be unavailable from 2 AM to 6 AM on Sunday.",
          body: {
            content: `Dear Users,

We will be performing scheduled system maintenance this weekend:

📅 Date: Sunday, October 15th
⏰ Time: 2:00 AM - 6:00 AM EST
🔧 Purpose: Database optimization and security updates

During this time, the following services will be temporarily unavailable:
- Email system
- File sharing
- Internal applications

We apologize for any inconvenience. The maintenance is necessary to ensure optimal performance and security.

If you have any urgent matters, please plan accordingly.

Thank you for your understanding.

IT Operations Team`,
            contentType: "text"
          },
          from: {
            emailAddress: {
              name: "IT Operations",
              address: "it-ops@company.com"
            }
          },
          receivedDateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          isRead: true,
          importance: "normal",
          hasAttachments: false,
          conversationId: "thread_008"
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

      // Check if Supabase is available
      if (!supabase) {
        console.warn('Supabase not available, returning mock data only');
        return processedEmails;
      }

      // First, check if the emails table exists
      const { error: tableCheckError } = await supabase
        .from('emails')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        if (tableCheckError.code === '42P01') { // Table doesn't exist
          console.warn('The emails table does not exist. Please run the database migration first.');
          return processedEmails; // Return mock data as fallback
        }
        console.error('Database error:', tableCheckError.message);
        return processedEmails; // Return mock data as fallback
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
        console.warn('Returning mock data due to storage error');
        return processedEmails; // Return mock data as fallback
      }

      // Process emails with AI
      if (insertedEmails) {
        await this.processEmailsWithAI(insertedEmails);
      }

      return insertedEmails || [];

    } catch (error) {
      console.error('Email sync error:', error);
      // Return mock data as fallback
      return [
        {
          id: "fallback_001",
          user_id: userId,
          outlook_message_id: "outlook_msg_001",
          sender_name: "Sarah Chen",
          sender_email: "sarah.chen@company.com",
          subject: "Q4 Strategy Meeting - Action Required",
          content: "Hi team, we need to schedule our Q4 strategy session to discuss our upcoming initiatives and budget allocation. Can we meet next Friday at 2PM?",
          preview: "Hi team, we need to schedule our Q4 strategy session. Can we meet next Friday at 2PM?",
          received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_read: false,
          urgency: 'high',
          has_attachments: false,
          ai_processed: false
        },
        {
          id: "fallback_002",
          user_id: userId,
          outlook_message_id: "outlook_msg_002",
          sender_name: "Michael Rodriguez",
          sender_email: "michael.rodriguez@company.com",
          subject: "Project Alpha - Weekly Status Update",
          content: "Here's the weekly status update for Project Alpha. We're on track and meeting all milestones.",
          preview: "Here's the weekly status update for Project Alpha. We're on track and meeting all milestones.",
          received_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          urgency: 'normal',
          has_attachments: true,
          ai_processed: false
        }
      ];
    }
  }

  // Process emails with AI
  private async processEmailsWithAI(emails: any[]) {
    // Check if Supabase is available
    if (!supabase) {
      console.warn('Supabase not available, skipping AI processing');
      return;
    }

    for (const email of emails) {
      try {
        // Check if Supabase URL and key are available
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Supabase environment variables not available, skipping AI processing');
          return;
        }

        // Generate AI summary
        const summaryResponse = await fetch(`${supabaseUrl}/functions/v1/ai-email-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
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
        const replyResponse = await fetch(`${supabaseUrl}/functions/v1/ai-email-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
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
        const meetingResponse = await fetch(`${supabaseUrl}/functions/v1/ai-email-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
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

      // Check if Supabase is available
      if (!supabase) {
        console.warn('Supabase not available, simulating reply send only');
        return true;
      }

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
      // Check if Supabase environment variables are available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase environment variables not available, simulating meeting scheduling');
        return { success: true, eventId: 'mock_event_' + Date.now() };
      }

      // Call calendar integration function
      const response = await fetch(`${supabaseUrl}/functions/v1/calendar-integration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
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
      return result.result;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }

  // Get user's availability
  async getAvailability(startDate: string, endDate: string, accessToken: string): Promise<any> {
    try {
      // Check if Supabase environment variables are available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase environment variables not available, returning mock availability');
        return {
          availableSlots: [
            { start: '2024-01-15T09:00:00Z', end: '2024-01-15T10:00:00Z' },
            { start: '2024-01-15T14:00:00Z', end: '2024-01-15T15:00:00Z' }
          ]
        };
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/calendar-integration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
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