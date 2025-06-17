-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    outlook_message_id TEXT NOT NULL UNIQUE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    preview TEXT,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_read BOOLEAN DEFAULT false,
    urgency TEXT DEFAULT 'normal',
    has_attachments BOOLEAN DEFAULT false,
    ai_processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_summaries table
CREATE TABLE IF NOT EXISTS ai_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_points TEXT[],
    action_items TEXT[],
    sentiment TEXT,
    confidence_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auto_replies table
CREATE TABLE IF NOT EXISTS auto_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    reply_content TEXT NOT NULL,
    tone TEXT,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_requests table
CREATE TABLE IF NOT EXISTS meeting_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    proposed_date DATE,
    proposed_time TIME,
    location TEXT,
    attendees TEXT[],
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_outlook_message_id ON emails(outlook_message_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_email_id ON ai_summaries(email_id);
CREATE INDEX IF NOT EXISTS idx_auto_replies_email_id ON auto_replies(email_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_email_id ON meeting_requests(email_id);

-- Enable Row Level Security (RLS)
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own emails"
    ON emails FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own emails"
    ON emails FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own emails"
    ON emails FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view their own AI summaries"
    ON ai_summaries FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM emails
        WHERE emails.id = ai_summaries.email_id
        AND emails.user_id = auth.uid()::text
    ));

CREATE POLICY "Users can view their own auto replies"
    ON auto_replies FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM emails
        WHERE emails.id = auto_replies.email_id
        AND emails.user_id = auth.uid()::text
    ));

CREATE POLICY "Users can view their own meeting requests"
    ON meeting_requests FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM emails
        WHERE emails.id = meeting_requests.email_id
        AND emails.user_id = auth.uid()::text
    )); 