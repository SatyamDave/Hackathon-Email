export interface AIProcessingResult {
  summary?: {
    summary: string;
    keyPoints: string[];
    actionItems: string[];
    urgency: string;
    category: string;
  };
  reply?: {
    reply: string;
    tone: string;
    confidence: number;
    suggestions: string[];
  };
  meetingInfo?: {
    hasMeetingRequest: boolean;
    proposedTimes: string[];
    proposedDates: string[];
    suggestedLocations: string[];
    confidence: number;
    extractedInfo: any;
  };
  sentiment?: {
    sentiment: string;
    confidence: number;
    indicators: any;
    emotionalTone: string;
    urgencyLevel: string;
  };
}

export class AIService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private useMockData: boolean = true; // For development/demo purposes

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
    this.headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  private generateMockSummary(emailContent: any) {
    const content = typeof emailContent === 'string' ? emailContent : emailContent.content;
    const subject = typeof emailContent === 'string' ? '' : emailContent.subject;

    // Generate a realistic mock summary based on content
    const keyPoints = content.split('\n')
      .filter((line: string) => line.trim().length > 0)
      .slice(0, 3)
      .map((line: string) => line.trim());

    const urgencyWords = ['urgent', 'asap', 'emergency', 'critical', 'immediate'];
    const hasUrgentWords = urgencyWords.some(word => 
      (content + subject).toLowerCase().includes(word)
    );

    return {
      summary: content.length > 200 ? content.slice(0, 200) + '...' : content,
      keyPoints,
      actionItems: content.includes('ACTION') ? ['Review and respond', 'Schedule follow-up'] : [],
      urgency: hasUrgentWords ? 'high' : 'medium',
      category: this.determineCategory(content + subject)
    };
  }

  private generateMockReply(emailContent: any) {
    const content = typeof emailContent === 'string' ? emailContent : emailContent.content;
    const sender = typeof emailContent === 'string' ? 'Sender' : emailContent.sender?.name || 'Sender';
    const subject = typeof emailContent === 'string' ? '' : emailContent.subject;

    // Generate a contextual mock reply
    const isUrgent = (content + subject).toLowerCase().includes('urgent');
    const isMeeting = (content + subject).toLowerCase().includes('meeting');
    const isProject = (content + subject).toLowerCase().includes('project');

    let reply = `Dear ${sender.split(' ')[0]},\n\n`;
    
    if (isUrgent) {
      reply += "Thank you for bringing this urgent matter to my attention. I'll address this immediately.\n\n";
    } else {
      reply += "Thank you for your email. ";
    }

    if (isMeeting) {
      reply += "I confirm my attendance for the meeting. Looking forward to our discussion.\n\n";
    } else if (isProject) {
      reply += "I've reviewed the project details and will provide my input shortly.\n\n";
    } else {
      reply += "I'll review this and get back to you soon.\n\n";
    }

    reply += "Best regards,\n[Your name]";

    return {
      reply,
      tone: isUrgent ? 'urgent' : 'professional',
      confidence: 0.85,
      suggestions: [
        'Schedule a follow-up',
        'Request more information',
        'Forward to team'
      ]
    };
  }

  private determineCategory(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('security') || lowerText.includes('breach')) return 'Security';
    if (lowerText.includes('meeting') || lowerText.includes('schedule')) return 'Meeting';
    if (lowerText.includes('project')) return 'Project';
    if (lowerText.includes('contract') || lowerText.includes('legal')) return 'Legal';
    if (lowerText.includes('hr') || lowerText.includes('benefits')) return 'HR';
    return 'General';
  }

  // Generate AI summary for an email
  async generateSummary(emailId: string, emailContent: any): Promise<AIProcessingResult['summary']> {
    if (this.useMockData) {
      return this.generateMockSummary(emailContent);
    }

    try {
      const response = await fetch(`${this.baseUrl}/ai-email-processor`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          emailId,
          action: 'summarize',
          emailContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Summary generation failed');
      }

      return result.result;
    } catch (error) {
      console.error('Error generating summary:', error);
      return this.generateMockSummary(emailContent); // Fallback to mock data
    }
  }

  // Generate auto-reply for an email
  async generateReply(emailId: string, emailContent: any): Promise<AIProcessingResult['reply']> {
    if (this.useMockData) {
      return this.generateMockReply(emailContent);
    }

    try {
      const response = await fetch(`${this.baseUrl}/ai-email-processor`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          emailId,
          action: 'generate_reply',
          emailContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Reply generation failed');
      }

      return result.result;
    } catch (error) {
      console.error('Error generating reply:', error);
      return this.generateMockReply(emailContent); // Fallback to mock data
    }
  }

  // Extract meeting information from email
  async extractMeetingInfo(emailId: string, emailContent: any): Promise<AIProcessingResult['meetingInfo']> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-email-processor`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          emailId,
          action: 'extract_meeting',
          emailContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to extract meeting info');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Meeting extraction failed');
      }

      return result.result;
    } catch (error) {
      console.error('Error extracting meeting info:', error);
      throw error;
    }
  }

  // Analyze email sentiment
  async analyzeSentiment(emailId: string, emailContent: any): Promise<AIProcessingResult['sentiment']> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-email-processor`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          emailId,
          action: 'analyze_sentiment',
          emailContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Sentiment analysis failed');
      }

      return result.result;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  // Get stored AI summary for an email
  async getStoredSummary(emailId: string): Promise<any> {
    return null;
  }

  // Get stored auto-reply for an email
  async getStoredReply(emailId: string): Promise<any> {
    return null;
  }

  // Get meeting request for an email
  async getMeetingRequest(emailId: string): Promise<any> {
    return null;
  }

  // Generate smart labels for emails
  async generateSmartLabels(emails: any[]): Promise<{ [emailId: string]: string[] }> {
    const labelMap: { [emailId: string]: string[] } = {};

    for (const email of emails) {
      const labels: string[] = [];
      const content = email.content.toLowerCase();
      const subject = email.subject.toLowerCase();

      // Action-based labels
      if (content.includes('please') || content.includes('confirm') || content.includes('respond')) {
        labels.push('Action Needed');
      }

      // Meeting-related labels
      if (content.includes('meeting') || content.includes('schedule') || content.includes('call')) {
        labels.push('Meeting Request');
      }

      // Project-related labels
      if (content.includes('project') || subject.includes('project')) {
        labels.push('Project');
      }

      // Urgency labels
      if (content.includes('urgent') || content.includes('asap') || email.urgency === 'high') {
        labels.push('Urgent');
      }

      // FYI labels
      if (content.includes('fyi') || content.includes('for your information')) {
        labels.push('FYI');
      }

      // Review labels
      if (content.includes('review') || content.includes('feedback')) {
        labels.push('Review');
      }

      labelMap[email.id] = labels;
    }

    return labelMap;
  }

  // Update day planner with AI insights
  async updateDayPlanner(userId: string, emails: any[]): Promise<void> {
    // Implementation needed
  }
}

export const aiService = new AIService();