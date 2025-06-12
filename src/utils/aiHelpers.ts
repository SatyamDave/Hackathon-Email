import { Email } from '../types/email';

export const generateAISummary = async (email: Email): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const summaries: { [key: string]: string } = {
    '1': '📅 Sarah Chen requests Q4 strategy meeting for next Friday at 2PM. Requires confirmation by end of day. Meeting will cover initiatives and budget allocation.',
    '2': '⏰ Weekly standup reminder for tomorrow 10:00 AM via Microsoft Teams. Meeting ID provided for easy access.',
    '3': '✅ Project Alpha final review completed successfully. All requirements met, performance exceeded expectations by 15%. Ready for launch next week.',
    '4': '🚨 Urgent contract amendments needed due to compliance changes. Lisa Park available 1-4 PM today for discussion call.',
    '5': '📋 Benefits enrollment deadline reminder - Friday, January 19th at 11:59 PM. Contact HR helpdesk for assistance if needed.',
    '6': '☕ David Kim suggests informal coffee catch-up this week to discuss project updates and general networking.'
  };
  
  return summaries[email.id] || 'AI summary: This email contains important information that may require your attention.';
};

export const generateAutoReply = async (email: Email): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const replies: { [key: string]: string } = {
    '1': `Hi Sarah,

Thank you for organizing the Q4 strategy session. Friday at 2PM works well for me, and I'll be there in the conference room.

Looking forward to discussing our initiatives and budget planning.

Best regards`,
    '2': `Thank you for the reminder. I have the meeting in my calendar and will join on time.

Best regards`,
    '3': `Hi Alex,

Excellent work on the Project Alpha review! It's great to hear that we exceeded performance benchmarks and met all requirements.

I'm excited about the launch next week. Let me know if there's anything I can help with for the final preparations.

Best regards`,
    '4': `Hi Lisa,

I understand the urgency regarding the contract amendments. I'm available for a call at 2:30 PM today if that works for you.

Please send over the specific changes you need to discuss beforehand so I can review them.

Best regards`,
    '5': `Thank you for the reminder. I have completed my benefits enrollment through the HR portal.

Best regards`,
    '6': `Hi David,

Great to hear from you! I'd love to catch up over coffee. How about Wednesday afternoon around 3 PM at the usual café?

Looking forward to our conversation.

Best regards`
  };
  
  return replies[email.id] || `Hi ${email.sender.name},

Thank you for reaching out. I'll review your message and get back to you shortly.

Best regards`;
};

export const detectMeetingRequest = (content: string): boolean => {
  const meetingKeywords = [
    'meet', 'meeting', 'call', 'schedule', 'appointment', 
    'catch up', 'discussion', 'conference', 'standup'
  ];
  
  return meetingKeywords.some(keyword => 
    content.toLowerCase().includes(keyword)
  );
};

export const extractMeetingDetails = (content: string) => {
  // Simple regex patterns for meeting detection
  const timePattern = /(\d{1,2}:?\d{0,2}\s*(?:AM|PM|am|pm))/gi;
  const datePattern = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next\s+\w+)/gi;
  
  const times = content.match(timePattern);
  const dates = content.match(datePattern);
  
  return {
    suggestedTime: times?.[0] || null,
    suggestedDate: dates?.[0] || null
  };
};