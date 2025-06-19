export {};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('Supabase environment variables not found. Some features may be limited.');
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          outlook_access_token?: string;
          outlook_refresh_token?: string;
          outlook_token_expires_at?: string;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          outlook_access_token?: string;
          outlook_refresh_token?: string;
          outlook_token_expires_at?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          outlook_access_token?: string;
          outlook_refresh_token?: string;
          outlook_token_expires_at?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      emails: {
        Row: {
          id: string;
          user_id: string;
          thread_id?: string;
          outlook_message_id: string;
          sender_name: string;
          sender_email: string;
          sender_avatar?: string;
          subject: string;
          content: string;
          preview: string;
          received_at: string;
          is_read: boolean;
          is_important: boolean;
          urgency: 'low' | 'medium' | 'high';
          has_attachments: boolean;
          attachments: any;
          outlook_data: any;
          ai_processed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          thread_id?: string;
          outlook_message_id: string;
          sender_name: string;
          sender_email: string;
          sender_avatar?: string;
          subject: string;
          content: string;
          preview: string;
          received_at: string;
          is_read?: boolean;
          is_important?: boolean;
          urgency?: 'low' | 'medium' | 'high';
          has_attachments?: boolean;
          attachments?: any;
          outlook_data?: any;
          ai_processed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          thread_id?: string;
          outlook_message_id?: string;
          sender_name?: string;
          sender_email?: string;
          sender_avatar?: string;
          subject?: string;
          content?: string;
          preview?: string;
          received_at?: string;
          is_read?: boolean;
          is_important?: boolean;
          urgency?: 'low' | 'medium' | 'high';
          has_attachments?: boolean;
          attachments?: any;
          outlook_data?: any;
          ai_processed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_summaries: {
        Row: {
          id: string;
          email_id: string;
          summary: string;
          key_points: any;
          action_items: any;
          sentiment: string;
          confidence_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email_id: string;
          summary: string;
          key_points?: any;
          action_items?: any;
          sentiment?: string;
          confidence_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email_id?: string;
          summary?: string;
          key_points?: any;
          action_items?: any;
          sentiment?: string;
          confidence_score?: number;
          created_at?: string;
        };
      };
      auto_replies: {
        Row: {
          id: string;
          email_id: string;
          reply_content: string;
          tone: string;
          is_sent: boolean;
          sent_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email_id: string;
          reply_content: string;
          tone?: string;
          is_sent?: boolean;
          sent_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email_id?: string;
          reply_content?: string;
          tone?: string;
          is_sent?: boolean;
          sent_at?: string;
          created_at?: string;
        };
      };
      meeting_requests: {
        Row: {
          id: string;
          email_id: string;
          title: string;
          proposed_date?: string;
          proposed_time?: string;
          duration_minutes: number;
          location?: string;
          attendees: any;
          status: 'pending' | 'accepted' | 'declined' | 'tentative';
          outlook_event_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email_id: string;
          title: string;
          proposed_date?: string;
          proposed_time?: string;
          duration_minutes?: number;
          location?: string;
          attendees?: any;
          status?: 'pending' | 'accepted' | 'declined' | 'tentative';
          outlook_event_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email_id?: string;
          title?: string;
          proposed_date?: string;
          proposed_time?: string;
          duration_minutes?: number;
          location?: string;
          attendees?: any;
          status?: 'pending' | 'accepted' | 'declined' | 'tentative';
          outlook_event_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      day_plan_items: {
        Row: {
          id: string;
          user_id: string;
          email_id?: string;
          meeting_request_id?: string;
          title: string;
          description?: string;
          scheduled_date: string;
          scheduled_time?: string;
          item_type: 'email' | 'meeting' | 'task' | 'reminder';
          priority: 'low' | 'medium' | 'high';
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          ai_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_id?: string;
          meeting_request_id?: string;
          title: string;
          description?: string;
          scheduled_date: string;
          scheduled_time?: string;
          item_type?: 'email' | 'meeting' | 'task' | 'reminder';
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_id?: string;
          meeting_request_id?: string;
          title?: string;
          description?: string;
          scheduled_date?: string;
          scheduled_time?: string;
          item_type?: 'email' | 'meeting' | 'task' | 'reminder';
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}