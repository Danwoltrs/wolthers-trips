# claude.md - Travel Itinerary Web App Development Guide

## 🎯 Project Overview
This is a comprehensive travel itinerary management web application for Wolthers & Associates and their clients. The system manages trips, companies, users, fleet, finance operations, and provides AI-powered features for itinerary creation, expense management, and automated workflows with granular access controls.

### 🔄 Project Awareness & Context
- **Always read the comprehensive specification document** to understand the project's complete architecture, database schema, and feature requirements
- **Check the database documentation** for current schema, RLS policies, and storage configuration
- **Use consistent naming conventions, file structure, and architecture patterns** as described in this guide
- **Reference the 50+ page requirements document** for detailed feature specifications and user flows
- **Consider trip branching, multi-currency support, and role-based access** in all implementations

## 🏗️ Architecture & Technology Stack

### Full-Stack TypeScript & Modern Web Technologies
- **Next.js 14+** with App Router for both frontend and backend
- **TypeScript** throughout the entire application
- **Supabase** as primary backend (PostgreSQL + Auth + Storage + Real-time)
- **Tailwind CSS** for styling with centralized color system and dark/light mode support
- **React** for component-based UI development
- **Tailwind Color System** for consistent theme-aware design

### Core Libraries & Services
- **NextAuth.js** for authentication (Microsoft OAuth + Email OTP)
- **Supabase Client** for database operations, authentication, and file storage
- **Nodemailer** with Hostinger SMTP for email services
- **Anthropic Claude + OpenAI** for AI processing (dual AI strategy)
- **React Hook Form + Zod** for form management and validation
- **Zustand** for client-side state management
- **React Query** for server state management and caching

### External Integrations & APIs
- **Google Maps API** for location services and navigation
- **Hotels.com API** for hotel booking integration
- **Hostinger SMTP** for email notifications and OOO messages
- **Supabase Storage** for file management with granular access controls
- **Microsoft Graph API** for OAuth and Office 365 integration
- **WhatsApp Business API** for automated confirmations
- **Exchange Rate APIs** for multi-currency support

## 🗄️ Database Architecture (Supabase PostgreSQL)

### Current Database Schema
The application uses a comprehensive PostgreSQL schema hosted on Supabase with 14+ core tables:

#### Core Tables
```sql
-- Companies (clients, exporters, farms, cooperatives)
companies: id, name, fantasy_name, industry, company_type, annual_trip_budget, primary_language, time_zone, business_culture

-- Company Locations (multiple locations per company)
company_locations: id, company_id, name, location_type, address_line1, city, state, country, coordinates, google_maps_url, visit_instructions

-- Company Contacts (hosts/exporters with WhatsApp/email)
company_contacts: id, company_id, location_id, full_name, title, email, phone, whatsapp, language_preference, contact_type

-- Users with Role-Based Access
users: id, email, full_name, role, company_id, auth_method, reports_to, preferences

-- Trips with Branching Support
trips: id, parent_trip_id, branch_type, title, type, status, proposal_status, start_date, end_date, created_by, approved_by, estimated_cost, actual_cost

-- Trip Participants (many-to-many with branching)
trip_participants: id, trip_id, user_id, company_id, role, join_date, leave_date, branch_segment

-- Meetings with Contact Management
meetings: id, trip_id, title, meeting_date, start_time, location_id, primary_contact_id, status, confirmation_status, notes, ai_summary

-- Multi-Currency Expenses with Client Billing
expenses: id, trip_id, user_id, amount, currency, usd_amount, category, card_id, billing_status, client_billable, reimbursement_status

-- Payment Cards with Due Date Tracking
payment_cards: id, user_id, last_four_digits, card_type, card_currency, due_date, preferred_reimbursement_currency

-- Vehicle Management & Driver Logs
vehicles: id, make, model, year, license_plate, current_odometer, fuel_capacity, status
vehicle_logs: id, vehicle_id, trip_id, driver_id, odometer_start, odometer_end, dashboard_photo_start, dashboard_photo_end

-- Flight Bookings & Costs
flight_bookings: id, trip_id, passenger_id, airline, departure_airport, ticket_cost, currency, client_billable

-- Finance Task Management
finance_tasks: id, task_type, trip_id, priority, status, assigned_to, due_date, amount, recipient_info

-- Out of Office Automation
out_of_office_messages: id, user_id, trip_id, message_type, start_date, end_date, auto_reply_message, activation_status
```

#### User Roles & Permissions
```typescript
enum UserRole {
  GLOBAL_ADMIN      // Full system access
  WOLTHERS_STAFF    // Create trips, manage expenses, view all
  COMPANY_ADMIN     // Manage company users and trips
  CLIENT_ADMIN      // Business owners, view employee trips, create Brazil proposals
  FINANCE_DEPARTMENT // View costs, manage reimbursements, client billing
  CLIENT            // View assigned trips only
  DRIVER            // Vehicle-focused views with navigation
}
```

### Storage Buckets (Supabase Storage)
```
receipts/           # Expense receipts (50MB limit, private)
dashboard-photos/   # Vehicle dashboard photos (10MB limit, private)  
documents/          # Trip documents, presentations (100MB limit, private)
```

### Row Level Security (RLS) Policies
- **Comprehensive access control** based on user roles
- **Trip participant validation** for data access
- **Finance department permissions** for all financial data
- **Client admin hierarchy** for employee trip oversight
- **Driver-specific permissions** for vehicle data

## 🧱 Code Structure & Architecture

### Project Structure
```
travel-app/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   ├── otp/
│   │   │   └── trip-code/           # Trip code access
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── trips/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── branch/      # Trip branching interface
│   │   │   │   │   └── expenses/    # Trip expense management
│   │   │   │   ├── create/
│   │   │   │   └── proposals/       # Trip proposal system
│   │   │   ├── companies/
│   │   │   │   └── [id]/contacts/   # Contact management
│   │   │   ├── users/
│   │   │   ├── fleet/
│   │   │   │   └── logs/            # Driver logs
│   │   │   ├── finance/             # Finance department
│   │   │   │   ├── reimbursements/
│   │   │   │   ├── billing/         # Client billing
│   │   │   │   └── tasks/           # Finance tasks
│   │   │   └── profile/             # User settings
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   ├── trips/
│   │   │   │   └── [id]/branch/     # Trip branching API
│   │   │   ├── companies/
│   │   │   ├── users/
│   │   │   ├── files/               # File access control
│   │   │   ├── expenses/
│   │   │   │   └── ocr/             # Receipt processing
│   │   │   ├── finance/             # Finance operations
│   │   │   ├── vehicles/
│   │   │   ├── ai/                  # AI processing
│   │   │   ├── emails/              # Email automation
│   │   │   ├── ooo/                 # Out of office
│   │   │   └── hotels/              # Hotels.com integration
│   │   ├── test-page/                # Connection testing & color demo
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                   # React components
│   │   ├── ui/                      # Shadcn/ui components
│   │   ├── auth/                    # Authentication
│   │   ├── trips/                   # Trip management
│   │   │   ├── branching/           # Trip branching UI
│   │   │   └── proposals/           # Proposal system
│   │   ├── companies/               # Company & contact management
│   │   ├── finance/                 # Finance department UI
│   │   ├── fleet/                   # Vehicle management
│   │   ├── expenses/                # Expense management
│   │   │   └── receipt-scanner/     # AI receipt processing
│   │   ├── layout/                  # Layout components
│   │   ├── theme-provider.tsx       # Theme management
│   │   ├── theme-toggle.tsx         # Theme switching
│   │   └── color-demo.tsx           # Color system demo
│   ├── lib/                         # Core utilities
│   │   ├── supabase.ts             # Supabase client & test functions
│   │   ├── storage.ts              # Storage utilities & test functions
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── email.ts                # Hostinger SMTP + OOO automation
│   │   ├── ai/                     # AI integrations
│   │   │   ├── claude.ts           # Anthropic Claude
│   │   │   ├── openai.ts           # OpenAI GPT
│   │   │   └── receipt-ocr.ts      # Receipt processing
│   │   ├── currency.ts             # Multi-currency utilities
│   │   ├── hotels.ts               # Hotels.com API
│   │   ├── maps.ts                 # Google Maps integration
│   │   ├── validations.ts          # Zod schemas
│   │   └── utils.ts                # Helper functions
│   ├── types/                       # TypeScript definitions
│   │   ├── database.ts             # Supabase generated types
│   │   ├── auth.ts
│   │   ├── trips.ts
│   │   ├── finance.ts              # Finance-specific types
│   │   ├── expenses.ts             # Multi-currency expenses
│   │   ├── files.ts                # File access control
│   │   └── vehicles.ts             # Fleet management
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-trips.ts
│   │   ├── use-trip-branching.ts   # Trip branching logic
│   │   ├── use-expenses.ts         # Expense management
│   │   ├── use-files.ts            # File access
│   │   └── use-currency.ts         # Currency conversion
│   ├── stores/                      # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── trip-store.ts
│   │   ├── expense-store.ts
│   │   └── ui-store.ts
│   └── styles/                      # Centralized styling
│       ├── globals.css              # Color system & CSS variables
│       ├── components.css           # Component-specific styles
│       └── utilities.css            # Utility classes
├── docs/                            # Documentation
│   ├── database_documentation.md   # Complete DB schema
│   ├── travel_app_spec.md          # Full requirements
│   └── DEPLOYMENT.md                # Deployment guide
├── COLOR_SYSTEM_README.md          # Color system documentation
├── .env.local                       # Environment variables
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## 🔐 Authentication & Authorization

### Authentication Methods
1. **Microsoft OAuth 2.0** - Primary for @wolthers.com (auto-approved)
2. **Email + OTP** - Hostinger SMTP for clients and partners
3. **Trip Code Access** - Temporary access (end of trip +1 day expiry)
4. **Auto-login Detection** - Email domain and invitation-based

### Advanced User Management
```typescript
interface UserHierarchy {
  // Client Admin can oversee employees
  reports_to: string | null;
  
  // Trip code access with benefits prompting
  trip_code_visits: number;
  prompt_account_creation: boolean; // After 3 visits
  
  // Multi-company access for complex relationships
  company_access: string[];
}
```

### Environment Variables (Current)
```bash
# Supabase Configuration (CONFIRMED WORKING)
NEXT_PUBLIC_SUPABASE_URL=https://ocddrrzhautoybqmebsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (Hostinger SMTP - CONFIGURED)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=trips@trips.wolthers.com
SMTP_PASSWORD=whvZYkvoG8°sSE
SMTP_FROM=trips@trips.wolthers.com

# Authentication
  # Current Vercel setup
  NEXTAUTH_URL=https://wolthers-trips.vercel.app
  NEXTAUTH_SECRET=T59ZpH5Mu@ZCZ*BmHt@hkt%Wm^YX^A6A
bi

# AI Services (TO BE CONFIGURED)
CLAUDE_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

# External APIs (TO BE CONFIGURED)
GOOGLE_MAPS_API_KEY=your_google_maps_key
HOTELS_COM_API_KEY=your_hotels_api_key
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# Application Settings
NEXT_PUBLIC_APP_URL=https://wolthers-trips.vercel.app
NODE_ENV=production
```

## 🤖 AI Integration Strategy

### Dual AI Approach
```typescript
// Claude (Anthropic) - Primary for complex tasks
export const claudeServices = {
  // Better for image processing and OCR
  processReceiptOCR: async (imageBase64: string) => {
    // Extract: amount, currency, merchant, card details, category
  },
  
  // Superior for long-form content generation
  generateTripSummary: async (meetings: Meeting[], notes: string[]) => {
    // Comprehensive trip reports with meeting synthesis
  },
  
  // Excellent for document analysis
  processCuppingSheets: async (imageBase64: string) => {
    // SCA cupping sheet digitization
  },
  
  // Multi-language communication
  generateMeetingConfirmations: async (contact: Contact, meeting: Meeting) => {
    // Auto-generate in local language (PT, EN, ES)
  }
};

// OpenAI GPT - Secondary for structured tasks
export const openaiServices = {
  // Good for quick categorization
  categorizeExpense: async (description: string) => {
    // Fast expense category detection
  },
  
  // Structured data extraction
  parseItineraryText: async (rawText: string) => {
    // Time formatting, location suggestions, sequence optimization
  },
  
  // Translation services
  translateContent: async (text: string, targetLang: string) => {
    // Quick translations for international trips
  }
};
```

### AI Cost Optimization
- **Cache frequent requests** (company locations, common expenses)
- **Batch processing** for multiple receipts
- **Confidence scoring** to avoid unnecessary re-processing
- **Fallback to simpler methods** for basic tasks

## 💰 Finance Department Integration

### Comprehensive Financial Management
```typescript
interface FinanceOperations {
  // Multi-currency reimbursement management
  reimbursementQueue: {
    pendingByDueDate: ReimbursementItem[];
    urgentPayments: ReimbursementItem[]; // Due within 5 days
    byCurrency: Record<string, ReimbursementItem[]>;
    cardDueDateTracking: CardDueDate[];
  };
  
  // Client billing system
  clientBilling: {
    billableTrips: BillableTripSummary[];
    invoicePreparation: InvoiceData[];
    multiCurrencyInvoices: CurrencyBreakdown[];
    revenueTracking: RevenueMetrics;
  };
  
  // Automated workflows
  automation: {
    taskGeneration: FinanceTask[];
    emailNotifications: EmailTemplate[];
    approvalWorkflows: ApprovalWorkflow[];
    reportGeneration: ReportConfig[];
  };
}
```

### Finance Dashboard Features
- **Real-time cost tracking** across all trips
- **Card due date management** with priority queues
- **Multi-currency reimbursement** processing
- **Client billing preparation** with supporting documents
- **Automated finance task** generation and assignment
- **Cash flow projections** based on payment schedules

## 🚗 Fleet Management & Driver Features

### Vehicle Accountability System
```typescript
interface VehicleManagement {
  // Driver logging with AI dashboard processing
  driverLogs: {
    tripStart: DashboardPhoto; // AI extracts odometer + fuel
    tripEnd: DashboardPhoto;   // AI calculates usage
    routeTracking: GPSRoute;
    incidentReporting: IncidentLog[];
  };
  
  // Third-party driver management
  externalDrivers: {
    registration: DriverRegistration;
    authorization: AuthorizationLevel;
    accountability: AccountabilityMeasures;
    performance: PerformanceScoring;
  };
  
  // Expense management for drivers
  driverExpenses: {
    fuelReceipts: FuelReceipt[];
    maintenance: MaintenanceRecord[];
    carWash: ServiceRecord[];
    reimbursements: DriverReimbursement[];
  };
}
```

### AI Dashboard Photo Processing
- **Automatic odometer reading** via OCR
- **Fuel gauge analysis** and consumption calculation
- **Warning light detection** for maintenance alerts
- **Mileage validation** against previous readings
- **Damage assessment** with photo comparison

## 🌍 Multi-Currency & International Features

### Currency Management
```typescript
interface CurrencySystem {
  // Native currency reimbursement
  reimbursementLogic: {
    brl: 'R$ → R$ (default)',
    usd: '$ → $ (default)',
    eur: '€ → € (default)',
    conversionOption: 'User choice with rate display'
  };
  
  // Exchange rate handling
  exchangeRates: {
    realTimeRates: ExchangeRateAPI;
    historicalTracking: RateHistory;
    conversionFees: FeeCalculation;
    rateFluctuationAlerts: RateAlert[];
  };
  
  // Client billing currencies
  clientBilling: {
    transactionCurrency: 'Original currency for invoicing',
    usdReporting: 'USD conversion for management',
    multiCurrencyInvoices: CurrencyBreakdown;
  };
}
```

## 📧 Communication & Automation

### Hostinger SMTP Integration
```typescript
// lib/email.ts - Enhanced email system
export const emailServices = {
  // OTP authentication
  sendOTP: async (email: string, otp: string, language: string) => {
    // Multi-language OTP emails
  },
  
  // Meeting confirmations with AI
  sendMeetingConfirmation: async (contact: Contact, meeting: Meeting) => {
    // Auto-generated in local language (Portuguese, English, Spanish)
    // Template: "Boa tarde {name}, gostaria de agendar..."
  },
  
  // Trip summaries
  sendTripSummary: async (participants: User[], tripData: TripSummary) => {
    // AI-generated comprehensive trip reports
  },
  
  // Finance notifications
  sendReimbursementAlert: async (financeTeam: User[], urgentPayments: Payment[]) => {
    // Automated reimbursement due date alerts
  },
  
  // Out of office automation
  manageOutOfOffice: async (user: User, trip: Trip) => {
    // Automatic OOO setup for Wolthers staff
  }
};
```

### WhatsApp Business API Integration
- **Meeting confirmations** in local language
- **Response tracking** and escalation
- **Multi-contact coordination** for complex meetings
- **Automated follow-ups** based on response patterns

## 🎯 Advanced Features

### Trip Branching System
```typescript
interface TripBranching {
  // Complex multi-company trip management
  branchingLogic: {
    sharedSegment: SharedTripSegment;
    branchPoints: BranchPoint[];
    independentSegments: IndependentSegment[];
    mergePoints: MergePoint[];
  };
  
  // Data synchronization
  dataSync: {
    sharedMeetings: SharedMeetingData;
    independentNotes: BranchSpecificData;
    expenseAllocation: ExpenseAllocationRules;
    summaryGeneration: BranchMergeSummary;
  };
}
```

### AI-Powered Features
- **Itinerary optimization** with location clustering
- **Meeting time suggestions** based on travel time
- **Expense categorization** with learning
- **Receipt fraud detection** through pattern analysis
- **Trip cost prediction** using historical data
- **Client relationship scoring** for visit prioritization

### Hotel Integration (Hotels.com)
- **Real-time availability** and pricing
- **Location-based filtering** relative to meetings
- **Direct booking** through the platform
- **Cost tracking** and client billing integration
- **Preference-based recommendations**

## 🎨 Color System & Design

### Centralized Tailwind Color System
The application uses a comprehensive color system based on Tailwind classes for consistent, theme-aware design:

```css
/* Primary Colors */
--primary: oklch(0.4293 0.0597 164.4252);
--primary-foreground: oklch(0.9895 0.0090 78.2827);
--secondary: oklch(1.0000 0 0);
--secondary-foreground: oklch(0.4298 0.0589 164.0275);

/* Background & Text */
--background: oklch(0.9500 0.0156 86.4259);
--foreground: oklch(0 0 0);
--card: oklch(1 0 0);
--card-foreground: oklch(0.1450 0 0);

/* Accent & States */
--accent: oklch(0.7882 0.0642 76.1505);
--accent-foreground: oklch(0 0 0);
--destructive: oklch(0.5770 0.2450 27.3250);
--destructive-foreground: oklch(1 0 0);
```

### Theme System Features
- **Light/Dark Mode**: Complete theme switching with automatic system detection
- **Theme Persistence**: localStorage with SSR-safe hydration
- **Theme Provider**: React context for theme management
- **CSS Variables**: All colors defined as CSS custom properties
- **Tailwind Integration**: Full integration with Tailwind CSS utilities

### Component Library
```typescript
// Pre-built components with consistent styling
<button className="btn btn-primary">Primary Button</button>
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-content">Content</div>
</div>

// Travel-specific components
<div className="trip-card">
  <span className="badge expense-status-pending">Pending</span>
  <div className="expense-amount currency-usd">$250.00</div>
</div>
```

### Color Categories
- **Primary/Secondary**: Brand colors and interactions
- **Background/Foreground**: Base layout colors
- **Accent/Muted**: Highlighting and subtle text
- **Destructive**: Error states and warnings
- **Chart Colors**: 5 colors for data visualization
- **Sidebar Colors**: Navigation-specific palette
- **Travel Components**: Status badges, currency displays

### Documentation
- **COLOR_SYSTEM_README.md**: Complete implementation guide
- **Interactive Demo**: Available at `/test-page` → "View Color System"
- **Component Examples**: All styled components with usage examples
- **Migration Guide**: From hardcoded colors to CSS variables

## 🧪 Testing & Development

### Current Implementation Status
- ✅ **Database schema** - Fully implemented and tested
- ✅ **Storage buckets** - Created and configured
- ✅ **Basic authentication** - Ready for implementation
- ✅ **Environment variables** - Configured for development
- ✅ **Color system** - Complete Tailwind-based theme system
- ✅ **Connection testing** - Test page created and working
- ⏳ **Core features** - Ready for development

### Testing Strategy
```typescript
// Connection testing (IMPLEMENTED)
testDatabaseConnection() // ✅ Working
testStorageConnection()  // ✅ Working
testEnvironmentConfig()  // ✅ Working

// Feature testing (TO IMPLEMENT)
testTripBranching()      // Complex scenarios
testMultiCurrency()      // Exchange rate handling
testAccessControl()      // File permissions
testAIIntegration()      // AI service responses
testEmailAutomation()    // SMTP delivery
```

## 🚀 Deployment & Production

### Hostinger Deployment Strategy
**Current Status**: Ready for deployment testing

**Deployment Options**:
1. **Shared Hosting** - Static export with serverless functions
2. **VPS Hosting** - Full Next.js application with PM2

**Production Checklist**:
- [ ] Environment variables configured
- [ ] Domain SSL certificate
- [ ] Database connection verified
- [ ] Storage access tested
- [ ] Email delivery confirmed
- [ ] Performance optimization
- [ ] Security audit
- [ ] Backup strategy

### Legacy System Migration Plan
**Next Phase**: Migrate 90s SQL database to modern Supabase

**Migration Strategy**:
- **Assessment**: Document legacy schema and relationships
- **Mapping**: Legacy tables → Modern Supabase schema
- **Data Migration**: Gradual migration with validation
- **Integration**: Link travel system to existing business operations
- **Parallel Running**: Dual system operation during transition
- **Cutover**: Complete migration to new system

## 📊 Monitoring & Analytics

### Key Performance Indicators
- **User adoption** rates by role
- **Trip creation** and completion metrics
- **Expense approval** workflow efficiency
- **AI processing** accuracy and costs
- **Email delivery** success rates
- **File access** patterns and security
- **Multi-currency** transaction volumes
- **Client billing** cycle times

### Security & Compliance
- **Audit trails** for all financial operations
- **File access logging** with violation detection
- **Role-based access** validation
- **Data encryption** at rest and in transit
- **GDPR compliance** for EU operations
- **SOX compliance** for financial data

## 💡 Development Best Practices

### Code Quality Standards
- **TypeScript strict mode** throughout
- **Zod validation** for all inputs
- **Error boundaries** and graceful degradation
- **Accessibility** (WCAG 2.1 AA)
- **Performance optimization** (Core Web Vitals)
- **Security-first** development approach

### AI Integration Guidelines
- **Never hallucinate** libraries or functions
- **Validate AI responses** before processing
- **Implement fallback** mechanisms for AI failures
- **Cost monitoring** for AI service usage
- **Confidence scoring** for AI decisions
- **Human oversight** for critical operations

This comprehensive guide reflects the current state of the Wolthers Travel App with all implemented features, working database connections, configured storage, and ready-to-deploy architecture. The system is designed for scalability, security, and ease of maintenance while supporting complex business requirements like trip branching, multi-currency operations, and granular access controls.

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified knowledge and packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.