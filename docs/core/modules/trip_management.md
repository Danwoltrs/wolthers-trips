# Trip Management Module Specification

## 🎯 Overview
The trip management module is the core of the travel system, handling trip creation, participant management, status tracking, and basic scheduling. It provides the foundation for meetings, expenses, and advanced features like trip branching.

## ✈️ Trip Types & Categories

### Trip Types
```typescript
enum TripType {
  CONVENTION = 'convention',        // Coffee industry conventions (NCA, SCAA, etc.)
  INLAND_BRAZIL = 'inland_brazil',  // Brazil interior farm visits
  INTERNATIONAL = 'international',  // International travel
  DOMESTIC_US = 'domestic_us',      // US domestic travel
  CLIENT_VISIT = 'client_visit',    // Client relationship visits
  FARM_VISIT = 'farm_visit'         // Direct farm visits
}
```

### Trip Status Flow
```typescript
enum TripStatus {
  DRAFT = 'draft',                  // Initial creation
  PROPOSAL = 'proposal',            // Client admin proposals
  CONFIRMED = 'confirmed',          // Approved and scheduled
  IN_PROGRESS = 'in_progress',      // Currently happening
  COMPLETED = 'completed',          // Trip finished
  CANCELLED = 'cancelled'           // Trip cancelled
}

enum ProposalStatus {
  DRAFT_PROPOSAL = 'draft_proposal',
  SUBMITTED_FOR_APPROVAL = 'submitted_for_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision'
}
```

## 🗄️ Database Schema

### Trips Table
```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_trip_id UUID REFERENCES trips(id),
  branch_type branch_type_enum DEFAULT 'main',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type trip_type_enum NOT NULL,
  status trip_status_enum DEFAULT 'draft',
  proposal_status proposal_status_enum DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  proposal_notes TEXT,
  approval_notes TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Trip Participants Table
```sql
CREATE TABLE trip_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  role participant_role_enum NOT NULL,
  join_date DATE,
  leave_date DATE,
  branch_segment VARCHAR(50),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Participant Roles
```typescript
enum ParticipantRole {
  ORGANIZER = 'organizer',          // Trip organizer (Wolthers staff)
  TRAVELER = 'traveler',            // Actual traveler
  HOST = 'host',                    // Local host/contact
  OBSERVER = 'observer',            // Can view but not edit
  APPROVER = 'approver'             // Can approve trip decisions
}
```

## 🏗️ Component Architecture

### Trip Management Pages
```
/trips/
├── page.tsx                    # Trip list with filters
├── create/
│   └── page.tsx               # Create new trip wizard
├── proposals/
│   ├── page.tsx               # Trip proposals dashboard
│   └── [id]/
│       ├── page.tsx           # Proposal details
│       └── approve/
│           └── page.tsx       # Approval interface
├── [id]/
│   ├── page.tsx               # Trip overview
│   ├── edit/
│   │   └── page.tsx           # Edit trip details
│   ├── participants/
│   │   └── page.tsx           # Manage participants
│   ├── itinerary/
│   │   └── page.tsx           # Trip itinerary
│   ├── expenses/
│   │   └── page.tsx           # Trip expenses
│   ├── documents/
│   │   └── page.tsx           # Trip documents
│   └── branch/
│       └── page.tsx           # Trip branching (advanced)
```

### Component Structure
```typescript
TripManagement
├── TripList
│   ├── TripCards
│   ├── TripTable
│   ├── TripFilters
│   └── TripSearch
├── TripWizard
│   ├── BasicDetails
│   ├── TripType
│   ├── Participants
│   ├── Timeline
│   └── Summary
├── TripOverview
│   ├── TripHeader
│   ├── TripStats
│   ├── QuickActions
│   └── RecentActivity
├── ParticipantManagement
│   ├── ParticipantList
│   ├── AddParticipant
│   ├── ParticipantCard
│   └── RoleAssignment
└── ProposalSystem
    ├── ProposalForm
    ├── ProposalReview
    ├── ApprovalWorkflow
    └── ProposalStatus
```

## 📋 Trip List Interface

### Trip Cards Design
```typescript
interface TripCard {
  id: string;
  title: string;
  type: TripType;
  status: TripStatus;
  start_date: Date;
  end_date: Date;
  duration_days: number;
  participant_count: number;
  company_count: number;
  estimated_cost: number;
  location_summary: string;
  progress_percentage: number;
}

const tripCardLayout = {
  header: {
    title: 'text-lg font-semibold',
    type_badge: 'bg-primary text-primary-foreground',
    status_badge: 'status-dependent-color'
  },
  content: {
    dates: 'text-sm text-muted-foreground',
    participants: 'flex -space-x-2',
    location: 'text-sm text-muted-foreground',
    cost: 'text-lg font-bold'
  },
  footer: {
    progress_bar: 'w-full bg-muted',
    actions: 'flex justify-between'
  }
};
```

### Advanced Filtering
```typescript
interface TripFilters {
  // Basic filters
  status: TripStatus[];
  type: TripType[];
  date_range: {
    from?: Date;
    to?: Date;
  };
  
  // Participant filters
  participants: {
    companies: string[];
    users: string[];
    roles: ParticipantRole[];
  };
  
  // Cost filters
  cost_range: {
    min?: number;
    max?: number;
  };
  
  // Advanced filters
  created_by: string[];
  approval_status: ProposalStatus[];
  has_pending_expenses: boolean;
  requires_approval: boolean;
  
  // Search
  search: string; // Title, description, location
}
```

## 📝 Trip Creation Wizard

### Multi-Step Creation Flow
```typescript
interface TripWizardSteps {
  step1: {
    title: 'Trip Basics';
    fields: ['title', 'description', 'type'];
    validation: BasicTripValidation;
  };
  
  step2: {
    title: 'Timeline';
    fields: ['start_date', 'end_date'];
    validation: DateValidation;
    smart_features: ['conflict_detection', 'optimal_duration'];
  };
  
  step3: {
    title: 'Participants';
    component: ParticipantSelector;
    validation: ParticipantValidation;
    features: ['company_selection', 'user_assignment', 'role_definition'];
  };
  
  step4: {
    title: 'Initial Planning';
    fields: ['estimated_cost', 'key_objectives'];
    optional: true;
  };
  
  step5: {
    title: 'Review & Create';
    component: TripSummary;
    actions: ['save_draft', 'create_confirmed', 'submit_proposal'];
  };
}
```

### Trip Form Schema
```typescript
const tripFormSchema = z.object({
  // Basic Information
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  type: z.enum(['convention', 'inland_brazil', 'international', 'domestic_us', 'client_visit', 'farm_visit']),
  
  // Timeline
  start_date: z.date(),
  end_date: z.date(),
  
  // Cost Planning
  estimated_cost: z.number().positive().optional(),
  
  // Trip Settings
  settings: z.object({
    requires_flights: z.boolean().default(false),
    requires_accommodation: z.boolean().default(true),
    requires_vehicle: z.boolean().default(false),
    auto_expense_tracking: z.boolean().default(true),
    meeting_confirmations: z.boolean().default(true)
  }).optional(),
  
  // Participants (handled separately)
  participants: z.array(z.object({
    type: z.enum(['user', 'company']),
    id: z.string().uuid(),
    role: z.enum(['organizer', 'traveler', 'host', 'observer', 'approver']),
    join_date: z.date().optional(),
    leave_date: z.date().optional()
  })).min(1, 'At least one participant required')
}).refine(data => data.end_date >= data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"]
});

type TripFormData = z.infer<typeof tripFormSchema>;
```

## 👥 Participant Management

### Participant Selection Interface
```typescript
interface ParticipantSelector {
  // Company-based selection
  company_selector: {
    search: CompanySearch;
    recent_companies: Company[];
    suggested_companies: Company[];
    bulk_selection: boolean;
  };
  
  // User-based selection
  user_selector: {
    search: UserSearch;
    role_filter: UserRole[];
    company_filter: string[];
    availability_check: boolean;
  };
  
  // Role assignment
  role_assignment: {
    default_roles: ParticipantRoleDefaults;
    custom_permissions: CustomPermissions;
    hierarchy_validation: boolean;
  };
}
```

### Participant Permissions
```typescript
interface ParticipantPermissions {
  // View permissions
  can_view_trip: boolean;
  can_view_expenses: boolean;
  can_view_documents: boolean;
  can_view_participants: boolean;
  
  // Edit permissions
  can_edit_trip: boolean;
  can_add_meetings: boolean;
  can_edit_meetings: boolean;
  can_manage_participants: boolean;
  
  // Financial permissions
  can_submit_expenses: boolean;
  can_approve_expenses: boolean;
  can_view_costs: boolean;
  
  // Advanced permissions
  can_branch_trip: boolean;
  can_cancel_trip: boolean;
  can_export_data: boolean;
}
```

## 📊 Trip Analytics & Reporting

### Trip Metrics
```typescript
interface TripMetrics {
  // Basic stats
  duration_days: number;
  participant_count: number;
  company_count: number;
  meeting_count: number;
  
  // Cost metrics
  estimated_cost: number;
  actual_cost: number;
  cost_variance: number;
  cost_per_day: number;
  cost_per_participant: number;
  
  // Efficiency metrics
  meetings_per_day: number;
  companies_per_day: number;
  travel_efficiency: number;
  
  // Completion metrics
  completion_percentage: number;
  on_schedule: boolean;
  objectives_met: number;
}
```

### Trip Reports
```typescript
interface TripReport {
  type: 'trip_summary' | 'cost_analysis' | 'participant_report' | 'itinerary_export';
  trip_id: string;
  format: 'pdf' | 'csv' | 'excel' | 'json';
  
  sections: {
    overview: boolean;
    participants: boolean;
    itinerary: boolean;
    expenses: boolean;
    documents: boolean;
    analytics: boolean;
  };
  
  filters: {
    date_range?: DateRange;
    participants?: string[];
    expense_categories?: string[];
  };
}
```

## 🎯 Trip Proposal System

### Proposal Workflow
```typescript
interface ProposalWorkflow {
  // Client Admin creates proposal
  creation: {
    business_justification: string;
    expected_outcomes: string[];
    budget_estimate: number;
    priority_level: 'low' | 'medium' | 'high' | 'urgent';
    alternative_dates: Date[];
  };
  
  // Wolthers Staff review
  review: {
    reviewer: User;
    review_date: Date;
    recommendation: 'approve' | 'reject' | 'needs_revision';
    feedback: string;
    cost_analysis: CostAnalysis;
  };
  
  // Approval decision
  decision: {
    approved_by: User;
    decision_date: Date;
    final_decision: 'approved' | 'rejected';
    conditions: string[];
    approved_budget: number;
  };
}
```

### Brazil Trip Proposals (Special Case)
```typescript
interface BrazilTripProposal {
  // Specific to Brazil inland trips
  region: 'Sul de Minas' | 'Cerrado' | 'Mogiana' | 'Bahia' | 'Espírito Santo';
  harvest_season: boolean;
  farm_visits: FarmVisitRequest[];
  cupping_sessions: CuppingSessionRequest[];
  logistics_complexity: 'low' | 'medium' | 'high';
  
  // Enhanced justification for Brazil
  market_opportunity: string;
  relationship_building: string;
  quality_assessment: string;
  competitive_intelligence: string;
}
```

## 🔍 Smart Features

### Intelligent Trip Suggestions
```typescript
interface TripSuggestions {
  // Based on history
  similar_trips: Trip[];
  recurring_patterns: TripPattern[];
  seasonal_opportunities: SeasonalSuggestion[];
  
  // Based on relationships
  overdue_visits: Company[];
  relationship_maintenance: RelationshipAlert[];
  geographic_clustering: GeographicCluster[];
  
  // Based on business logic
  convention_calendar: ConventionEvent[];
  harvest_seasons: HarvestWindow[];
  optimal_timing: OptimalTimingSuggestion[];
}
```

### Conflict Detection
```typescript
interface ConflictDetection {
  // Schedule conflicts
  user_conflicts: UserConflict[];
  vehicle_conflicts: VehicleConflict[];
  accommodation_conflicts: AccommodationConflict[];
  
  // Business conflicts
  budget_conflicts: BudgetConflict[];
  resource_conflicts: ResourceConflict[];
  priority_conflicts: PriorityConflict[];
  
  // Resolution suggestions
  alternative_dates: Date[];
  resource_alternatives: ResourceAlternative[];
  priority_recommendations: PriorityRecommendation[];
}
```

## 🎯 Implementation Steps

### Phase 1: Basic Trip CRUD (Week 5)
1. Create trip list with cards and basic filtering
2. Implement trip creation wizard (first 3 steps)
3. Build trip overview page with basic stats
4. Add participant management interface
5. Create trip status management

### Phase 2: Advanced Features (Week 6)
1. Complete trip creation wizard with all steps
2. Implement trip proposal system
3. Add advanced filtering and search
4. Build trip analytics and reporting
5. Create conflict detection system

### Phase 3: Integration Features (Week 7)
1. Integrate with meeting management
2. Connect to expense tracking
3. Add document management
4. Implement smart suggestions
5. Build trip templates and replication

## 🔧 API Endpoints

### Trip CRUD Operations
```typescript
// GET /api/trips - List trips with filters
// POST /api/trips - Create new trip
// GET /api/trips/[id] - Get trip details
// PUT /api/trips/[id] - Update trip
// DELETE /api/trips/[id] - Delete trip (soft delete)

// GET /api/trips/[id]/participants - List participants
// POST /api/trips/[id]/participants - Add participant
// PUT /api/trips/[id]/participants/[participantId] - Update participant
// DELETE /api/trips/[id]/participants/[participantId] - Remove participant

// POST /api/trips/[id]/duplicate - Duplicate trip
// GET /api/trips/suggestions - Get trip suggestions
// GET /api/trips/conflicts - Check for conflicts
```

### Proposal System APIs
```typescript
// GET /api/trips/proposals - List proposals
// POST /api/trips/proposals - Create proposal
// PUT /api/trips/proposals/[id] - Update proposal
// POST /api/trips/proposals/[id]/submit - Submit for approval
// POST /api/trips/proposals/[id]/approve - Approve proposal
// POST /api/trips/proposals/[id]/reject - Reject proposal
```

---
*Next Phase: Meeting Management Module*  
*Dependencies: Authentication (✅), Companies (🎯), Users (🎯), Database (✅)*