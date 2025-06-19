import { Email } from '../types/email';

interface EmailData {
  id: string;
  subject: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
  urgency?: string;
}

interface AzureOpenAIConfig {
  apiKey: string;
  endpoint: string;
  deploymentName: string;
  apiVersion: string;
}

class AzureOpenAIService {
  private config: AzureOpenAIConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
      endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
      deploymentName: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || '',
      apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-10-21'
    };
  }

  private isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.endpoint && this.config.deploymentName);
  }

  private async makeRequest(messages: any[]): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Azure OpenAI is not properly configured. Please check your environment variables.');
    }

    const url = `${this.config.endpoint}/openai/deployments/${this.config.deploymentName}/chat/completions?api-version=${this.config.apiVersion}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.config.apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }

  async emailAssistantChat(prompt: string, selectedEmail?: Email | null, allEmails?: Email[]): Promise<string> {
    if (!this.isConfigured()) {
      return "I'm sorry, but I'm not properly configured to help with emails right now. Please check your Azure OpenAI configuration.";
    }

    const messages = [
      {
        role: 'system',
        content: `You are an intelligent email assistant integrated with Microsoft Outlook. You can help users with:
- Email analysis and summarization
- Drafting responses and replies
- Email organization and prioritization
- Meeting scheduling and calendar management
- Task extraction and follow-up reminders
- Email etiquette and professional communication

Always be helpful, professional, and concise in your responses.`
      }
    ];

    // Add context about emails
    let emailContext = '';
    
    if (allEmails && allEmails.length > 0) {
      // Provide summary of all emails for inbox-wide queries
      const emailSummary = allEmails.map(email => ({
        id: email.id,
        subject: email.subject,
        from: email.sender?.name || email.sender?.email || 'Unknown',
        urgency: email.urgency || 'low',
        isRead: email.isRead || false,
        isImportant: email.isImportant || false,
        labels: email.labels || [],
        preview: (email.preview || '').substring(0, 100)
      }));
      
      emailContext += `Current inbox overview (${allEmails.length} emails):
${JSON.stringify(emailSummary, null, 2)}

`;
    }

    if (selectedEmail) {
      emailContext += `Currently selected email:
Subject: ${selectedEmail.subject}
From: ${selectedEmail.sender?.name || selectedEmail.sender?.email || 'Unknown'}
Date: ${selectedEmail.timestamp}
Content: ${selectedEmail.content || selectedEmail.preview || ''}
Read Status: ${selectedEmail.isRead ? 'Read' : 'Unread'}
Urgency: ${selectedEmail.urgency || 'low'}
Important: ${selectedEmail.isImportant || false}
Labels: ${(selectedEmail.labels || []).join(', ')}

`;
    }

    messages.push({
      role: 'user',
      content: emailContext + `User request: ${prompt}`
    });

    return await this.makeRequest(messages);
  }

  async analyzeEmail(emailData: EmailData): Promise<{
    summary: string;
    keyPoints: string[];
    actionItems: string[];
    urgency: 'low' | 'medium' | 'high';
    category: string;
  }> {
    const prompt = `Analyze the following email and provide a structured analysis:

Subject: ${emailData.subject}
From: ${emailData.sender}
Content: ${emailData.content}

Please provide:
1. A brief summary (2-3 sentences)
2. Key points (bullet points)
3. Action items (if any)
4. Urgency level (low/medium/high)
5. Category (meeting, project, information, action-required, etc.)

Format your response as JSON.`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an email analysis assistant. Respond only with valid JSON containing the requested analysis.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        summary: response.substring(0, 200) + '...',
        keyPoints: [],
        actionItems: [],
        urgency: 'medium' as const,
        category: 'general'
      };
    }
  }

  async generateEmailResponse(originalEmail: EmailData, context?: string): Promise<{
    reply: string;
    tone: string;
    suggestions: string[];
  }> {
    const prompt = `Generate a professional email response for the following email:

Original Email:
Subject: ${originalEmail.subject}
From: ${originalEmail.sender}
Content: ${originalEmail.content}

${context ? `Additional context: ${context}` : ''}

Please provide:
1. A complete email response
2. The tone of the response (professional, friendly, formal, etc.)
3. Alternative suggestions or improvements

Format as JSON with fields: reply, tone, suggestions`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an email writing assistant. Create professional, contextually appropriate email responses. Respond only with valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      return {
        reply: response,
        tone: 'professional',
        suggestions: []
      };
    }
  }

  async extractActionItems(emailContent: string): Promise<string[]> {
    const prompt = `Extract all action items from the following email content:

${emailContent}

Return only a JSON array of action items as strings. If no action items are found, return an empty array.`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an action item extraction assistant. Respond only with a valid JSON array of strings.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      return [];
    }
  }

  async categorizeEmails(emails: EmailData[]): Promise<{ [emailId: string]: string }> {
    const emailList = emails.map(email => ({
      id: email.id,
      subject: email.subject,
      sender: email.sender,
      content: email.content.substring(0, 500) // Limit content for API efficiency
    }));

    const prompt = `Categorize the following emails into appropriate categories (e.g., "meeting", "project", "information", "action-required", "social", "marketing", etc.):

${JSON.stringify(emailList, null, 2)}

Return a JSON object mapping email IDs to their categories.`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an email categorization assistant. Respond only with valid JSON mapping email IDs to category strings.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback categorization
      const fallback: { [emailId: string]: string } = {};
      emails.forEach(email => {
        fallback[email.id] = 'general';
      });
      return fallback;
    }
  }

  async smartPrioritizeEmails(emails: Email[]): Promise<{ [emailId: string]: 'low' | 'medium' | 'high' }> {
    const emailList = emails.map(email => ({
      id: email.id,
      subject: email.subject,
      sender: email.sender?.name || email.sender?.email || 'Unknown',
      content: email.content?.substring(0, 300) || email.preview || '',
      timestamp: email.timestamp,
      urgency: email.urgency || 'low',
      isImportant: email.isImportant || false,
      labels: email.labels || [],
      hasAttachments: email.attachments && email.attachments.length > 0,
      hasMeetingRequest: !!email.meetingRequest
    }));

    const prompt = `You are an expert email prioritization assistant. Analyze the following emails and assign priority levels based on:

IMPORTANT FACTORS:
1. Sender authority (C-level, managers, external clients vs internal teams)
2. Subject urgency indicators (urgent, action required, deadline, ASAP)
3. Content urgency (deadlines, security, legal, financial impact)
4. Time sensitivity (today's meetings, approaching deadlines)
5. Business impact (revenue, compliance, security, operations)

EMAILS TO ANALYZE:
${JSON.stringify(emailList, null, 2)}

Analyze each email's content, sender, subject, and context. Return ONLY a JSON object mapping email IDs to priority levels ("low", "medium", or "high"). 

Example format: {"1": "high", "2": "medium", "3": "low"}`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an expert email prioritization assistant with deep understanding of business communications. Analyze emails holistically considering sender authority, content urgency, business impact, and time sensitivity. Respond only with valid JSON mapping email IDs to priority levels.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback prioritization
      const fallback: { [emailId: string]: 'low' | 'medium' | 'high' } = {};
      emails.forEach(email => {
        fallback[email.id] = 'medium';
      });
      return fallback;
    }
  }

  async generateCustomSorting(emails: Email[], criteria: string): Promise<string[]> {
    const emailList = emails.map(email => ({
      id: email.id,
      subject: email.subject,
      sender: email.sender?.name || email.sender?.email || 'Unknown',
      senderEmail: email.sender?.email || '',
      content: email.content?.substring(0, 300) || email.preview || '',
      preview: email.preview || '',
      timestamp: email.timestamp,
      urgency: email.urgency || 'low',
      isImportant: email.isImportant || false,
      labels: email.labels || [],
      hasAttachments: email.attachments && email.attachments.length > 0,
      hasMeetingRequest: !!email.meetingRequest
    }));

    const prompt = `You are an intelligent email sorting assistant. The user wants to organize their emails with the following criteria:

USER CRITERIA: "${criteria}"

Analyze the following emails and return them in order based on the user's criteria. Consider:
- Subject matter relevance to the criteria
- Sender importance relative to the criteria  
- Content relevance to the sorting request
- Any specific patterns or keywords mentioned

EMAILS TO SORT:
${JSON.stringify(emailList, null, 2)}

Return ONLY a JSON array of email IDs in the order they should appear, with the most relevant emails first.

Example format: ["3", "1", "7", "2", "5"]`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an expert email organization assistant. Analyze user criteria and sort emails accordingly. Respond only with a valid JSON array of email IDs in the desired order.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback: return emails in original order
      console.error('Failed to parse custom sorting response:', error);
      return emails.map(email => email.id);
    }
  }

  async generateEmailSummary(email: Email): Promise<string> {
    const prompt = `Please provide a concise TL;DR summary (2-3 sentences max) of this email:

SUBJECT: ${email.subject}
FROM: ${email.sender?.name || email.sender?.email || 'Unknown'} (${email.sender?.email || 'Unknown'})
CONTENT: ${email.content || email.preview || ''}

Focus on the key points, main request/information, and any action items.`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an expert email summarizer. Provide clear, concise summaries that capture the essence of emails in 2-3 sentences maximum.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    return response.trim();
  }

  async generateSmartSuggestions(email: Email): Promise<string[]> {
    const prompt = `Analyze this email and provide 2-3 smart suggestions for next steps, follow-ups, or actions needed:

SUBJECT: ${email.subject}
FROM: ${email.sender?.name || email.sender?.email || 'Unknown'} (${email.sender?.email || 'Unknown'})
CONTENT: ${email.content || email.preview || ''}
HAS_ATTACHMENTS: ${email.attachments && email.attachments.length > 0}
HAS_MEETING_REQUEST: ${!!email.meetingRequest}

Suggestions should be actionable and specific. Consider:
- Follow-up actions needed
- Meeting scheduling if mentioned
- Document review if attachments
- Deadlines or time-sensitive items
- Information requests to fulfill

Return as a JSON array of strings.`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an expert assistant that provides actionable suggestions for email management. Respond only with a valid JSON array of suggestion strings.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse suggestions response:', error);
      return [
        'Review email content and respond appropriately',
        'Set reminder to follow up if needed',
        'File or organize email in appropriate folder'
      ];
    }
  }

  async generateSmartLabels(email: Email): Promise<string[]> {
    const prompt = `Classify this email with appropriate labels. Choose from these categories:
- "Action Needed" - Requires immediate action, response, or decision
- "FYI" - Informational only, no action required
- "Proposal" - Contains proposals, offers, or suggestions for consideration

SUBJECT: ${email.subject}
FROM: ${email.sender?.name || email.sender?.email || 'Unknown'} (${email.sender?.email || 'Unknown'})
CONTENT: ${email.content || email.preview || ''}
URGENCY: ${email.urgency || 'low'}
IS_IMPORTANT: ${email.isImportant || false}

You can assign multiple labels if appropriate. Return as a JSON array of strings.`;

    const response = await this.makeRequest([
      {
        role: 'system',
        content: 'You are an expert email classifier. Analyze emails and assign appropriate labels. Respond only with a valid JSON array of label strings.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse labels response:', error);
      // Fallback logic based on email properties
      const fallbackLabels = [];
      if (email.urgency === 'high' || email.isImportant) {
        fallbackLabels.push('Action Needed');
      } else {
        fallbackLabels.push('FYI');
      }
      return fallbackLabels;
    }
  }
}

// Export singleton instance
const azureOpenAIServiceInstance = new AzureOpenAIService();
export { azureOpenAIServiceInstance as AzureOpenAIService };
export default azureOpenAIServiceInstance; 