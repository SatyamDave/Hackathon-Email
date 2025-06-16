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
    timestamp: '2024-03-15T09:30:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'high',
    labels: ['Action Needed', 'Meeting Request'],
    meetingRequest: {
      title: 'Q4 Strategy Meeting',
      date: '2024-03-19',
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

Date: Tomorrow, March 16th
Time: 10:00 AM - 10:30 AM
Location: Microsoft Teams

Meeting ID: 123-456-789

Best regards,
Microsoft Teams`,
    timestamp: '2024-03-15T08:00:00Z',
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
    timestamp: '2024-03-15T07:45:00Z',
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
    timestamp: '2024-03-15T06:30:00Z',
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
    preview: 'Reminder: The deadline for benefits enrollment is this Friday, March 19th.',
    content: `Dear Team,

This is a friendly reminder that the deadline for benefits enrollment is this Friday, March 19th at 11:59 PM.

If you haven't completed your enrollment yet, please log into the HR portal and make your selections.

For assistance, please contact the HR helpdesk.

Best regards,
HR Department`,
    timestamp: '2024-03-14T16:00:00Z',
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
    timestamp: '2024-03-14T11:20:00Z',
    isRead: false,
    isImportant: false,
    urgency: 'low',
    labels: ['Social', 'Meeting Request']
  },
  {
    id: '7',
    sender: {
      name: 'Security Team',
      email: 'security@company.com'
    },
    subject: '⚠️ Security Alert: Unusual Login Attempt',
    preview: 'We detected an unusual login attempt to your account from a new location.',
    content: `Dear User,

We detected an unusual login attempt to your account from a new location.

Location: New York, USA
Time: March 14, 2024, 10:15 AM UTC
Device: Unknown Device

If this was you, no action is required. If not, please secure your account immediately.

Best regards,
Security Team`,
    timestamp: '2024-03-14T10:15:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'high',
    labels: ['Security', 'Urgent']
  },
  {
    id: '8',
    sender: {
      name: 'Marketing Team',
      email: 'marketing@company.com'
    },
    subject: 'New Brand Guidelines Available',
    preview: 'We\'ve updated our brand guidelines. Please review the new document.',
    content: `Hi everyone,

We're excited to share our updated brand guidelines! The new document includes:
- Updated color palette
- New typography guidelines
- Social media templates
- Logo usage rules

Please review and let us know if you have any questions.

Best,
Marketing Team`,
    timestamp: '2024-03-14T09:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'low',
    labels: ['FYI', 'Documentation']
  },
  {
    id: '9',
    sender: {
      name: 'Tech Support',
      email: 'support@company.com'
    },
    subject: 'Your Support Ticket #12345 has been resolved',
    preview: 'We\'ve resolved your recent support ticket regarding the VPN connection issue.',
    content: `Hello,

We're happy to inform you that we've resolved your support ticket #12345 regarding the VPN connection issue.

The issue was related to the latest Windows update. We've applied the necessary fixes, and you should now be able to connect without any problems.

Please let us know if you need any further assistance.

Best regards,
Tech Support Team`,
    timestamp: '2024-03-13T16:45:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'low',
    labels: ['Support', 'Resolved']
  },
  {
    id: '10',
    sender: {
      name: 'Project Manager',
      email: 'pm@company.com'
    },
    subject: 'Sprint Planning Meeting - Tomorrow',
    preview: 'Reminder: Sprint planning meeting is scheduled for tomorrow at 11 AM.',
    content: `Hi team,

Just a reminder that we have our sprint planning meeting tomorrow at 11 AM.

Agenda:
1. Review last sprint's achievements
2. Plan next sprint's goals
3. Assign tasks
4. Q&A session

Please come prepared with your updates and suggestions.

Best regards,
Project Manager`,
    timestamp: '2024-03-13T15:30:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'medium',
    labels: ['Meeting', 'Planning']
  },
  {
    id: '11',
    sender: {
      name: 'Finance Department',
      email: 'finance@company.com'
    },
    subject: 'Expense Report Approval Required',
    preview: 'Your expense report for February 2024 is pending approval.',
    content: `Dear Employee,

Your expense report for February 2024 is pending approval. Please review and submit any missing receipts by March 20th.

Total amount: $1,234.56
Status: Pending Approval

Please log into the finance portal to complete the process.

Best regards,
Finance Department`,
    timestamp: '2024-03-13T14:00:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'medium',
    labels: ['Finance', 'Action Needed']
  },
  {
    id: '12',
    sender: {
      name: 'Training Team',
      email: 'training@company.com'
    },
    subject: 'New Learning Platform Available',
    preview: 'We\'ve launched a new learning platform with courses on AI and Machine Learning.',
    content: `Hello everyone,

We're excited to announce the launch of our new learning platform! 

Available courses:
- Introduction to AI
- Machine Learning Fundamentals
- Data Science Basics
- Python Programming

Access the platform at: learning.company.com

Best regards,
Training Team`,
    timestamp: '2024-03-13T11:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'low',
    labels: ['Training', 'FYI']
  },
  {
    id: '13',
    sender: {
      name: 'Legal Department',
      email: 'legal@company.com'
    },
    subject: 'Important: New Compliance Training Required',
    preview: 'Mandatory compliance training must be completed by March 31st.',
    content: `Dear Team,

This is a reminder that the annual compliance training must be completed by March 31st.

The training covers:
- Data Privacy
- Code of Conduct
- Security Protocols
- Regulatory Compliance

Please complete the training at your earliest convenience.

Best regards,
Legal Department`,
    timestamp: '2024-03-12T16:00:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'high',
    labels: ['Compliance', 'Training']
  },
  {
    id: '14',
    sender: {
      name: 'Facilities Management',
      email: 'facilities@company.com'
    },
    subject: 'Office Maintenance Notice',
    preview: 'Scheduled maintenance in Building A this weekend.',
    content: `Hello,

We will be conducting scheduled maintenance in Building A this weekend.

Affected areas:
- Main lobby
- 3rd floor
- Parking garage

The maintenance will take place from March 16th to March 17th.

Best regards,
Facilities Team`,
    timestamp: '2024-03-12T14:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'low',
    labels: ['Facilities', 'Notice']
  },
  {
    id: '15',
    sender: {
      name: 'Product Team',
      email: 'product@company.com'
    },
    subject: 'New Feature Release - Beta Testing',
    preview: 'We\'re looking for beta testers for our new feature release.',
    content: `Hi team,

We're excited to announce that we're looking for beta testers for our new feature release!

Features to test:
- Enhanced search functionality
- New dashboard layout
- Improved reporting tools

If you're interested, please sign up by March 20th.

Best regards,
Product Team`,
    timestamp: '2024-03-12T11:00:00Z',
    isRead: false,
    isImportant: false,
    urgency: 'medium',
    labels: ['Product', 'Beta Testing']
  },
  {
    id: '16',
    sender: {
      name: 'Wellness Program',
      email: 'wellness@company.com'
    },
    subject: 'March Wellness Challenge',
    preview: 'Join our March wellness challenge: 10,000 steps daily!',
    content: `Hello everyone,

Join our March wellness challenge: 10,000 steps daily!

Prizes:
- 1st place: $100 gift card
- 2nd place: $50 gift card
- 3rd place: $25 gift card

Sign up at: wellness.company.com

Best regards,
Wellness Team`,
    timestamp: '2024-03-11T16:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'low',
    labels: ['Wellness', 'Challenge']
  },
  {
    id: '17',
    sender: {
      name: 'IT Department',
      email: 'it@company.com'
    },
    subject: 'System Maintenance - March 15th',
    preview: 'Scheduled system maintenance will occur on March 15th from 10 PM to 2 AM.',
    content: `Dear Users,

We will be conducting scheduled system maintenance on March 15th.

Time: 10:00 PM - 2:00 AM
Affected systems:
- Email
- VPN
- Internal applications

Please plan accordingly.

Best regards,
IT Department`,
    timestamp: '2024-03-11T14:00:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'medium',
    labels: ['IT', 'Maintenance']
  },
  {
    id: '18',
    sender: {
      name: 'Research Team',
      email: 'research@company.com'
    },
    subject: 'Research Paper Publication',
    preview: 'Our team\'s research paper has been published in the Journal of Technology.',
    content: `Hi team,

Great news! Our research paper "AI in Modern Business" has been published in the Journal of Technology.

You can access it at: journal.technology.com/paper123

Congratulations to everyone involved!

Best regards,
Research Team`,
    timestamp: '2024-03-11T11:00:00Z',
    isRead: true,
    isImportant: false,
    urgency: 'low',
    labels: ['Research', 'Publication']
  },
  {
    id: '19',
    sender: {
      name: 'Customer Success',
      email: 'success@company.com'
    },
    subject: 'Customer Feedback Summary',
    preview: 'Q1 customer feedback summary is now available.',
    content: `Hello team,

The Q1 customer feedback summary is now available.

Key points:
- 95% customer satisfaction
- Top feature requests
- Areas for improvement

Please review the full report at: reports.company.com/q1

Best regards,
Customer Success Team`,
    timestamp: '2024-03-10T16:00:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'medium',
    labels: ['Customer', 'Report']
  },
  {
    id: '20',
    sender: {
      name: 'Executive Team',
      email: 'executives@company.com'
    },
    subject: 'Company Town Hall - March 25th',
    preview: 'Join us for our quarterly town hall meeting on March 25th.',
    content: `Dear Team,

We invite you to our quarterly town hall meeting on March 25th.

Agenda:
- Q1 Results
- Q2 Strategy
- New Initiatives
- Q&A Session

Time: 2:00 PM - 4:00 PM
Location: Main Auditorium

Best regards,
Executive Team`,
    timestamp: '2024-03-10T14:00:00Z',
    isRead: false,
    isImportant: true,
    urgency: 'high',
    labels: ['Meeting', 'Town Hall']
  }
];