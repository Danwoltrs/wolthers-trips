# Company Management Module Specification

## 🎯 Overview
The company management module handles client companies, exporters, farms, cooperatives, and other business entities. It manages multiple locations per company, contact management, and supports the complex multi-company trip system.

## 🏢 Company Types & Structure

### Company Categories
```typescript
enum CompanyType {
  CLIENT = 'client',              // Coffee buyers/importers
  EXPORTER = 'exporter',          // Coffee exporters
  FARM = 'farm',                  // Coffee farms
  COOPERATIVE = 'cooperative',    // Farmer cooperatives
  TRADER = 'trader',              // Coffee traders
  ROASTER = 'roaster',            // Coffee roasters
  SUPPLIER = 'supplier',          // General suppliers
  SERVICE_PROVIDER = 'service_provider' // Hotels, transport, logistics services
}
```

### Company Hierarchy
```typescript
interface CompanyStructure {
  // Main company entity
  company: {
    id: string;
    name: string;              // Legal name
    fantasy_name: string;      // Trade name
    industry: string;
    company_type: CompanyType;
    annual_trip_budget: number;
    primary_language: string;
    time_zone: string;
    business_culture: Record<string, any>;
  };
  
  // Multiple locations per company
  locations: CompanyLocation[];
  
  // Multiple contacts per location
  contacts: CompanyContact[];
  
  // Associated users (employees)
  users: User[];
}
```

## 🗄️ Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  fantasy_name VARCHAR(255),
  industry VARCHAR(100),
  company_type company_type_enum DEFAULT 'client',
  annual_trip_budget DECIMAL(12,2),
  primary_language VARCHAR(10) DEFAULT 'en',
  time_zone VARCHAR(50),
  business_culture JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Company Locations Table
```sql
CREATE TABLE company_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location_type location_type_enum DEFAULT 'office',
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  coordinates POINT,
  google_maps_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  visit_instructions TEXT,
  preferred_meeting_times JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Company Contacts Table
```sql
CREATE TABLE company_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  location_id UUID REFERENCES company_locations(id),
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  language_preference VARCHAR(10) DEFAULT 'en',
  is_primary_contact BOOLEAN DEFAULT FALSE,
  contact_type contact_type_enum DEFAULT 'general',
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contact Types
```typescript
enum ContactType {
  GENERAL = 'general',
  EXPORT_MANAGER = 'export_manager',
  FARM_OWNER = 'farm_owner',
  QUALITY_MANAGER = 'quality_manager',
  SALES_REPRESENTATIVE = 'sales_representative',
  LOGISTICS_COORDINATOR = 'logistics_coordinator',
  CEO = 'ceo',
  PROCUREMENT_MANAGER = 'procurement_manager'
}
```

### Location Types
```typescript
enum LocationType {
  OFFICE = 'office',
  HEADQUARTERS = 'headquarters',
  FARM = 'farm',
  WAREHOUSE = 'warehouse',
  PROCESSING_FACILITY = 'processing_facility',
  CUPPING_LAB = 'cupping_lab',
  EXPORT_FACILITY = 'export_facility',
  PORT = 'port'
}
```

## 🏗️ Component Architecture

### Company Management Pages
```
/companies/
├── page.tsx                    # Company list with search/filter
├── create/
│   └── page.tsx               # Create new company form
├── [id]/
│   ├── page.tsx               # Company overview
│   ├── edit/
│   │   └── page.tsx           # Edit company details
│   ├── locations/
│   │   ├── page.tsx           # Location management
│   │   ├── create/
│   │   │   └── page.tsx       # Add new location
│   │   └── [locationId]/
│   │       ├── page.tsx       # Location details
│   │       └── edit/
│   │           └── page.tsx   # Edit location
│   ├── contacts/
│   │   ├── page.tsx           # Contact management
│   │   ├── create/
│   │   │   └── page.tsx       # Add new contact
│   │   └── [contactId]/
│   │       ├── page.tsx       # Contact details
│   │       └── edit/
│   │           └── page.tsx   # Edit contact
│   ├── trips/
│   │   └── page.tsx           # Company trip history
│   └── analytics/
│       └── page.tsx           # Company analytics
```

### Component Structure
```typescript
CompanyManagement
├── CompanyList
│   ├── CompanyTable
│   ├── CompanyCards
│   ├── CompanyFilters
│   └── CompanySearch
├── CompanyForm
│   ├── BasicInfo
│   ├── BusinessDetails
│   ├── CultureSettings
│   └── BudgetConfiguration
├── CompanyOverview
│   ├── CompanyHeader
│   ├── QuickStats
│   ├── RecentActivity
│   └── ActionButtons
├── LocationManagement
│   ├── LocationList
│   ├── LocationForm
│   ├── LocationMap
│   └── VisitInstructions
└── ContactManagement
    ├── ContactList
    ├── ContactForm
    ├── ContactCard
    └── CommunicationHistory
```

## 📋 Company List Interface

### Company Table Design
```typescript
interface CompanyTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  width?: string;
}

const companyTableColumns: CompanyTableColumn[] = [
  { key: 'logo', label: '', sortable: false, filterable: false, width: '48px' },
  { key: 'name', label: 'Company', sortable: true, filterable: true },
  { key: 'fantasy_name', label: 'Trade Name', sortable: true, filterable: true },
  { key: 'company_type', label: 'Type', sortable: true, filterable: true },
  { key: 'industry', label: 'Industry', sortable: true, filterable: true },
  { key: 'primary_language', label: 'Language', sortable: true, filterable: true },
  { key: 'locations_count', label: 'Locations', sortable: true, filterable: false },
  { key: 'contacts_count', label: 'Contacts', sortable: true, filterable: false },
  { key: 'last_visit', label: 'Last Visit', sortable: true, filterable: false },
  { key: 'actions', label: 'Actions', sortable: false, filterable: false }
];
```

### Filtering & Search
```typescript
interface CompanyFilters {
  company_type: CompanyType[];
  industry: string[];
  country: string[];
  primary_language: string[];
  annual_trip_budget: {
    min?: number;
    max?: number;
  };
  last_visit: {
    from?: Date;
    to?: Date;
  };
  search: string; // Name, fantasy name, or industry search
}

// Advanced search capabilities
const searchFields = [
  'name',
  'fantasy_name',
  'industry',
  'locations.city',
  'locations.country',
  'contacts.full_name'
];
```

## 📝 Company Creation & Editing

### Company Form Schema
```typescript
const companyFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Company name is required'),
  fantasy_name: z.string().optional(),
  industry: z.string().min(2, 'Industry is required'),
  company_type: z.enum(['client', 'exporter', 'farm', 'cooperative', 'trader', 'roaster', 'supplier', 'service_provider']),
  
  // Business Details
  annual_trip_budget: z.number().positive().optional(),
  primary_language: z.enum(['en', 'pt', 'es', 'fr', 'de']).default('en'),
  time_zone: z.string().default('America/New_York'),
  
  // Business Culture Settings
  business_culture: z.object({
    meeting_style: z.enum(['formal', 'informal', 'mixed']).optional(),
    preferred_meeting_times: z.object({
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      timezone: z.string().optional()
    }).optional(),
    gift_giving_customs: z.string().optional(),
    dress_code: z.enum(['business_formal', 'business_casual', 'casual']).optional(),
    language_notes: z.string().optional(),
    cultural_considerations: z.string().optional()
  }).optional()
});

type CompanyFormData = z.infer<typeof companyFormSchema>;
```

### Multi-Step Form Flow
```typescript
interface CompanyCreationSteps {
  step1: {
    title: 'Basic Information';
    fields: ['name', 'fantasy_name', 'industry', 'company_type'];
    validation: 'Required fields only';
  };
  
  step2: {
    title: 'Business Details';
    fields: ['annual_trip_budget', 'primary_language', 'time_zone'];
    validation: 'Optional fields with defaults';
  };
  
  step3: {
    title: 'Cultural Settings';
    fields: ['business_culture'];
    validation: 'Cultural preferences';
  };
  
  step4: {
    title: 'Primary Location';
    component: 'LocationForm';
    required: true;
  };
  
  step5: {
    title: 'Primary Contact';
    component: 'ContactForm';
    required: true;
  };
}
```

## 📍 Location Management

### Location Form Schema
```typescript
const locationFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Location name is required'),
  location_type: z.enum(['office', 'headquarters', 'farm', 'warehouse', 'processing_facility', 'cupping_lab', 'export_facility', 'port']),
  
  // Address Information
  address_line1: z.string().min(5, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  
  // Geographic Data
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  google_maps_url: z.string().url().optional(),
  
  // Visit Information
  is_primary: z.boolean().default(false),
  visit_instructions: z.string().optional(),
  preferred_meeting_times: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional()
  }).optional(),
  
  // Additional Contact Information
  contact_info: z.object({
    phone: z.string().optional(),
    fax: z.string().optional(),
    reception_hours: z.string().optional(),
    parking_instructions: z.string().optional(),
    security_requirements: z.string().optional()
  }).optional()
});

type LocationFormData = z.infer<typeof locationFormSchema>;
```

### Google Maps Integration
```typescript
interface LocationMapFeatures {
  // Address autocomplete
  address_autocomplete: {
    enabled: boolean;
    api_key: string;
    countries: string[]; // Restrict to specific countries
  };
  
  // Coordinate selection
  coordinate_picker: {
    enabled: boolean;
    default_zoom: number;
    map_style: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  };
  
  // Distance calculation
  distance_calculation: {
    from_office: boolean;
    from_airport: boolean;
    travel_time: boolean;
  };
  
  // Street view integration
  street_view: {
    enabled: boolean;
    embed_in_form: boolean;
  };
}
```

## 👥 Contact Management

### Contact Form Schema
```typescript
const contactFormSchema = z.object({
  // Personal Information
  full_name: z.string().min(2, 'Full name is required'),
  title: z.string().optional(),
  
  // Contact Information
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  
  // Business Information
  location_id: z.string().uuid('Location is required'),
  contact_type: z.enum(['general', 'export_manager', 'farm_owner', 'quality_manager', 'sales_representative', 'logistics_coordinator', 'ceo', 'procurement_manager']),
  is_primary_contact: z.boolean().default(false),
  
  // Preferences
  language_preference: z.enum(['en', 'pt', 'es', 'fr', 'de']).default('en'),
  
  // Additional Information
  notes: z.string().optional()
});

type ContactFormData = z.infer<typeof contactFormSchema>;
```

### Contact Communication Features
```typescript
interface ContactCommunication {
  // Communication history
  communication_log: {
    date: Date;
    type: 'email' | 'phone' | 'whatsapp' | 'meeting' | 'other';
    subject: string;
    notes: string;
    created_by: string;
  }[];
  
  // Quick actions
  quick_actions: {
    send_email: boolean;
    send_whatsapp: boolean;
    schedule_meeting: boolean;
    add_to_trip: boolean;
  };
  
  // Integration features
  integrations: {
    whatsapp_business: boolean;
    email_templates: boolean;
    calendar_integration: boolean;
    meeting_confirmations: boolean;
  };
}
```

## 📊 Company Analytics

### Company Metrics
```typescript
interface CompanyAnalytics {
  // Visit Statistics
  visit_stats: {
    total_visits: number;
    last_visit_date: Date;
    average_visits_per_year: number;
    visit_frequency_trend: 'increasing' | 'decreasing' | 'stable';
  };
  
  // Relationship Strength
  relationship_metrics: {
    engagement_score: number; // 0-100
    response_rate: number; // Email/WhatsApp response rate
    meeting_acceptance_rate: number;
    last_interaction_date: Date;
  };
  
  // Business Metrics
  business_metrics: {
    trip_budget_utilization: number;
    average_trip_cost: number;
    cost_per_meeting: number;
    roi_estimation: number;
  };
  
  // Communication Stats
  communication_stats: {
    preferred_communication_method: 'email' | 'whatsapp' | 'phone';
    response_time_average: number; // in hours
    best_contact_times: string[];
    language_effectiveness: Record<string, number>;
  };
}
```

### Company Reports
```typescript
interface CompanyReport {
  type: 'company_list' | 'visit_history' | 'relationship_analysis' | 'budget_utilization';
  filters: CompanyFilters;
  date_range: {
    from: Date;
    to: Date;
  };
  format: 'pdf' | 'csv' | 'excel';
  include_analytics: boolean;
  group_by?: 'company_type' | 'country' | 'industry';
}
```

## 🔍 Search & Discovery

### Intelligent Company Search
```typescript
interface CompanySearchFeatures {
  // Full-text search
  full_text_search: {
    fields: ['name', 'fantasy_name', 'industry', 'notes'];
    fuzzy_matching: boolean;
    relevance_scoring: boolean;
  };
  
  // Geographic search
  geographic_search: {
    by_country: boolean;
    by_city: boolean;
    by_region: boolean;
    radius_search: boolean; // Within X km of location
  };
  
  // Business relationship search
  relationship_search: {
    by_last_visit: boolean;
    by_visit_frequency: boolean;
    by_budget_range: boolean;
    by_engagement_level: boolean;
  };
  
  // Advanced filters
  advanced_filters: {
    has_whatsapp_contacts: boolean;
    has_cupping_lab: boolean;
    export_capability: boolean;
    organic_certified: boolean;
    fair_trade_certified: boolean;
  };
}
```

### Smart Suggestions
```typescript
interface SmartSuggestions {
  // Duplicate detection
  duplicate_detection: {
    by_name_similarity: boolean;
    by_address_proximity: boolean;
    by_contact_overlap: boolean;
    confidence_threshold: number;
  };
  
  // Relationship suggestions
  relationship_suggestions: {
    suggested_connections: Company[];
    supply_chain_mapping: Company[];
    competitor_identification: Company[];
    partnership_opportunities: Company[];
  };
  
  // Visit recommendations
  visit_recommendations: {
    overdue_visits: Company[];
    high_value_prospects: Company[];
    geographic_clusters: Company[][];
    seasonal_opportunities: Company[];
  };
}
```

## 🎯 Implementation Steps

### Phase 1: Basic Company Management (Week 3)
1. Create company list page with search and filters
2. Implement company creation and editing forms
3. Build company overview page with basic stats
4. Add company deletion with safety checks
5. Create basic location management

### Phase 2: Location & Contact Management (Week 4)
1. Implement full location CRUD operations
2. Add Google Maps integration for locations
3. Build contact management system
4. Create contact communication features
5. Add location and contact search

### Phase 3: Advanced Features (Week 5)
1. Implement company analytics dashboard
2. Add relationship tracking and scoring
3. Build intelligent search and suggestions
4. Create company reports and exports
5. Add duplicate detection and merging

## 🔧 API Endpoints

### Company Operations
```typescript
// GET /api/companies - List companies with filters
// POST /api/companies - Create new company
// GET /api/companies/[id] - Get company details
// PUT /api/companies/[id] - Update company
// DELETE /api/companies/[id] - Delete company

// GET /api/companies/[id]/locations - List company locations
// POST /api/companies/[id]/locations - Add location
// PUT /api/companies/[id]/locations/[locationId] - Update location
// DELETE /api/companies/[id]/locations/[locationId] - Delete location

// GET /api/companies/[id]/contacts - List company contacts
// POST /api/companies/[id]/contacts - Add contact
// PUT /api/companies/[id]/contacts/[contactId] - Update contact
// DELETE /api/companies/[id]/contacts/[contactId] - Delete contact

// GET /api/companies/[id]/analytics - Get company analytics
// GET /api/companies/search - Advanced company search
// POST /api/companies/merge - Merge duplicate companies
```

### Integration APIs
```typescript
// GET /api/geocoding/address - Geocode address
// GET /api/maps/distance - Calculate distances
// POST /api/communications/log - Log communication
// GET /api/suggestions/duplicates - Find potential duplicates
```

---
*Next Phase: Trip Management Module*  
*Dependencies: Authentication (✅), User Management (🎯), Database (✅)*