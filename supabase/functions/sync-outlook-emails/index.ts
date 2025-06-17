/*
  # Outlook Email Sync Function
  
  This edge function simulates syncing emails from Outlook Graph API
  and processes them with AI for smart inbox features.
*/

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Client } from 'https://esm.sh/@microsoft/microsoft-graph-client@3.0.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, { ...response, headers: newHeaders });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the request body
    const { userId, accessToken } = await req.json()

    // Initialize Microsoft Graph client
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      }
    })

    // Fetch emails from Microsoft Graph
    const response = await graphClient
      .api('/me/messages')
      .select('id,subject,bodyPreview,body,from,receivedDateTime,isRead,importance,hasAttachments,conversationId')
      .top(50)
      .orderby('receivedDateTime DESC')
      .get()

    // Process emails
    const processedEmails = response.value.map((email: any) => ({
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
    }))

    // Store emails in Supabase
    const { data: insertedEmails, error } = await supabaseClient
      .from('emails')
      .upsert(processedEmails, {
        onConflict: 'outlook_message_id',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data: insertedEmails }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

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