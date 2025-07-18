# Communication Module Specification

## 🎯 Overview
The communication module handles automated email delivery, WhatsApp Business API integration, multi-language templates, out-of-office management, and notification workflows across the entire travel management system.

## 📧 Email System Architecture

### Hostinger SMTP Integration
```typescript
interface EmailSystemConfig {
  // Current working configuration
  smtp_config: {
    host: 'smtp.hostinger.com';
    port: 587;
    secure: false; // TLS
    auth: {
      user: 'trips@trips.wolthers.com';
      pass: process.env.SMTP_PASSWORD;
    };
  };
  
  // Email capabilities
  capabilities: {
    daily_limit: 1000;
    attachment_size: '25MB';
    html_support: true;
    template_engine: true;
    bounce_handling: true;
    delivery_tracking: true;
  };
  
  // Reliability features
  reliability: {
    retry_logic: RetryConfiguration;
    fallback_providers: FallbackProviders;
    queue_management: QueueManagement;
    rate_limiting: RateLimiting;
  };
}
```

### Email Template System
```typescript
interface EmailTemplateSystem {
  // Template categories
  template_categories: {
    authentication: {
      otp_login: OTPLoginTemplate;
      account_creation: AccountCreationTemplate;
      password_reset: PasswordResetTemplate;
      trip_code_access: TripCodeAccessTemplate;
    };
    
    trip_management: {
      trip_created: TripCreatedTemplate;
      trip_updated: TripUpdatedTemplate;
      trip_cancelled: TripCancelledTemplate;
      participant_added: ParticipantAddedTemplate;
    };
    
    meeting_confirmations: {
      initial_confirmation: InitialConfirmationTemplate;
      reminder_24h: Reminder24HTemplate;
      final_reminder: FinalReminderTemplate;
      meeting_cancelled: MeetingCancelledTemplate;
    };
    
    expense_notifications: {
      expense_submitted: ExpenseSubmittedTemplate;
      expense_approved: ExpenseApprovedTemplate;
      expense_rejected: ExpenseRejectedTemplate;
      reimbursement_processed: ReimbursementProcessedTemplate;
    };
    
    finance_alerts: {
      urgent_reimbursement: UrgentReimbursementTemplate;
      billing_ready: BillingReadyTemplate;
      payment_overdue: PaymentOverdueTemplate;
      budget_alert: BudgetAlertTemplate;
    };
  };
  
  // Multi-language support
  language_support: {
    supported_languages: ['en', 'pt', 'es', 'fr'];
    automatic_detection: AutomaticLanguageDetection;
    fallback_language: 'en';
    cultural_adaptation: CulturalAdaptationRules;
  };
}
```

## 🗄️ Database Schema

### Email Templates Table
```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key VARCHAR(100) UNIQUE NOT NULL,
  category email_category_enum NOT NULL,
  language VARCHAR(10) NOT NULL,
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Email Logs Table
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key VARCHAR(100),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  sender_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  status email_status_enum DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  trip_id UUID REFERENCES trips(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Out of Office Management
```sql
CREATE TABLE out_of_office_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  message_type ooo_message_type_enum DEFAULT 'business_travel',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  return_date DATE,
  auto_reply_subject VARCHAR(255),
  auto_reply_message TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_email VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  alternative_contact_name VARCHAR(255),
  alternative_contact_email VARCHAR(255),
  language_preference VARCHAR(10) DEFAULT 'en',
  is_active BOOLEAN DEFAULT FALSE,
  created_automatically BOOLEAN DEFAULT TRUE,
  email_system email_system_enum DEFAULT 'microsoft_365',
  activation_status activation_status_enum DEFAULT 'pending',
  activated_at TIMESTAMP WITH TIME ZONE,
  deactivated_at TIMESTAMP WITH TIME ZONE,
  custom_message TEXT,
  include_trip_details BOOLEAN DEFAULT FALSE,
  include_emergency_contact BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🏗️ Component Architecture

### Communication Pages
```
/communication/
├── templates/
│   ├── page.tsx               # Email template management
│   ├── create/
│   │   └── page.tsx           # Create new template
│   └── [id]/
│       ├── page.tsx           # Template details
│       └── edit/
│           └── page.tsx       # Edit template
├── logs/
│   ├── page.tsx               # Email delivery logs
│   ├── analytics/
│   │   └── page.tsx           # Email analytics
│   └── [id]/
│       └── page.tsx           # Individual email details
├── ooo/
│   ├── page.tsx               # Out of office management
│   ├── create/
│   │   └── page.tsx           # Create OOO message
│   └── automation/
│       └── page.tsx           # OOO automation settings
└── settings/
    ├── page.tsx               # Communication settings
    ├── smtp/
    │   └── page.tsx           # SMTP configuration
    └── whatsapp/
        └── page.tsx           # WhatsApp settings
```

### Component Structure
```typescript
CommunicationSystem
├── EmailService
│   ├── SMTPProvider
│   ├── TemplateEngine
│   ├── DeliveryTracker
│   └── BounceHandler
├── TemplateManager
│   ├── TemplateList
│   ├── TemplateEditor
│   ├── VariableMapper
│   └── PreviewGenerator
├── WhatsAppService
│   ├── BusinessAPI
│   ├── MessageTemplates
│   ├── ResponseHandler
│   └── StatusTracker
├── OutOfOfficeManager
│   ├── AutomationEngine
│   ├── MessageGenerator
│   ├── ScheduleManager
│   └── IntegrationHandler
└── NotificationCenter
    ├── NotificationQueue
    ├── DeliveryOrchestrator
    ├── Analytics
    └── ReportGenerator
```

## 📱 WhatsApp Business Integration

### WhatsApp API Configuration
```typescript
interface WhatsAppBusinessAPI {
  // API configuration
  api_config: {
    endpoint: 'https://graph.facebook.com/v18.0';
    phone_number_id: string;
    access_token: string;
    webhook_url: string;
    verify_token: string;
  };
  
  // Message capabilities
  message_capabilities: {
    text_messages: TextMessageSupport;
    template_messages: TemplateMessageSupport;
    media_messages: MediaMessageSupport;
    interactive_messages: InteractiveMessageSupport;
  };
  
  // Template management
  template_management: {
    meeting_confirmation: MeetingConfirmationTemplate;
    trip_reminder: TripReminderTemplate;
    urgent_notification: UrgentNotificationTemplate;
    follow_up_message: FollowUpMessageTemplate;
  };
}
```

### WhatsApp Message Templates
```typescript
interface WhatsAppTemplates {
  // Meeting confirmation (Portuguese)
  meeting_confirmation_pt: {
    name: 'meeting_confirmation_pt';
    language: 'pt_BR';
    template: `Boa tarde {{contact_name}},

Gostaria de confirmar nossa reunião:
📅 {{meeting_date}}
🕒 {{meeting_time}}
📍 {{location_name}}

Confirma disponibilidade?

Atenciosamente,
{{sender_name}}
Wolthers & Associates`;
  };
  
  // Meeting confirmation (English)
  meeting_confirmation_en: {
    name: 'meeting_confirmation_en';
    language: 'en_US';
    template: `Good afternoon {{contact_name}},

I would like to confirm our meeting:
📅 {{meeting_date}}
🕒 {{meeting_time}}
📍 {{location_name}}

Please confirm your availability.

Best regards,
{{sender_name}}
Wolthers & Associates`;
  };
  
  // Urgent trip notification
  urgent_notification: {
    name: 'urgent_notification';
    template: `🚨 URGENT: {{notification_type}}

Trip: {{trip_title}}
{{notification_message}}

Please respond immediately.

Contact: {{contact_person}}
Phone: {{contact_phone}}`;
  };
}
```

## 🤖 Automated Communication Workflows

### Meeting Confirmation Automation
```typescript
interface MeetingConfirmationWorkflow {
  // Trigger conditions
  triggers: {
    meeting_created: {
      delay: 5; // minutes after creation
      conditions: ['has_contact_info', 'not_auto_confirmed'];
    };
    meeting_updated: {
      delay: 2; // minutes after update
      conditions: ['time_changed', 'location_changed'];
    };
    reminder_schedule: {
      first_reminder: { days_before: 2 };
      final_reminder: { hours_before: 4 };
    };
  };
  
  // Communication flow
  communication_flow: {
    method_selection: {
      primary: 'whatsapp_if_available';
      fallback: 'email';
      emergency: 'phone';
    };
    
    language_detection: {
      contact_preference: ContactLanguagePreference;
      company_language: CompanyLanguageDetection;
      fallback: 'english';
    };
    
    template_selection: {
      formal_business: FormalBusinessTemplate;
      informal_friendly: InformalFriendlyTemplate;
      cultural_adaptation: CulturalAdaptationTemplate;
    };
  };
  
  // Response handling
  response_processing: {
    confirmation_keywords: ConfirmationKeywords;
    decline_keywords: DeclineKeywords;
    reschedule_requests: RescheduleRequests;
    auto_processing: AutoProcessingRules;
  };
}
```

### Expense Notification Automation
```typescript
interface ExpenseNotificationWorkflow {
  // Notification triggers
  notification_triggers: {
    expense_submitted: {
      recipients: ['expense_approver', 'finance_team'];
      template: 'expense_submitted';
      priority: 'normal';
    };
    
    expense_approved: {
      recipients: ['expense_submitter'];
      template: 'expense_approved';
      priority: 'normal';
    };
    
    reimbursement_due: {
      recipients: ['finance_team', 'employee_manager'];
      template: 'reimbursement_due';
      priority: 'high';
      conditions: ['due_within_3_days'];
    };
    
    reimbursement_overdue: {
      recipients: ['finance_manager', 'employee', 'employee_manager'];
      template: 'reimbursement_overdue';
      priority: 'urgent';
      escalation: true;
    };
  };
  
  // Batch notifications
  batch_notifications: {
    daily_finance_summary: DailyFinanceSummary;
    weekly_expense_report: WeeklyExpenseReport;
    monthly_analytics: MonthlyAnalytics;
  };
}
```

## 📤 Out of Office Automation

### Automatic OOO Management
```typescript
interface OutOfOfficeAutomation {
  // Automatic setup for Wolthers staff
  automatic_setup: {
    trigger: 'trip_confirmed_for_wolthers_staff';
    lead_time: 24; // hours before trip
    message_generation: {
      ai_powered: true;
      template_based: true;
      customizable: true;
    };
  };
  
  // Email system integration
  email_integration: {
    microsoft_365: {
      graph_api: MicrosoftGraphAPI;
      auto_reply_setup: AutoReplySetup;
      calendar_integration: CalendarIntegration;
    };
    
    gmail_workspace: {
      gmail_api: GmailAPI;
      vacation_responder: VacationResponder;
      filter_rules: FilterRules;
    };
    
    generic_imap: {
      imap_connection: IMAPConnection;
      auto_reply_rules: AutoReplyRules;
      forwarding_setup: ForwardingSetup;
    };
  };
  
  // Message templates
  ooo_templates: {
    business_travel: BusinessTravelTemplate;
    client_visit: ClientVisitTemplate;
    convention: ConventionTemplate;
    emergency_leave: EmergencyLeaveTemplate;
  };
}
```

### OOO Template Examples
```typescript
const oooTemplates = {
  business_travel_en: `
Subject: Out of Office - Business Travel

Thank you for your email. I am currently traveling for business and will have limited access to email.

Travel Dates: {{start_date}} - {{end_date}}
Expected Return: {{return_date}}

For urgent matters, please contact:
{{emergency_contact_name}}
Email: {{emergency_contact_email}}
Phone: {{emergency_contact_phone}}

I will respond to your message upon my return.

Best regards,
{{user_name}}
Wolthers & Associates
  `,
  
  business_travel_pt: `
Assunto: Ausente do Escritório - Viagem de Negócios

Obrigado pelo seu email. Estou atualmente em viagem de negócios e terei acesso limitado ao email.

Datas da Viagem: {{start_date}} - {{end_date}}
Retorno Previsto: {{return_date}}

Para assuntos urgentes, favor contatar:
{{emergency_contact_name}}
Email: {{emergency_contact_email}}
Telefone: {{emergency_contact_phone}}

Responderei sua mensagem assim que retornar.

Atenciosamente,
{{user_name}}
Wolthers & Associates
  `
};
```

## 📊 Communication Analytics

### Email Performance Tracking
```typescript
interface EmailAnalytics {
  // Delivery metrics
  delivery_metrics: {
    sent_count: number;
    delivered_count: number;
    bounce_count: number;
    delivery_rate: number;
    bounce_rate: number;
  };
  
  // Engagement metrics
  engagement_metrics: {
    open_count: number;
    click_count: number;
    reply_count: number;
    open_rate: number;
    click_rate: number;
    reply_rate: number;
  };
  
  // Template performance
  template_performance: {
    by_template: TemplatePerformanceAnalysis;
    by_language: LanguagePerformanceAnalysis;
    by_recipient_type: RecipientTypeAnalysis;
    optimization_suggestions: OptimizationSuggestions;
  };
  
  // Timing analysis
  timing_analysis: {
    best_send_times: BestSendTimeAnalysis;
    response_time_patterns: ResponseTimePatterns;
    timezone_effectiveness: TimezoneEffectiveness;
  };
}
```

### WhatsApp Analytics
```typescript
interface WhatsAppAnalytics {
  // Message delivery
  message_delivery: {
    sent_count: number;
    delivered_count: number;
    read_count: number;
    failed_count: number;
    delivery_rate: number;
  };
  
  // Response tracking
  response_tracking: {
    response_count: number;
    response_rate: number;
    average_response_time: number;
    confirmation_rate: number;
  };
  
  // Template effectiveness
  template_effectiveness: {
    by_template: TemplateEffectivenessAnalysis;
    by_contact_type: ContactTypeAnalysis;
    cultural_adaptation_success: CulturalAdaptationAnalysis;
  };
}
```

## 🔔 Notification Center

### Centralized Notification Management
```typescript
interface NotificationCenter {
  // Notification types
  notification_types: {
    real_time: RealTimeNotifications;
    scheduled: ScheduledNotifications;
    batch: BatchNotifications;
    emergency: EmergencyNotifications;
  };
  
  // Delivery channels
  delivery_channels: {
    email: EmailDelivery;
    whatsapp: WhatsAppDelivery;
    sms: SMSDelivery;
    in_app: InAppNotifications;
    push: PushNotifications;
  };
  
  // User preferences
  user_preferences: {
    channel_preferences: ChannelPreferences;
    frequency_settings: FrequencySettings;
    quiet_hours: QuietHoursSettings;
    emergency_overrides: EmergencyOverrides;
  };
  
  // Smart routing
  smart_routing: {
    urgency_based: UrgencyBasedRouting;
    availability_aware: AvailabilityAwareRouting;
    preference_based: PreferenceBasedRouting;
    fallback_logic: FallbackLogic;
  };
}
```

## 🎯 Implementation Steps

### Phase 1: Core Email System (Week 11)
1. Implement email service with Hostinger SMTP
2. Create template management system
3. Build email logging and tracking
4. Add basic notification workflows
5. Implement OTP and authentication emails

### Phase 2: Advanced Communication (Week 12)
1. Add WhatsApp Business API integration
2. Implement meeting confirmation automation
3. Build out-of-office automation
4. Create multi-language template system
5. Add response processing automation

### Phase 3: Analytics & Optimization (Week 13)
1. Implement email analytics and tracking
2. Add WhatsApp analytics
3. Build notification center
4. Create communication optimization
5. Add advanced workflow automation

## 🔧 API Endpoints

### Email Management APIs
```typescript
// POST /api/communication/email/send - Send email
// GET /api/communication/email/templates - List templates
// POST /api/communication/email/templates - Create template
// PUT /api/communication/email/templates/[id] - Update template
// DELETE /api/communication/email/templates/[id] - Delete template

// GET /api/communication/email/logs - Email delivery logs
// GET /api/communication/email/analytics - Email analytics
// POST /api/communication/email/test - Test email delivery
```

### WhatsApp APIs
```typescript
// POST /api/communication/whatsapp/send - Send WhatsApp message
// POST /api/communication/whatsapp/webhook - WhatsApp webhook
// GET /api/communication/whatsapp/templates - List templates
// POST /api/communication/whatsapp/templates - Create template
// GET /api/communication/whatsapp/analytics - WhatsApp analytics
```

### Out of Office APIs
```typescript
// GET /api/communication/ooo - List OOO messages
// POST /api/communication/ooo - Create OOO message
// PUT /api/communication/ooo/[id] - Update OOO message
// POST /api/communication/ooo/[id]/activate - Activate OOO
// POST /api/communication/ooo/[id]/deactivate - Deactivate OOO
```

### Notification APIs
```typescript
// POST /api/communication/notifications/send - Send notification
// GET /api/communication/notifications/preferences - User preferences
// PUT /api/communication/notifications/preferences - Update preferences
// GET /api/communication/notifications/history - Notification history
```

---
*Dependencies: Authentication (✅), Users (🎯), Meetings (🎯), AI (🎯)*