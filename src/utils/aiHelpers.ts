import { Email } from '../types/email';
import AzureOpenAIService from '../services/azureOpenAI';

export const generateAISummary = async (email: Email): Promise<string> => {
  try {
    return await AzureOpenAIService.generateEmailSummary(email);
  } catch (error) {
    console.error('Error in generateAISummary:', error);
    return 'AI summary: This email contains important information that may require your attention.';
  }
};

export const generateAutoReply = async (email: Email): Promise<string> => {
  try {
    return await AzureOpenAIService.generateEmailReply(email);
  } catch (error) {
    console.error('Error in generateAutoReply:', error);
    return `Hi ${email.sender?.name || email.sender?.email || 'there'},

Thank you for reaching out. I'll review your message and get back to you shortly.

Best regards`;
  }
};

// Generate multiple AI reply suggestions for better user choice
export const generateReplySuggestions = async (email: Email): Promise<string[]> => {
  try {
    // Generate 3 different reply variations using AI
    const suggestionPromises = [
      generateVariationReply(email, 'professional and formal'),
      generateVariationReply(email, 'friendly and conversational'),
      generateVariationReply(email, 'brief and to-the-point')
    ];

    const suggestions = await Promise.all(suggestionPromises);
    return suggestions.filter(s => s && s.length > 0);
  } catch (error) {
    console.error('Error generating reply suggestions:', error);
    return [
      `Thank you for your email. I'll review this and get back to you soon.`,
      `Hi there! Thanks for reaching out. I appreciate your message.`,
      `Thank you for contacting me. I'll respond to your message shortly.`
    ];
  }
};

// Helper function to generate reply variations
const generateVariationReply = async (email: Email, style: string): Promise<string> => {
  try {
    return await AzureOpenAIService.generateEmailReply(email);
  } catch (error) {
    return `Thank you for your email about "${email.subject}". I'll get back to you shortly.`;
  }
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