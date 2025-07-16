# Wolthers & Associates Travel Management System

A comprehensive, enterprise-grade travel itinerary management system built with modern web technologies for coffee industry professionals and business travelers.

## 🎯 Project Overview

This is a full-stack travel management application designed for **Wolthers & Associates** and their clients. The system manages trips, companies, users, fleet operations, and financial workflows with AI-powered features, multi-currency support, and granular access controls.

### Key Features

- **🔐 Multi-Method Authentication** - Microsoft OAuth, Email OTP, and Trip Code access
- **🌍 Multi-Currency Support** - Real-time exchange rates and native currency reimbursements
- **🤖 AI-Powered Features** - Receipt OCR, trip summarization, and intelligent suggestions
- **🚗 Fleet Management** - Vehicle tracking with AI dashboard photo processing
- **💰 Finance Integration** - Automated reimbursements and client billing
- **🎨 Modern UI/UX** - OKLCH color system with light/dark theme support
- **📱 Responsive Design** - Mobile-first approach with full accessibility
- **🔄 Real-time Updates** - Supabase real-time subscriptions
- **📊 Advanced Analytics** - Data visualization and reporting

## 🏗️ Architecture & Technology Stack

### Frontend
- **Next.js 15+** with App Router and TypeScript
- **React 18+** for component-based UI development
- **Tailwind CSS** with centralized OKLCH color system
- **Zustand** for client-side state management
- **React Query** for server state management and caching

### Backend
- **Supabase** (PostgreSQL 15+ with Row Level Security)
- **Supabase Auth** for authentication management
- **Supabase Storage** for file management with CDN
- **Supabase Real-time** for live updates

### Integrations & APIs
- **Anthropic Claude + OpenAI GPT-4** for AI processing
- **Hostinger SMTP** for email automation
- **Google Maps API** for location services
- **Hotels.com API** for hotel booking integration
- **WhatsApp Business API** for confirmations
- **Microsoft Graph API** for OAuth and Office 365

### Development Tools
- **TypeScript** throughout the entire application
- **ESLint + Prettier** for code quality
- **Zod** for schema validation
- **React Hook Form** for form management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Danwoltrs/wolthers-trips.git
   cd wolthers-trips
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` with:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Email Configuration (Hostinger SMTP)
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=587
   SMTP_USER=trips@trips.wolthers.com
   SMTP_PASSWORD=your_smtp_password
   SMTP_FROM=trips@trips.wolthers.com
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # AI Services
   CLAUDE_API_KEY=your_claude_api_key
   OPENAI_API_KEY=your_openai_api_key
   
   # External APIs
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   HOTELS_COM_API_KEY=your_hotels_api_key
   MICROSOFT_CLIENT_ID=your_microsoft_client_id
   MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with 14+ core tables:

### Core Tables
- **companies** - Client companies, exporters, farms, cooperatives
- **company_locations** - Multiple locations per company with GPS coordinates
- **company_contacts** - Contact management with WhatsApp/email integration
- **users** - Role-based user management with hierarchy
- **trips** - Trip management with branching support
- **trip_participants** - Many-to-many relationship with role assignments
- **meetings** - Meeting scheduling with contact management
- **expenses** - Multi-currency expense tracking with client billing
- **payment_cards** - Payment card management with due date tracking
- **vehicles** - Fleet management with driver assignments
- **vehicle_logs** - Driver logs with odometer and photo tracking
- **flight_bookings** - Flight management with cost tracking
- **finance_tasks** - Automated finance workflow management
- **out_of_office_messages** - OOO automation for staff

### User Roles & Permissions

| Role | Create Trip | Edit Trips | View All Trips | Manage Users | Fleet Access | Finance Access |
|------|-------------|------------|----------------|--------------|--------------|----------------|
| **Global Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Wolthers Staff** | ✅ | Own + Assigned | ✅ | Company Only | ✅ | ❌ |
| **Company Admin** | ✅ | Company Only | Company Only | Company Only | ❌ | ❌ |
| **Client Admin** | ❌ | ❌ | Employee Trips | Employee View | ❌ | ❌ |
| **Finance Department** | ❌ | ❌ | Finance View | ❌ | ❌ | ✅ |
| **Client** | ❌ | ❌ | Assigned Only | ❌ | ❌ | ❌ |
| **Driver** | ❌ | ❌ | Assigned Only | ❌ | Own Vehicle | ❌ |

## 🎨 Design System

### OKLCH Color System
The application implements a comprehensive color system using exact OKLCH values for consistent, theme-aware design:

```css
/* Brand Colors */
--primary: oklch(0.4293 0.0597 164.4252);           /* Wolthers brand green */
--secondary: oklch(1.0000 0 0);                      /* Clean white */
--accent: oklch(0.7882 0.0642 76.1505);             /* Hover states */
--destructive: oklch(0.5770 0.2450 27.3250);        /* Error states */

/* Layout Colors */
--background: oklch(0.9500 0.0156 86.4259);         /* App background */
--foreground: oklch(0 0 0);                         /* Main text */
--card: oklch(1 0 0);                               /* Card backgrounds */
--border: oklch(0.9220 0 0);                        /* Borders */
```

### Theme Features
- **Light/Dark Mode** - Complete theme switching with system detection
- **Theme Persistence** - localStorage with SSR-safe hydration
- **Component Library** - Pre-built components with consistent styling
- **Accessibility** - WCAG 2.1 AA compliance with proper focus management
- **Responsive Design** - Mobile-first approach with breakpoints

### Interactive Demo
Visit `/test-page` → "View Color System" to explore the complete color system with live examples.

## 🔐 Authentication System

### Multi-Method Login
1. **Microsoft OAuth 2.0** - Primary for @wolthers.com (auto-approved)
2. **Email + OTP** - Hostinger SMTP for clients and partners
3. **Trip Code Access** - Temporary access with automatic expiry
4. **Auto-Detection** - Domain-based role assignment

### Security Features
- **Row Level Security (RLS)** - Comprehensive access control
- **Role-Based Permissions** - Granular access management
- **Audit Trails** - Complete activity logging
- **File Access Control** - Secure file sharing with expiration

## 💰 Finance & Multi-Currency

### Financial Management
- **Multi-Currency Support** - Real-time exchange rates
- **Automated Reimbursements** - Card due date tracking
- **Client Billing System** - Automated invoice preparation
- **Expense Categorization** - AI-powered receipt processing
- **Finance Dashboard** - Real-time cost tracking

### Payment Processing
- **Card Management** - Multiple payment cards per user
- **Due Date Tracking** - Automated payment reminders
- **Currency Conversion** - Native currency reimbursements
- **Approval Workflows** - Multi-level expense approval

## 🤖 AI Integration

### Dual AI Strategy
```typescript
// Claude (Anthropic) - Primary for complex tasks
- Receipt OCR processing
- Trip summary generation
- Meeting confirmation automation
- Document analysis

// OpenAI GPT-4 - Secondary for structured tasks
- Expense categorization
- Quick translations
- Structured data extraction
```

### AI Features
- **Receipt OCR** - Automatic expense extraction
- **Trip Summarization** - AI-generated comprehensive reports
- **Meeting Confirmations** - Multi-language automation
- **Expense Categorization** - Smart expense classification
- **Document Processing** - Cupping sheet digitization

## 🚗 Fleet Management

### Vehicle Features
- **Driver Logging** - Odometer and fuel tracking
- **Dashboard Photos** - AI-powered photo processing
- **Maintenance Tracking** - Automated maintenance reminders
- **Third-Party Drivers** - External driver management
- **GPS Integration** - Route tracking and optimization

### AI Dashboard Processing
- **Automatic Odometer Reading** - OCR from dashboard photos
- **Fuel Gauge Analysis** - Consumption calculations
- **Warning Light Detection** - Maintenance alerts
- **Mileage Validation** - Consistency checking

## 📧 Communication & Automation

### Email Automation
- **Hostinger SMTP** - Reliable email delivery
- **Multi-Language Support** - Portuguese, English, Spanish
- **Template Engine** - Branded email templates
- **OOO Automation** - Out-of-office message management

### WhatsApp Integration
- **Meeting Confirmations** - Automated confirmations
- **Response Tracking** - Confirmation status monitoring
- **Multi-Contact Coordination** - Complex meeting management

## 📊 Advanced Features

### Trip Branching System
- **Complex Trip Management** - Multi-company trip segments
- **Shared Resources** - Shared meetings and expenses
- **Independent Tracking** - Branch-specific data
- **Merge Summaries** - Consolidated reporting

### Analytics & Reporting
- **Real-time Dashboards** - Live expense tracking
- **Custom Reports** - Flexible report generation
- **Data Visualization** - Chart components with themed colors
- **Export Capabilities** - PDF and Excel exports

## 🧪 Testing & Development

### Current Status
- ✅ **Database Schema** - Fully implemented and tested
- ✅ **Storage Buckets** - Created and configured
- ✅ **Color System** - Complete OKLCH-based theme system
- ✅ **Authentication** - Multi-method login ready
- ✅ **Environment Variables** - Configured for development
- ✅ **Connection Testing** - Health checks and monitoring
- ✅ **MCP Integration** - Model Context Protocol for Claude Desktop

### Testing Strategy
```bash
# Connection Testing
npm run test:db          # Database connection
npm run test:storage     # Storage buckets
npm run test:email       # SMTP configuration
npm run test:ai          # AI service integration

# Development Testing
npm run dev             # Development server
npm run build          # Production build
npm run test          # Unit tests
npm run lint          # Code linting
```

## 🚀 Deployment

### Production Environment
- **Vercel** - Frontend deployment with automatic builds
- **Supabase** - Backend infrastructure with global edge
- **Hostinger** - Email services and domain management
- **CDN** - Global content delivery for files

### Deployment Steps
1. **Environment Setup** - Configure production variables
2. **Database Migration** - Deploy schema changes
3. **Build & Deploy** - Automated deployment pipeline
4. **Health Checks** - Verify all systems operational
5. **Monitoring** - Set up alerts and logging

### Environment Variables
Ensure all required environment variables are configured in your deployment environment. See `.env.example` for the complete list.

## 📚 Documentation

### Available Documentation
- **[CLAUDE.md](CLAUDE.md)** - Complete development guide with architecture details
- **[docs/travel_app_spec.md](docs/travel_app_spec.md)** - Comprehensive technical specification
- **[docs/database_documentation.md](docs/database_documentation.md)** - Database schema and policies
- **[COLOR_SYSTEM_README.md](COLOR_SYSTEM_README.md)** - Color system implementation guide

### Key Resources
- **Interactive Demo** - `/test-page` for connection testing and color system
- **API Documentation** - Generated from OpenAPI specifications
- **Component Library** - Storybook documentation (coming soon)
- **Database Schema** - ERD diagrams and relationship documentation

## 🔧 Development Guidelines

### Code Quality
- **TypeScript Strict Mode** - Type safety throughout
- **ESLint Configuration** - Consistent code formatting
- **Zod Validation** - Runtime type validation
- **Error Boundaries** - Graceful error handling
- **Performance Optimization** - Core Web Vitals compliance

### Best Practices
- **Semantic Color Names** - Use CSS variables over hardcoded colors
- **Component Composition** - Reusable, composable components
- **Accessibility First** - WCAG 2.1 AA compliance
- **Mobile-First Design** - Responsive from the ground up
- **Security-First** - Input validation and sanitization

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🔒 Security & Compliance

### Security Features
- **Row Level Security** - Database-level access control
- **JWT Authentication** - Secure token management
- **File Access Control** - Granular file permissions
- **Audit Logging** - Complete activity tracking
- **Data Encryption** - At rest and in transit

### Compliance
- **GDPR Compliance** - EU data protection regulations
- **SOX Compliance** - Financial data handling
- **Industry Standards** - Best practices implementation

## 💡 Future Roadmap

### Planned Features
- **Mobile App** - React Native mobile application
- **Offline Support** - Progressive Web App capabilities
- **Advanced Analytics** - Machine learning insights
- **API Platform** - Public API for integrations
- **Microservices** - Service-oriented architecture
- **Real-time Chat** - In-app communication system

### Legacy Migration
- **Database Migration** - 90s SQL database modernization
- **Data Validation** - Comprehensive data cleansing
- **Parallel Running** - Dual system operation
- **Gradual Cutover** - Phased migration approach

## 🤝 Support & Community

### Getting Help
- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Comprehensive guides and examples
- **Discord Community** - Real-time support and discussions
- **Email Support** - Direct support for enterprise users

### Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of conduct
- Development setup
- Pull request process
- Issue reporting guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wolthers & Associates** - Project sponsorship and requirements
- **Supabase Team** - Backend infrastructure and support
- **Next.js Team** - Frontend framework excellence
- **Tailwind CSS** - Utility-first CSS framework
- **Claude Code** - AI-assisted development platform

---

**Built with ❤️ by the Wolthers & Associates development team using Claude Code for AI-assisted development.**

For more detailed technical information, please refer to the [CLAUDE.md](CLAUDE.md) development guide and [docs/travel_app_spec.md](docs/travel_app_spec.md) technical specification.