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

class AIService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
    this.headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  // Generate AI summary for an email
  async generateSummary(emailId: string, emailContent: any): Promise<AIProcessingResult['summary']> {
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
      throw error;
    }
  }

  // Generate auto-reply for an email
  async generateReply(emailId: string, emailContent: any): Promise<AIProcessingResult['reply']> {
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
      throw error;
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