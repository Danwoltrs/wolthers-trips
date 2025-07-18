# Meeting Management Module Specification

## 🎯 Overview
The meeting management module handles meeting scheduling, contact assignment, confirmation workflows, and automated communication. It integrates closely with company contacts and provides multi-language communication capabilities.

## 📅 Meeting Types & Structure

### Meeting Categories
```typescript
enum MeetingType {
  FARM_VISIT = 'farm_visit',           // On-site farm visits
  OFFICE_MEETING = 'office_meeting',   // Office/headquarters meetings
  CUPPING_SESSION = 'cupping_session', // Coffee cupping/tasting
  FACILITY_TOUR = 'facility_tour',     // Processing facility tours
  NETWORKING = 'networking',           // Industry networking events
  CONVENTION_MEETING = 'convention_meeting', // Convention/trade show meetings
  LUNCH_DINNER = 'lunch_dinner',       // Business meals
  TRANSIT_MEETING = 'transit_meeting'  // Quick meetings during travel
}
```

### Meeting Status Flow
```typescript
enum MeetingStatus {
  SCHEDULED = 'scheduled',       // Initially created
  CONFIRMED = 'confirmed',       // Contact confirmed attendance
  PENDING = 'pending',          // Awaiting confirmation
  CANCELLED = 'cancelled',      // Meeting cancelled
  COMPLETED = 'completed',      // Meeting finished
  NO_SHOW = 'no_show'          // Contact didn't attend
}

enum ConfirmationStatus {
  PENDING = 'pending',          // No response yet
  CONFIRMED = 'confirmed',      // Confirmed by contact
  DECLINED = 'declined',        // Declined by contact
  RESCHEDULED = 'rescheduled',  // Request to reschedule
  AUTO_CONFIRMED = 'auto_confirmed' // System auto-confirmed
}
```

## 🗄️ Database Schema

### Meetings Table
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_type meeting_type_enum DEFAULT 'office_meeting',
  meeting_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location_id UUID REFERENCES company_locations(id),
  primary_contact_id UUID REFERENCES company_contacts(id),
  status meeting_status_enum DEFAULT 'scheduled',
  confirmation_status confirmation_status_enum DEFAULT 'pending',
  confirmation_method confirmation_method_enum DEFAULT 'email',
  notes TEXT,
  ai_summary TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Meeting Contacts (Many-to-Many)
```sql
CREATE TABLE meeting_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES company_contacts(id) ON DELETE CASCADE,
  role contact_meeting_role DEFAULT 'attendee',
  confirmation_status confirmation_status_enum DEFAULT 'pending',
  response_received_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contact Meeting Roles
```typescript
enum ContactMeetingRole {
  HOST = 'host',                    // Meeting host/organizer
  ATTENDEE = 'attendee',            // Regular attendee
  DECISION_MAKER = 'decision_maker', // Key decision maker
  TECHNICAL_EXPERT = 'technical_expert', // Subject matter expert
  TRANSLATOR = 'translator'         // Language support
}
```

## 🏗️ Component Architecture

### Meeting Management Pages
```
/trips/[id]/meetings/
├── page.tsx                    # Meeting list for trip
├── create/
│   └── page.tsx               # Create new meeting
├── [meetingId]/
│   ├── page.tsx               # Meeting details
│   ├── edit/
│   │   └── page.tsx           # Edit meeting
│   ├── confirm/
│   │   └── page.tsx           # Confirmation interface
│   └── contacts/
│       └── page.tsx           # Manage meeting contacts

/meetings/
├── page.tsx                   # All meetings dashboard
├── calendar/
│   └── page.tsx              # Calendar view
└── confirmations/
    └── page.tsx              # Confirmation tracking
```

### Component Structure
```typescript
MeetingManagement
├── MeetingList
│   ├── MeetingCards
│   ├── MeetingCalendar
│   ├── MeetingFilters
│   └── TimelineView
├── MeetingForm
│   ├── BasicDetails
│   ├── LocationSelector
│   ├── ContactAssignment
│   ├── TimeScheduling
│   └── ConfirmationSettings
├── MeetingDetails
│   ├── MeetingHeader
│   ├── ContactList
│   ├── LocationInfo
│   ├── ConfirmationStatus
│   └── ActionButtons
├── ConfirmationSystem
│   ├── AutoConfirmation
│   ├── EmailTemplates
│   ├── WhatsAppIntegration
│   └── ResponseTracking
└── MeetingCalendar
    ├── CalendarView
    ├── DayView
    ├── WeekView
    └── ConflictDetection
```

## 📝 Meeting Creation & Editing

### Meeting Form Schema
```typescript
const meetingFormSchema = z.object({
  // Basic Information
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  meeting_type: z.enum(['farm_visit', 'office_meeting', 'cupping_session', 'facility_tour', 'networking', 'convention_meeting', 'lunch_dinner', 'transit_meeting']),
  
  // Timing
  meeting_date: z.date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  
  // Location & Contacts
  location_id: z.string().uuid('Location is required'),
  primary_contact_id: z.string().uuid('Primary contact is required'),
  additional_contacts: z.array(z.object({
    contact_id: z.string().uuid(),
    role: z.enum(['host', 'attendee', 'decision_maker', 'technical_expert', 'translator'])
  })).optional(),
  
  // Confirmation Settings
  confirmation_method: z.enum(['email', 'whatsapp', 'phone', 'auto_confirmed']),
  auto_confirm: z.boolean().default(false),
  send_reminders: z.boolean().default(true),
  
  // Additional Details
  notes: z.string().optional(),
  follow_up_required: z.boolean().default(false),
  follow_up_date: z.date().optional()
}).refine(data => {
  if (data.end_time && data.start_time >= data.end_time) {
    return false;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["end_time"]
});

type MeetingFormData = z.infer<typeof meetingFormSchema>;
```

### Smart Meeting Creation
```typescript
interface SmartMeetingFeatures {
  // Location-based suggestions
  location_suggestions: {
    nearby_companies: Company[];
    previous_locations: CompanyLocation[];
    optimal_sequence: LocationSequence;
    travel_time_consideration: boolean;
  };
  
  // Contact auto-assignment
  contact_suggestions: {
    primary_contacts: CompanyContact[];
    role_based_suggestions: ContactRoleSuggestion[];
    previous_meetings: PreviousMeetingContact[];
    availability_check: boolean;
  };
  
  // Time optimization
  time_suggestions: {
    optimal_times: TimeSlot[];
    conflict_detection: ConflictCheck;
    buffer_time: BufferTimeCalculation;
    timezone_awareness: TimezoneConversion;
  };
}
```

## 📧 Multi-Language Confirmation System

### Automated Communication Workflow
```typescript
interface ConfirmationWorkflow {
  // Initial confirmation request
  initial_request: {
    trigger: 'meeting_created' | 'manual_send';
    delay: number; // minutes after creation
    method: 'email' | 'whatsapp' | 'both';
    language: 'auto_detect' | 'en' | 'pt' | 'es' | 'fr';
  };
  
  // Follow-up strategy
  follow_up: {
    first_reminder: { delay: 24, unit: 'hours' };
    second_reminder: { delay: 48, unit: 'hours' };
    final_reminder: { delay: 1, unit: 'days_before_meeting' };
    escalation: { delay: 72, unit: 'hours', escalate_to: 'manual' };
  };
  
  // Response processing
  response_handling: {
    confirmation_keywords: string[];
    decline_keywords: string[];
    reschedule_keywords: string[];
    auto_processing: boolean;
    manual_review_threshold: number;
  };
}
```

### Multi-Language Templates
```typescript
interface ConfirmationTemplates {
  email_templates: {
    initial_confirmation: {
      en: EmailTemplate;
      pt: EmailTemplate;
      es: EmailTemplate;
      fr: EmailTemplate;
    };
    reminder: {
      en: EmailTemplate;
      pt: EmailTemplate;
      es: EmailTemplate;
      fr: EmailTemplate;
    };
    final_reminder: {
      en: EmailTemplate;
      pt: EmailTemplate;
      es: EmailTemplate;
      fr: EmailTemplate;
    };
  };
  
  whatsapp_templates: {
    initial_confirmation: WhatsAppTemplate;
    quick_reminder: WhatsAppTemplate;
    day_before_reminder: WhatsAppTemplate;
  };
}

// Portuguese example template
const ptConfirmationTemplate = {
  subject: 'Confirmação de Reunião - {{meeting_title}}',
  body: `
    Boa tarde {{contact_name}},
    
    Gostaria de confirmar nossa reunião agendada para:
    
    📅 Data: {{meeting_date}}
    🕒 Horário: {{start_time}}
    📍 Local: {{location_name}}
    📋 Assunto: {{meeting_title}}
    
    Poderia confirmar sua disponibilidade?
    
    Atenciosamente,
    {{sender_name}}
    Wolthers & Associates
  `
};
```

### Response Processing
```typescript
interface ResponseProcessor {
  // Natural language processing
  nlp_analysis: {
    language_detection: LanguageDetection;
    intent_classification: IntentClassification;
    entity_extraction: EntityExtraction;
    sentiment_analysis: SentimentAnalysis;
  };
  
  // Response categorization
  response_types: {
    confirmed: {
      keywords: ['sim', 'yes', 'confirmado', 'ok', 'perfeito', 'pode ser'];
      confidence_threshold: 0.8;
      auto_action: 'mark_confirmed';
    };
    declined: {
      keywords: ['não', 'no', 'impossível', 'ocupado', 'busy', 'cannot'];
      confidence_threshold: 0.8;
      auto_action: 'mark_declined';
    };
    reschedule: {
      keywords: ['outro dia', 'another day', 'reagendar', 'reschedule', 'mudar'];
      confidence_threshold: 0.7;
      auto_action: 'request_reschedule';
    };
  };
  
  // Manual review queue
  manual_review: {
    low_confidence_responses: LowConfidenceResponse[];
    complex_requests: ComplexRequest[];
    escalation_queue: EscalationQueue[];
  };
}
```

## 📅 Calendar Integration & Scheduling

### Calendar Views
```typescript
interface CalendarInterface {
  // Multiple view types
  views: {
    month: MonthCalendarView;
    week: WeekCalendarView;
    day: DayCalendarView;
    timeline: TimelineView;
    agenda: AgendaListView;
  };
  
  // Interactive features
  interactions: {
    drag_drop: boolean;
    resize_meetings: boolean;
    quick_create: boolean;
    bulk_operations: boolean;
  };
  
  // Smart features
  smart_features: {
    conflict_highlighting: boolean;
    travel_time_visualization: boolean;
    optimal_scheduling: boolean;
    buffer_time_display: boolean;
  };
}
```

### Conflict Detection
```typescript
interface ConflictDetection {
  // Time conflicts
  time_conflicts: {
    overlapping_meetings: OverlappingMeeting[];
    back_to_back_meetings: BackToBackMeeting[];
    insufficient_travel_time: InsufficientTravelTime[];
  };
  
  // Resource conflicts
  resource_conflicts: {
    double_booked_contacts: DoubleBookedContact[];
    unavailable_locations: UnavailableLocation[];
    vehicle_conflicts: VehicleConflict[];
  };
  
  // Business rule conflicts
  business_conflicts: {
    outside_business_hours: OutsideBusinessHours[];
    cultural_considerations: CulturalConflict[];
    holiday_conflicts: HolidayConflict[];
  };
}
```

### Travel Time Calculation
```typescript
interface TravelTimeCalculation {
  // Google Maps integration
  maps_api: {
    distance_matrix: DistanceMatrixAPI;
    real_time_traffic: boolean;
    alternative_routes: boolean;
    mode: 'driving' | 'walking' | 'transit';
  };
  
  // Smart scheduling
  scheduling_logic: {
    buffer_time: number; // minutes
    traffic_padding: number; // percentage
    parking_time: number; // minutes
    security_time: number; // minutes for facility access
  };
  
  // Optimization
  route_optimization: {
    optimal_sequence: OptimalSequence;
    minimize_travel: boolean;
    consider_lunch_breaks: boolean;
    respect_preferences: boolean;
  };
}
```

## 🤖 AI-Powered Features

### Meeting Intelligence
```typescript
interface MeetingIntelligence {
  // Content analysis
  content_analysis: {
    meeting_notes_summarization: NoteSummarization;
    key_topics_extraction: TopicExtraction;
    action_items_identification: ActionItemExtraction;
    sentiment_analysis: SentimentAnalysis;
  };
  
  // Predictive features
  predictive_features: {
    success_probability: SuccessPrediction;
    optimal_duration: DurationPrediction;
    follow_up_recommendations: FollowUpSuggestions;
    relationship_scoring: RelationshipScoring;
  };
  
  // Automation
  automation_features: {
    smart_scheduling: SmartScheduling;
    auto_note_generation: AutoNoteGeneration;
    follow_up_reminders: AutoFollowUp;
    meeting_templates: MeetingTemplates;
  };
}
```

### Meeting Outcome Tracking
```typescript
interface MeetingOutcomes {
  // Success metrics
  success_metrics: {
    attendance_rate: number;
    objectives_met: number;
    relationship_improvement: number;
    business_value: number;
  };
  
  // Follow-up tracking
  follow_up_tracking: {
    action_items: ActionItem[];
    commitments: Commitment[];
    next_meeting_scheduled: boolean;
    relationship_status: RelationshipStatus;
  };
  
  // Learning
  learning_insights: {
    best_meeting_times: TimeInsight[];
    successful_patterns: PatternInsight[];
    improvement_suggestions: ImprovementSuggestion[];
  };
}
```

## 📊 Meeting Analytics & Reporting

### Meeting Metrics
```typescript
interface MeetingMetrics {
  // Basic statistics
  basic_stats: {
    total_meetings: number;
    confirmed_meetings: number;
    completion_rate: number;
    average_duration: number;
  };
  
  // Confirmation analytics
  confirmation_analytics: {
    response_rate: number;
    average_response_time: number;
    confirmation_method_effectiveness: Record<string, number>;
    language_effectiveness: Record<string, number>;
  };
  
  // Business impact
  business_impact: {
    relationships_strengthened: number;
    business_opportunities: number;
    cost_per_meeting: number;
    roi_estimation: number;
  };
}
```

### Meeting Reports
```typescript
interface MeetingReport {
  type: 'trip_meetings' | 'confirmation_summary' | 'meeting_outcomes' | 'analytics_dashboard';
  filters: {
    date_range: DateRange;
    trip_ids: string[];
    company_ids: string[];
    contact_ids: string[];
    meeting_types: MeetingType[];
    confirmation_status: ConfirmationStatus[];
  };
  format: 'pdf' | 'csv' | 'excel' | 'json';
}
```

## 🎯 Implementation Steps

### Phase 1: Basic Meeting Management (Week 6)
1. Create meeting CRUD operations
2. Implement location and contact assignment
3. Build meeting calendar view
4. Add basic confirmation system
5. Create meeting list and filters

### Phase 2: Confirmation Automation (Week 7)
1. Implement multi-language email templates
2. Add WhatsApp integration
3. Build response processing system
4. Create confirmation tracking dashboard
5. Add reminder automation

### Phase 3: Advanced Features (Week 8)
1. Implement AI-powered scheduling
2. Add conflict detection system
3. Build travel time optimization
4. Create meeting analytics
5. Add outcome tracking

## 🔧 API Endpoints

### Meeting CRUD Operations
```typescript
// GET /api/trips/[tripId]/meetings - List meetings for trip
// POST /api/trips/[tripId]/meetings - Create new meeting
// GET /api/meetings/[id] - Get meeting details
// PUT /api/meetings/[id] - Update meeting
// DELETE /api/meetings/[id] - Delete meeting

// POST /api/meetings/[id]/contacts - Add contact to meeting
// DELETE /api/meetings/[id]/contacts/[contactId] - Remove contact
// PUT /api/meetings/[id]/contacts/[contactId] - Update contact role

// POST /api/meetings/[id]/confirm - Send confirmation request
// POST /api/meetings/[id]/response - Process confirmation response
// GET /api/meetings/conflicts - Check for scheduling conflicts
```

### Confirmation System APIs
```typescript
// POST /api/confirmations/send - Send confirmation requests
// GET /api/confirmations/status - Get confirmation status
// POST /api/confirmations/bulk - Bulk confirmation operations
// GET /api/confirmations/analytics - Confirmation analytics

// Webhook endpoints for WhatsApp responses
// POST /api/webhooks/whatsapp - WhatsApp response webhook
// POST /api/webhooks/email - Email response webhook
```

---
*Next Phase: Expense Management Module*  
*Dependencies: Authentication (✅), Trips (🎯), Companies (🎯), Database (✅)*