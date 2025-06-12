import { Email } from '../types/email';

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: {
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    subject: 'Q4 Strategy Meeting - Action Required',
    preview: 'Hi team, we need to schedule our Q4 strategy session. Can we meet next Friday at 2PM?',
    content: `Hi team,

I hope this email finds you well. We need to schedule our Q4 strategy session to discuss our upcoming initiatives and budget allocation.

Can we meet next Friday at 2PM in the conference room? I'll send out the agenda tomorrow.

Please confirm your availability by end of day.

Best regards,
Sarah`,
    timestamp: '2024-01-15T09:30:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'high',
    labels: ['Action Needed', 'Meeting Request'],
    meetingRequest: {
      title: 'Q4 Strategy Meeting',
      date: '2024-01-19',
      time: '14:00',
      location: 'Conference Room A',
      attendees: ['sarah.chen@company.com', 'you@company.com']
    }
  },
  {
    id: '2',
    sender: {
      name: 'Microsoft Teams',
      email: 'noreply@teams.microsoft.com'
    },
    subject: 'Weekly Standup Meeting Reminder',
    preview: 'Your weekly team standup is scheduled for tomorrow at 10:00 AM',
    content: `Hello,

This is a reminder that your Weekly Standup Meeting is scheduled for:

Date: Tomorrow, January 16th
Time: 10:00 AM - 10:30 AM
Location: Microsoft Teams

Meeting ID: 123-456-789

Best regards,
Microsoft Teams`,
    timestamp: '2024-01-15T08:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'medium',
    labels: ['FYI', 'Calendar']
  },
  {
    id: '3',
    sender: {
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@company.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    subject: 'Project Alpha - Final Review Complete',
    preview: 'Great news! I\'ve completed the final review of Project Alpha. Everything looks good to go.',
    content: `Hi there,

Great news! I've completed the final review of Project Alpha and everything looks good to go.

Key findings:
- All security requirements have been met
- Performance benchmarks exceeded by 15%
- Documentation is comprehensive

We're ready for launch next week. Let me know if you need anything else.

Cheers,
Alex`,
    timestamp: '2024-01-15T07:45:00Z',
    isRead: false,
    isImportant: false,
    urgency: 'medium',
    labels: ['Project Update', 'Good News']
  },
  {
    id: '4',
    sender: {
      name: 'Lisa Park',
      email: 'lisa.park@vendor.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    subject: 'Urgent: Contract Amendment Required',
    preview: 'We need to make some urgent amendments to the contract we discussed. Can we hop on a call today?',
    content: `Hi,

I hope you're doing well. We need to make some urgent amendments to the contract we discussed last week.

There are some changes in our compliance requirements that affect the terms. Can we hop on a call today to discuss? I'm available between 1-4 PM.

Please let me know what works for you.

Thanks,
Lisa Park
Senior Account Manager`,
    timestamp: '2024-01-15T06:30:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'high',
    labels: ['Action Needed', 'Urgent']
  },
  {
    id: '5',
    sender: {
      name: 'HR Department',
      email: 'hr@company.com'
    },
    subject: 'Benefits Enrollment Deadline Reminder',
    preview: 'Reminder: The deadline for benefits enrollment is this Friday, January 19th.',
    content: `Dear Team,

This is a friendly reminder that the deadline for benefits enrollment is this Friday, January 19th at 11:59 PM.

If you haven't completed your enrollment yet, please log into the HR portal and make your selections.

For assistance, please contact the HR helpdesk.

Best regards,
HR Department`,
    timestamp: '2024-01-14T16:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'medium',
    labels: ['FYI', 'Deadline']
  },
  {
    id: '6',
    sender: {
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    subject: 'Coffee catch-up this week?',
    preview: 'Hey! It\'s been a while since we caught up. Are you free for coffee sometime this week?',
    content: `Hey!

It's been a while since we caught up. Are you free for coffee sometime this week?

I'd love to hear about how your new project is going and share some updates on my end too.

Let me know what works for you!

Best,
David`,
    timestamp: '2024-01-14T11:20:00Z',
    isRead: false,
    isImportant: false,
    urgency: 'low',
    labels: ['Social', 'Meeting Request']
  }
];