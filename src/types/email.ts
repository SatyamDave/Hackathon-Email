export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  urgency: 'low' | 'medium' | 'high';
  labels: string[];
  attachments?: Attachment[];
  meetingRequest?: MeetingRequest;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
}

export interface MeetingRequest {
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees: string[];
}

export type ViewMode = 'default' | 'priority' | 'custom';

export interface DayPlanItem {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'email';
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}