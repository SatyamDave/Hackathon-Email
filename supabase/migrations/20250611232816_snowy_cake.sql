/*
  # SmartInbox Database Schema

  1. New Tables
    - `users` - User profiles and preferences
    - `emails` - Email messages with AI analysis
    - `email_threads` - Email conversation threads
    - `ai_summaries` - AI-generated email summaries
    - `auto_replies` - AI-generated reply drafts
    - `meeting_requests` - Extracted meeting information
    - `user_preferences` - User settings and AI preferences
    - `email_labels` - Custom and AI-generated labels
    - `day_plan_items` - Smart day planner items

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  outlook_access_token text,
  outlook_refresh_token text,
  outlook_token_expires_at timestamptz,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email threads table
CREATE TABLE IF NOT EXISTS email_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  outlook_thread_id text UNIQUE NOT NULL,
  subject text NOT NULL,
  participants jsonb DEFAULT '[]',
  last_message_at timestamptz NOT NULL,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Emails table
CREATE TABLE IF NOT EXISTS emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  thread_id uuid REFERENCES email_threads(id) ON DELETE CASCADE,
  outlook_message_id text UNIQUE NOT NULL,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_avatar text,
  subject text NOT NULL,
  content text NOT NULL,
  preview text NOT NULL,
  received_at timestamptz NOT NULL,
  is_read boolean DEFAULT false,
  is_important boolean DEFAULT false,
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  has_attachments boolean DEFAULT false,
  attachments jsonb DEFAULT '[]',
  outlook_data jsonb DEFAULT '{}',
  ai_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI summaries table
CREATE TABLE IF NOT EXISTS ai_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE,
  summary text NOT NULL,
  key_points jsonb DEFAULT '[]',
  action_items jsonb DEFAULT '[]',
  sentiment text DEFAULT 'neutral',
  confidence_score decimal(3,2) DEFAULT 0.8,
  created_at timestamptz DEFAULT now()
);

-- Auto replies table
CREATE TABLE IF NOT EXISTS auto_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE,
  reply_content text NOT NULL,
  tone text DEFAULT 'professional',
  is_sent boolean DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Meeting requests table
CREATE TABLE IF NOT EXISTS meeting_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE,
  title text NOT NULL,
  proposed_date date,
  proposed_time time,
  duration_minutes integer DEFAULT 60,
  location text,
  attendees jsonb DEFAULT '[]',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'tentative')),
  outlook_event_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email labels table
CREATE TABLE IF NOT EXISTS email_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE,
  label text NOT NULL,
  label_type text DEFAULT 'ai' CHECK (label_type IN ('ai', 'user', 'system')),
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  preference_key text NOT NULL,
  preference_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, preference_key)
);

-- Day plan items table
CREATE TABLE IF NOT EXISTS day_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE,
  meeting_request_id uuid REFERENCES meeting_requests(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_date date NOT NULL,
  scheduled_time time,
  item_type text DEFAULT 'task' CHECK (item_type IN ('email', 'meeting', 'task', 'reminder')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plan_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for email_threads
CREATE POLICY "Users can read own email threads"
  ON email_threads
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for emails
CREATE POLICY "Users can read own emails"
  ON emails
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for ai_summaries
CREATE POLICY "Users can read own AI summaries"
  ON ai_summaries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM emails 
      WHERE emails.id = ai_summaries.email_id 
      AND emails.user_id = auth.uid()
    )
  );

-- RLS Policies for auto_replies
CREATE POLICY "Users can read own auto replies"
  ON auto_replies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM emails 
      WHERE emails.id = auto_replies.email_id 
      AND emails.user_id = auth.uid()
    )
  );

-- RLS Policies for meeting_requests
CREATE POLICY "Users can read own meeting requests"
  ON meeting_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM emails 
      WHERE emails.id = meeting_requests.email_id 
      AND emails.user_id = auth.uid()
    )
  );

-- RLS Policies for email_labels
CREATE POLICY "Users can read own email labels"
  ON email_labels
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM emails 
      WHERE emails.id = email_labels.email_id 
      AND emails.user_id = auth.uid()
    )
  );

-- RLS Policies for user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for day_plan_items
CREATE POLICY "Users can read own day plan items"
  ON day_plan_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_is_read ON emails(is_read);
CREATE INDEX IF NOT EXISTS idx_emails_urgency ON emails(urgency);
CREATE INDEX IF NOT EXISTS idx_email_threads_user_id ON email_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_day_plan_items_user_date ON day_plan_items(user_id, scheduled_date);