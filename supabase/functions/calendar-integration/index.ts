/*
  # Calendar Integration Function
  
  Handles meeting scheduling and calendar operations with Outlook Calendar
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CalendarEvent {
  id?: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
  }>;
  body?: {
    content: string;
    contentType: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, eventData, userId, accessToken } = await req.json();

    let result;

    switch (action) {
      case 'create_event':
        result = await createCalendarEvent(eventData, accessToken);
        break;
      case 'get_availability':
        result = await getAvailability(eventData, accessToken);
        break;
      case 'suggest_times':
        result = await suggestMeetingTimes(eventData, accessToken);
        break;
      case 'update_event':
        result = await updateCalendarEvent(eventData, accessToken);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        action,
        result,
        processed_at: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Calendar integration error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

async function createCalendarEvent(eventData: any, accessToken: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock event creation
  const mockEvent: CalendarEvent = {
    id: `event_${Date.now()}`,
    subject: eventData.title || 'Meeting',
    start: {
      dateTime: eventData.startDateTime || new Date().toISOString(),
      timeZone: 'UTC'
    },
    end: {
      dateTime: eventData.endDateTime || new Date(Date.now() + 3600000).toISOString(),
      timeZone: 'UTC'
    },
    location: eventData.location ? {
      displayName: eventData.location
    } : undefined,
    attendees: eventData.attendees?.map((email: string) => ({
      emailAddress: {
        address: email,
        name: email.split('@')[0]
      }
    })) || [],
    body: {
      content: eventData.description || 'Meeting scheduled via SmartInbox',
      contentType: 'text'
    }
  };

  return {
    event: mockEvent,
    eventId: mockEvent.id,
    webLink: `https://outlook.office.com/calendar/item/${mockEvent.id}`,
    message: 'Event created successfully'
  };
}

async function getAvailability(eventData: any, accessToken: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const { startDate, endDate, attendees } = eventData;
  
  // Mock availability data
  const mockAvailability = {
    freeTime: [
      {
        start: '2024-01-16T09:00:00Z',
        end: '2024-01-16T10:00:00Z'
      },
      {
        start: '2024-01-16T14:00:00Z',
        end: '2024-01-16T15:00:00Z'
      },
      {
        start: '2024-01-16T16:00:00Z',
        end: '2024-01-16T17:00:00Z'
      }
    ],
    busyTime: [
      {
        start: '2024-01-16T10:00:00Z',
        end: '2024-01-16T11:00:00Z',
        subject: 'Weekly Standup'
      },
      {
        start: '2024-01-16T13:00:00Z',
        end: '2024-01-16T14:00:00Z',
        subject: 'Lunch Break'
      }
    ],
    workingHours: {
      start: '09:00',
      end: '17:00',
      timeZone: 'UTC'
    }
  };

  return mockAvailability;
}

async function suggestMeetingTimes(eventData: any, accessToken: string) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { duration = 60, preferredTimes, attendees } = eventData;
  
  // Mock suggested times based on availability
  const suggestedTimes = [
    {
      start: '2024-01-16T09:00:00Z',
      end: '2024-01-16T10:00:00Z',
      confidence: 0.9,
      reason: 'All attendees available, optimal time slot'
    },
    {
      start: '2024-01-16T14:00:00Z',
      end: '2024-01-16T15:00:00Z',
      confidence: 0.8,
      reason: 'Good availability, post-lunch slot'
    },
    {
      start: '2024-01-17T10:00:00Z',
      end: '2024-01-17T11:00:00Z',
      confidence: 0.7,
      reason: 'Alternative day option'
    }
  ];

  return {
    suggestions: suggestedTimes,
    analysisNote: 'Based on calendar availability and meeting preferences',
    alternativeOptions: [
      'Consider shorter 30-minute meeting',
      'Virtual meeting option available',
      'Can accommodate up to 8 attendees'
    ]
  };
}

async function updateCalendarEvent(eventData: any, accessToken: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { eventId, updates } = eventData;
  
  // Mock event update
  const updatedEvent = {
    id: eventId,
    ...updates,
    lastModified: new Date().toISOString()
  };

  return {
    event: updatedEvent,
    message: 'Event updated successfully',
    changesApplied: Object.keys(updates)
  };
}