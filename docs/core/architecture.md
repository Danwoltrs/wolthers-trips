# System Architecture & Technology Stack

## 🏗️ Technology Stack

### Core Technologies
- **Next.js 14+** with App Router for both frontend and backend
- **TypeScript** throughout the entire application
- **Supabase** as primary backend (PostgreSQL + Auth + Storage + Real-time)
- **Tailwind CSS** for styling with centralized color system
- **React** for component-based UI development

### Libraries & Services
- **NextAuth.js** for authentication (Microsoft OAuth + Email OTP)
- **Supabase Client** for database operations, authentication, and file storage
- **Nodemailer** with Hostinger SMTP for email services
- **Anthropic Claude + OpenAI** for AI processing (dual AI strategy)
- **React Hook Form + Zod** for form management and validation
- **Zustand** for client-side state management
- **React Query** for server state management and caching

### External Integrations
- **Google Maps API** for location services and navigation
- **Hotels.com API** for hotel booking integration
- **Hostinger SMTP** for email notifications and OOO messages
- **Microsoft Graph API** for OAuth and Office 365 integration
- **WhatsApp Business API** for automated confirmations
- **Exchange Rate APIs** for multi-currency support

## 📁 Project Structure

```
travel-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Authentication routes
│   │   │   ├── login/
│   │   │   ├── otp/
│   │   │   └── trip-code/          # Trip code access
│   │   ├── (dashboard)/             # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── trips/
│   │   │   ├── companies/
│   │   │   ├── users/
│   │   │   ├── fleet/
│   │   │   ├── finance/
│   │   │   └── profile/
│   │   ├── api/                     # API routes
│   │   │   ├── auth/
│   │   │   ├── trips/
│   │   │   ├── companies/
│   │   │   ├── users/
│   │   │   ├── files/
│   │   │   ├── expenses/
│   │   │   ├── finance/
│   │   │   ├── vehicles/
│   │   │   ├── ai/
│   │   │   ├── emails/
│   │   │   └── hotels/
│   │   └── test-page/               # Development testing
│   ├── components/                  # React components
│   │   ├── ui/                     # Shadcn/ui components
│   │   ├── auth/                   # Authentication components
│   │   ├── trips/                  # Trip management
│   │   ├── companies/              # Company management
│   │   ├── finance/                # Finance department
│   │   ├── fleet/                  # Vehicle management
│   │   ├── expenses/               # Expense management
│   │   └── layout/                 # Layout components
│   ├── lib/                        # Core utilities
│   │   ├── supabase.ts            # Supabase client
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── email.ts               # Email services
│   │   ├── ai/                    # AI integrations
│   │   ├── currency.ts            # Currency utilities
│   │   ├── validations.ts         # Zod schemas
│   │   └── utils.ts               # Helper functions
│   ├── types/                      # TypeScript definitions
│   ├── hooks/                      # Custom React hooks
│   ├── stores/                     # Zustand stores
│   └── styles/                     # Styling
│       ├── globals.css            # Color system & variables
│       ├── components.css         # Component styles
│       └── utilities.css          # Utility classes
├── docs/                           # Documentation
└── [config files]
```

## 🔐 Authentication Architecture

### Authentication Methods
1. **Microsoft OAuth 2.0** - Primary for @wolthers.com (auto-approved)
2. **Email + OTP** - Hostinger SMTP for clients and partners
3. **Trip Code Access** - Temporary access (end of trip +1 day expiry)
4. **Auto-login Detection** - Email domain and invitation-based

### User Roles & Permissions
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

## 🗄️ Database Architecture

### Storage Structure
- **Supabase PostgreSQL** - Main database with 14+ core tables
- **Row Level Security (RLS)** - Comprehensive access control
- **Real-time subscriptions** - Live updates for collaborative features
- **Storage buckets** - File management with granular access controls

### Storage Buckets
```
receipts/           # Expense receipts (50MB limit, private)
dashboard-photos/   # Vehicle dashboard photos (10MB limit, private)  
documents/          # Trip documents, presentations (100MB limit, private)
```

## 🎨 Design System

### Tailwind Color System
- **Consistent theming** across light/dark modes
- **CSS variables** for dynamic color management
- **Tailwind integration** for utility-first styling
- **Accessibility compliant** color contrasts

### Component Architecture
- **Shadcn/ui base components** for consistency
- **Custom travel components** for domain-specific features
- **Responsive design** with mobile-first approach
- **Theme-aware components** with automatic mode switching

## 🤖 AI Integration Strategy

### Dual AI Approach
- **Claude (Anthropic)** - Primary for complex tasks, image processing, content generation
- **OpenAI GPT** - Secondary for structured tasks, quick categorization, translations

### AI Cost Optimization
- **Cache frequent requests** to reduce API calls
- **Batch processing** for multiple operations
- **Confidence scoring** to avoid unnecessary re-processing
- **Fallback mechanisms** for AI service failures

## 🌐 Multi-Currency & International

### Currency Management
- **Native currency reimbursement** (BRL → BRL, USD → USD)
- **Real-time exchange rates** with historical tracking
- **Multi-currency invoicing** for client billing
- **Conversion fee tracking** and optimization

### International Features
- **Multi-language support** (EN, PT, ES, FR, DE)
- **Cultural considerations** for business practices
- **Time zone awareness** for global operations
- **Localized communication** templates

## 🔧 Development Environment

### Environment Variables
```bash
# Supabase (✅ Configured)
NEXT_PUBLIC_SUPABASE_URL=https://ocddrrzhautoybqmebsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
SUPABASE_SERVICE_ROLE_KEY=[configured]

# Email (✅ Configured)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=trips@trips.wolthers.com
SMTP_PASSWORD=[configured]

# Authentication (✅ Configured)
NEXTAUTH_URL=https://wolthers-trips.vercel.app
NEXTAUTH_SECRET=[configured]

# AI Services (⏳ To Configure)
CLAUDE_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

# External APIs (⏳ To Configure)
GOOGLE_MAPS_API_KEY=your_google_maps_key
HOTELS_COM_API_KEY=your_hotels_api_key
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

## 🚀 Deployment Strategy

### Current Deployment
- **Platform**: Vercel (https://wolthers-trips.vercel.app)
- **Database**: Supabase hosted PostgreSQL
- **File Storage**: Supabase Storage with CDN
- **Email**: Hostinger SMTP service

### Production Considerations
- **SSL certificates** for secure connections
- **Environment variable management** for production
- **Database backups** and disaster recovery
- **Performance monitoring** and optimization
- **Security audits** and compliance checks

## 📊 Monitoring & Analytics

### Key Metrics
- **User adoption rates** by role
- **Trip creation and completion** metrics
- **Expense approval workflow** efficiency
- **AI processing costs** and accuracy
- **System performance** and uptime

### Security & Compliance
- **Audit trails** for all operations
- **Data encryption** at rest and in transit
- **GDPR compliance** for EU operations
- **Role-based access validation**

---
*Last updated: January 2025*  
*Current deployment: Vercel + Supabase*