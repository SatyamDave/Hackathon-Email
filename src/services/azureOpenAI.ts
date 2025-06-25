import { AzureOpenAI } from 'openai';
import { Email } from '../types/email';

class AzureOpenAIService {
  private client: AzureOpenAI | null = null;

  private getClient(): AzureOpenAI {
    if (!this.client) {
      this.client = new AzureOpenAI({
        apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
        endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
        apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION,
      });
    }
    return this.client;
  }

  async analyzeEmailPriority(email: Email): Promise<'high' | 'medium' | 'low'> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
        messages: [
          {
            role: 'system',
            content: `You are an email priority analyzer. Analyze the email and return only one word: "high", "medium", or "low" based on urgency and importance.

High priority: Urgent deadlines, critical issues, important meetings, security alerts, CEO/manager requests
Medium priority: Regular work items, scheduled meetings, project updates, informational requests
Low priority: Newsletters, FYI emails, social updates, non-urgent notifications`
          },
          {
            role: 'user',
            content: `Subject: ${email.subject}\n\nFrom: ${email.sender.name} (${email.sender.email})\n\nContent: ${email.content}`
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      });

      const priority = response.choices[0].message.content?.toLowerCase().trim() as 'high' | 'medium' | 'low';
      return ['high', 'medium', 'low'].includes(priority) ? priority : 'medium';
    } catch (error) {
      console.error('Error analyzing email priority:', error);
      return 'medium';
    }
  }

  async generateEmailSummary(email: Email): Promise<string> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
        messages: [
          {
            role: 'system',
            content: 'You are an expert email summarizer. Create a concise, informative summary of the email content in 1-2 sentences. Focus on key points, actions needed, and important details.'
          },
          {
            role: 'user',
            content: `Subject: ${email.subject}\n\nFrom: ${email.sender.name}\n\nContent: ${email.content}`
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      });

      return response.choices[0].message.content || 'Summary not available';
    } catch (error) {
      console.error('Error generating email summary:', error);
      return 'Unable to generate summary at this time.';
    }
  }

  async generateEmailReply(email: Email): Promise<string> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional email assistant. Generate a thoughtful, appropriate reply to the email. The reply should be:
- Professional and courteous
- Contextually relevant to the original message
- Action-oriented when appropriate
- Concise but complete
- Ready to send (include greeting and closing)`
          },
          {
            role: 'user',
            content: `I need to reply to this email:

Subject: ${email.subject}
From: ${email.sender.name} (${email.sender.email})

Original message:
${email.content}

Please generate an appropriate reply.`
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0].message.content || 'Unable to generate reply at this time.';
    } catch (error) {
      console.error('Error generating email reply:', error);
      return 'Unable to generate reply at this time.';
    }
  }

  async filterEmailsByCustomCriteria(emails: Email[], criteria: string): Promise<Email[]> {
    try {
      // Analyze each email against the criteria
      const analysisPromises = emails.map(async (email) => {
        const response = await this.getClient().chat.completions.create({
          model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
          messages: [
            {
              role: 'system',
              content: `You are an email filtering assistant. Analyze if the email matches the given criteria. Respond with only "YES" or "NO".`
            },
            {
              role: 'user',
              content: `Criteria: ${criteria}

Email to analyze:
Subject: ${email.subject}
From: ${email.sender.name}
Content: ${email.content}

Does this email match the criteria? Answer YES or NO only.`
            }
          ],
          max_tokens: 5,
          temperature: 0.1
        });

        const matches = response.choices[0].message.content?.toLowerCase().includes('yes') || false;
        return { email, matches, score: matches ? 1 : 0 };
      });

      const results = await Promise.all(analysisPromises);
      
      // Sort emails: matching emails first, then by timestamp
      const sortedResults = results.sort((a, b) => {
        if (a.matches && !b.matches) return -1;
        if (!a.matches && b.matches) return 1;
        return new Date(b.email.timestamp).getTime() - new Date(a.email.timestamp).getTime();
      });

      return sortedResults.map(result => result.email);
    } catch (error) {
      console.error('Error filtering emails by custom criteria:', error);
      // Fallback to original order if AI fails
      return emails;
    }
  }

  async categorizeEmail(email: Email): Promise<string> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
        messages: [
          {
            role: 'system',
            content: 'Categorize this email into one of these categories: Work, Personal, Marketing, Security, Meeting, Project, Support, Finance, Travel, Other. Return only the category name.'
          },
          {
            role: 'user',
            content: `Subject: ${email.subject}\nContent: ${email.content}`
          }
        ],
        max_tokens: 20,
        temperature: 0.3
      });

      return response.choices[0].message.content?.trim() || 'Other';
    } catch (error) {
      console.error('Error categorizing email:', error);
      return 'Other';
    }
  }
}

export default new AzureOpenAIService(); 