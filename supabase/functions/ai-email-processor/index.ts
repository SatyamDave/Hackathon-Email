/*
  # AI Email Processor Function
  
  Processes emails with AI to generate summaries, replies, and extract insights
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ProcessEmailRequest {
  emailId: string;
  action: 'summarize' | 'generate_reply' | 'extract_meeting' | 'analyze_sentiment';
  emailContent: {
    subject: string;
    content: string;
    sender: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { emailId, action, emailContent }: ProcessEmailRequest = await req.json();

    let result;

    switch (action) {
      case 'summarize':
        result = await generateSummary(emailContent);
        break;
      case 'generate_reply':
        result = await generateReply(emailContent);
        break;
      case 'extract_meeting':
        result = await extractMeetingInfo(emailContent);
        break;
      case 'analyze_sentiment':
        result = await analyzeSentiment(emailContent);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId,
        action,
        result,
        processed_at: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('AI processing error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

async function generateSummary(emailContent: any) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { subject, content, sender } = emailContent;
  const contentLower = content.toLowerCase();
  
  // Smart summary generation based on content analysis
  if (contentLower.includes('meeting') && contentLower.includes('schedule')) {
    const timeMatch = content.match(/(\d{1,2}:?\d{0,2}\s*(?:AM|PM|am|pm))/);
    const dateMatch = content.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next\s+\w+)/i);
    
    return {
      summary: `📅 ${sender} is requesting a meeting${timeMatch ? ` at ${timeMatch[0]}` : ''}${dateMatch ? ` on ${dateMatch[0]}` : ''}. Confirmation needed.`,
      keyPoints: [
        'Meeting request',
        timeMatch ? `Proposed time: ${timeMatch[0]}` : 'Time to be determined',
        'Requires response'
      ],
      actionItems: ['Confirm availability', 'Respond with preferred time'],
      urgency: 'high',
      category: 'meeting_request'
    };
  }
  
  if (contentLower.includes('review') || contentLower.includes('feedback')) {
    return {
      summary: `📋 ${sender} is requesting review or feedback on a project/document.`,
      keyPoints: [
        'Review request',
        'Feedback needed',
        'Project-related'
      ],
      actionItems: ['Review attached materials', 'Provide feedback'],
      urgency: 'medium',
      category: 'review_request'
    };
  }
  
  if (contentLower.includes('urgent') || contentLower.includes('asap')) {
    return {
      summary: `🚨 Urgent message from ${sender} requiring immediate attention.`,
      keyPoints: [
        'Marked as urgent',
        'Immediate action required'
      ],
      actionItems: ['Read full message', 'Respond promptly'],
      urgency: 'high',
      category: 'urgent'
    };
  }
  
  if (contentLower.includes('complete') || contentLower.includes('finished')) {
    return {
      summary: `✅ ${sender} is reporting completion of a task or project.`,
      keyPoints: [
        'Task/project completed',
        'Status update'
      ],
      actionItems: ['Acknowledge completion', 'Review results if needed'],
      urgency: 'low',
      category: 'status_update'
    };
  }
  
  // Default summary
  return {
    summary: `📧 Message from ${sender} regarding: ${subject}`,
    keyPoints: [
      'General communication',
      subject
    ],
    actionItems: ['Read and respond as needed'],
    urgency: 'medium',
    category: 'general'
  };
}

async function generateReply(emailContent: any) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { subject, content, sender } = emailContent;
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('meeting') && contentLower.includes('schedule')) {
    return {
      reply: `Hi ${sender},

Thank you for reaching out about scheduling a meeting. I'll check my calendar and get back to you with my availability shortly.

Looking forward to our discussion.

Best regards`,
      tone: 'professional',
      confidence: 0.9,
      suggestions: [
        'Add specific available times',
        'Mention agenda items if known',
        'Suggest alternative meeting formats if needed'
      ]
    };
  }
  
  if (contentLower.includes('review') || contentLower.includes('feedback')) {
    return {
      reply: `Hi ${sender},

Thank you for sending this for review. I'll examine the materials carefully and provide my feedback by end of day.

If you need my input on any specific aspects, please let me know.

Best regards`,
      tone: 'professional',
      confidence: 0.85,
      suggestions: [
        'Specify review timeline',
        'Ask clarifying questions if needed',
        'Mention your expertise area'
      ]
    };
  }
  
  if (contentLower.includes('urgent') || contentLower.includes('asap')) {
    return {
      reply: `Hi ${sender},

I've received your urgent message and understand the time-sensitive nature. I'll prioritize this and respond with the requested information shortly.

Thank you for flagging the urgency.

Best regards`,
      tone: 'urgent_professional',
      confidence: 0.95,
      suggestions: [
        'Provide specific timeline for response',
        'Acknowledge the urgency appropriately',
        'Offer immediate next steps if possible'
      ]
    };
  }
  
  if (contentLower.includes('complete') || contentLower.includes('finished')) {
    return {
      reply: `Hi ${sender},

Thank you for the update on the completion. This is great news!

I'll review the results and let you know if I have any questions or next steps.

Well done!

Best regards`,
      tone: 'positive_professional',
      confidence: 0.8,
      suggestions: [
        'Acknowledge the achievement',
        'Mention next steps if applicable',
        'Express appreciation for the work'
      ]
    };
  }
  
  // Default reply
  return {
    reply: `Hi ${sender},

Thank you for your email. I've received your message and will respond with the requested information shortly.

Best regards`,
    tone: 'professional',
    confidence: 0.7,
    suggestions: [
      'Customize based on specific content',
      'Add timeline for response',
      'Include relevant context'
    ]
  };
}

async function extractMeetingInfo(emailContent: any) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const { content } = emailContent;
  
  // Extract time patterns
  const timePattern = /(\d{1,2}:?\d{0,2}\s*(?:AM|PM|am|pm))/gi;
  const datePattern = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next\s+\w+|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2})/gi;
  const locationPattern = /(conference room|meeting room|office|zoom|teams|skype|call)/gi;
  
  const times = content.match(timePattern) || [];
  const dates = content.match(datePattern) || [];
  const locations = content.match(locationPattern) || [];
  
  const hasMeetingRequest = content.toLowerCase().includes('meet') || 
                           content.toLowerCase().includes('meeting') ||
                           content.toLowerCase().includes('schedule') ||
                           content.toLowerCase().includes('call');
  
  if (!hasMeetingRequest) {
    return {
      hasMeetingRequest: false,
      confidence: 0.1
    };
  }
  
  return {
    hasMeetingRequest: true,
    proposedTimes: times.slice(0, 3), // Limit to first 3 matches
    proposedDates: dates.slice(0, 3),
    suggestedLocations: locations.slice(0, 2),
    confidence: 0.8,
    extractedInfo: {
      title: extractMeetingTitle(content),
      duration: extractDuration(content),
      attendees: extractAttendees(content)
    }
  };
}

function extractMeetingTitle(content: string): string {
  // Look for common meeting title patterns
  const titlePatterns = [
    /meeting about (.+?)(?:\.|,|$)/i,
    /(.+?) meeting/i,
    /discuss (.+?)(?:\.|,|$)/i,
    /(.+?) discussion/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'Meeting Discussion';
}

function extractDuration(content: string): number {
  const durationPattern = /(\d+)\s*(hour|hr|minute|min)/i;
  const match = content.match(durationPattern);
  
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.includes('hour') || unit.includes('hr')) {
      return value * 60; // Convert to minutes
    }
    return value;
  }
  
  return 60; // Default 1 hour
}

function extractAttendees(content: string): string[] {
  // Simple email extraction
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emails = content.match(emailPattern) || [];
  
  return emails.slice(0, 5); // Limit to 5 attendees
}

async function analyzeSentiment(emailContent: any) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const { content } = emailContent;
  const contentLower = content.toLowerCase();
  
  // Positive indicators
  const positiveWords = ['great', 'excellent', 'good', 'thanks', 'appreciate', 'wonderful', 'fantastic', 'pleased', 'happy', 'congratulations'];
  const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
  
  // Negative indicators
  const negativeWords = ['urgent', 'problem', 'issue', 'concern', 'delay', 'disappointed', 'frustrated', 'error', 'mistake', 'wrong'];
  const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
  
  // Neutral indicators
  const neutralWords = ['update', 'information', 'regarding', 'please', 'kindly', 'request'];
  const neutralCount = neutralWords.filter(word => contentLower.includes(word)).length;
  
  let sentiment = 'neutral';
  let confidence = 0.5;
  
  if (positiveCount > negativeCount && positiveCount > 0) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.6 + (positiveCount * 0.1));
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.6 + (negativeCount * 0.1));
  } else if (neutralCount > 0) {
    sentiment = 'neutral';
    confidence = Math.min(0.8, 0.5 + (neutralCount * 0.05));
  }
  
  return {
    sentiment,
    confidence,
    indicators: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount
    },
    emotionalTone: determineEmotionalTone(contentLower),
    urgencyLevel: determineUrgencyLevel(contentLower)
  };
}

function determineEmotionalTone(content: string): string {
  if (content.includes('urgent') || content.includes('asap') || content.includes('immediately')) {
    return 'urgent';
  }
  if (content.includes('please') && content.includes('thank')) {
    return 'polite';
  }
  if (content.includes('congratulations') || content.includes('excellent')) {
    return 'celebratory';
  }
  if (content.includes('concern') || content.includes('issue')) {
    return 'concerned';
  }
  
  return 'professional';
}

function determineUrgencyLevel(content: string): 'low' | 'medium' | 'high' {
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'deadline', 'critical'];
  const mediumKeywords = ['soon', 'please', 'needed', 'important'];
  
  if (urgentKeywords.some(keyword => content.includes(keyword))) {
    return 'high';
  }
  if (mediumKeywords.some(keyword => content.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
}