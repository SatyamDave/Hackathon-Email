/*
  # Outlook Email Sync Function
  
  This edge function simulates syncing emails from Outlook Graph API
  and processes them with AI for smart inbox features.
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface OutlookEmail {
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

// CORS helper
function withCORS(response: Response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, { ...response, headers: newHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userId, accessToken } = await req.json();

    // Mock Outlook Graph API response
    const mockOutlookEmails: OutlookEmail[] = [
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
      },
      {
        id: "outlook_msg_002",
        subject: "Project Alpha - Final Review Complete",
        bodyPreview: "Great news! I've completed the final review of Project Alpha. Everything looks good to go.",
        body: {
          content: `Hi there,

Great news! I've completed the final review of Project Alpha and everything looks good to go.

Key findings:
- All security requirements have been met
- Performance benchmarks exceeded by 15%
- Documentation is comprehensive

We're ready for launch next week. Let me know if you need anything else.

Cheers,
Alex`,
          contentType: "text"
        },
        from: {
          emailAddress: {
            name: "Alex Rodriguez",
            address: "alex.rodriguez@company.com"
          }
        },
        receivedDateTime: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        importance: "normal",
        hasAttachments: false,
        conversationId: "thread_002"
      }
    ];

    // Process each email with AI
    const processedEmails = await Promise.all(
      mockOutlookEmails.map(async (email) => {
        // AI Analysis
        const aiAnalysis = await analyzeEmailWithAI(email);
        
        return {
          outlook_message_id: email.id,
          sender_name: email.from.emailAddress.name,
          sender_email: email.from.emailAddress.address,
          subject: email.subject,
          content: email.body.content,
          preview: email.bodyPreview,
          received_at: email.receivedDateTime,
          is_read: email.isRead,
          urgency: mapImportanceToUrgency(email.importance),
          has_attachments: email.hasAttachments,
          ai_analysis: aiAnalysis,
          conversation_id: email.conversationId
        };
      })
    );

    return withCORS(new Response(
      JSON.stringify({
        success: true,
        emails: processedEmails,
        synced_at: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ));

  } catch (error) {
    console.error('Outlook sync error:', error);
    return withCORS(new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ));
  }
});

async function analyzeEmailWithAI(email: OutlookEmail) {
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const content = email.body.content.toLowerCase();
  
  // Detect meeting requests
  const meetingKeywords = ['meet', 'meeting', 'call', 'schedule', 'appointment'];
  const hasMeetingRequest = meetingKeywords.some(keyword => content.includes(keyword));
  
  // Extract action items
  const actionKeywords = ['please', 'confirm', 'review', 'approve', 'respond', 'urgent'];
  const hasActionItems = actionKeywords.some(keyword => content.includes(keyword));
  
  // Determine urgency
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'deadline'];
  const isUrgent = urgentKeywords.some(keyword => content.includes(keyword));
  
  // Generate summary
  const summary = generateEmailSummary(email);
  
  // Generate auto-reply
  const autoReply = generateAutoReply(email);
  
  return {
    summary,
    autoReply,
    hasMeetingRequest,
    hasActionItems,
    isUrgent,
    sentiment: analyzeSentiment(content),
    keyTopics: extractKeyTopics(content),
    suggestedLabels: generateLabels(email, hasActionItems, hasMeetingRequest)
  };
}

function generateEmailSummary(email: OutlookEmail): string {
  const content = email.body.content;
  const sender = email.from.emailAddress.name;
  
  if (content.includes('meeting') || content.includes('schedule')) {
    return `📅 ${sender} is requesting a meeting. Check for proposed times and respond with availability.`;
  }
  
  if (content.includes('review') || content.includes('feedback')) {
    return `📋 ${sender} is requesting review or feedback on a project or document.`;
  }
  
  if (content.includes('urgent') || content.includes('asap')) {
    return `🚨 Urgent message from ${sender} requiring immediate attention.`;
  }
  
  return `📧 Message from ${sender} - ${email.bodyPreview.substring(0, 100)}...`;
}

function generateAutoReply(email: OutlookEmail): string {
  const sender = email.from.emailAddress.name;
  const content = email.body.content.toLowerCase();
  
  if (content.includes('meeting') || content.includes('schedule')) {
    return `Hi ${sender},

Thank you for reaching out about scheduling a meeting. I'll review my calendar and get back to you with my availability shortly.

Best regards`;
  }
  
  if (content.includes('review') || content.includes('feedback')) {
    return `Hi ${sender},

Thank you for sending this for review. I'll take a look and provide my feedback by end of day.

Best regards`;
  }
  
  return `Hi ${sender},

Thank you for your email. I've received your message and will respond shortly.

Best regards`;
}

function mapImportanceToUrgency(importance: string): string {
  switch (importance.toLowerCase()) {
    case 'high': return 'high';
    case 'low': return 'low';
    default: return 'medium';
  }
}

function analyzeSentiment(content: string): string {
  const positiveWords = ['great', 'excellent', 'good', 'thanks', 'appreciate'];
  const negativeWords = ['urgent', 'problem', 'issue', 'concern', 'delay'];
  
  const positiveCount = positiveWords.filter(word => content.includes(word)).length;
  const negativeCount = negativeWords.filter(word => content.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractKeyTopics(content: string): string[] {
  const topics = [];
  
  if (content.includes('project')) topics.push('Project');
  if (content.includes('meeting')) topics.push('Meeting');
  if (content.includes('review')) topics.push('Review');
  if (content.includes('budget')) topics.push('Budget');
  if (content.includes('deadline')) topics.push('Deadline');
  
  return topics;
}

function generateLabels(email: OutlookEmail, hasActionItems: boolean, hasMeetingRequest: boolean): string[] {
  const labels = [];
  
  if (hasActionItems) labels.push('Action Needed');
  if (hasMeetingRequest) labels.push('Meeting Request');
  if (email.importance === 'high') labels.push('High Priority');
  
  const content = email.body.content.toLowerCase();
  if (content.includes('project')) labels.push('Project');
  if (content.includes('fyi')) labels.push('FYI');
  
  return labels;
}