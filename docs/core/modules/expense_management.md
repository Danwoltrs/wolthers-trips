# Expense Management Module Specification

## 🎯 Overview
The expense management module handles multi-currency expense tracking, receipt processing, AI-powered OCR, client billing, and reimbursement workflows. It supports complex scenarios like trip branching, driver expenses, and finance department integration.

## 💰 Expense Categories & Types

### Expense Categories
```typescript
enum ExpenseCategory {
  ACCOMMODATION = 'accommodation',     // Hotels, lodging
  MEALS = 'meals',                    // Food, restaurants, business meals
  TRANSPORTATION = 'transportation',  // Flights, rental cars, trains
  FUEL = 'fuel',                     // Vehicle fuel costs
  PARKING = 'parking',               // Parking fees, tolls
  ENTERTAINMENT = 'entertainment',    // Client entertainment
  COMMUNICATIONS = 'communications',  // Phone, internet
  OFFICE_SUPPLIES = 'office_supplies', // Business supplies
  PROFESSIONAL_SERVICES = 'professional_services', // Legal, consulting
  OTHER = 'other'                    // Miscellaneous expenses
}
```

### Payment Methods
```typescript
enum CardType {
  PERSONAL = 'personal',              // Personal credit cards (require reimbursement)
  COMPANY = 'company',               // Company credit cards
  CORPORATE_AMEX = 'corporate_amex', // Corporate American Express
  PROCUREMENT_CARD = 'procurement_card', // Procurement/purchasing cards
  TRAVEL_CARD = 'travel_card'        // Dedicated travel cards
}
```

## 🗄️ Database Schema

### Expenses Table
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  usd_amount DECIMAL(10,2), -- Auto-converted for reporting
  exchange_rate DECIMAL(8,4),
  exchange_rate_date DATE,
  category expense_category_enum NOT NULL,
  description TEXT,
  receipt_url TEXT,
  card_id UUID REFERENCES payment_cards(id),
  merchant_name VARCHAR(255),
  transaction_date TIMESTAMP WITH TIME ZONE,
  ai_extracted_data JSONB DEFAULT '{}',
  approval_status approval_status_enum DEFAULT 'pending',
  billing_status billing_status_enum DEFAULT 'internal',
  client_billable BOOLEAN DEFAULT FALSE,
  client_billed_to UUID REFERENCES companies(id),
  invoice_reference VARCHAR(255),
  reimbursement_status reimbursement_status_enum DEFAULT 'pending',
  reimbursement_amount DECIMAL(10,2), -- Amount in original currency
  reimbursement_currency VARCHAR(3), -- Currency for reimbursement
  currency_conversion_requested BOOLEAN DEFAULT FALSE,
  converted_amount DECIMAL(10,2), -- If conversion requested
  converted_currency VARCHAR(3), -- Target currency if conversion
  reimbursement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Payment Cards Table
```sql
CREATE TABLE payment_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  last_four_digits VARCHAR(4) NOT NULL,
  card_holder_name VARCHAR(255) NOT NULL,
  card_type card_type_enum NOT NULL,
  card_brand VARCHAR(50), -- Visa, Mastercard, Amex, etc.
  card_currency VARCHAR(3) DEFAULT 'USD', -- Primary card currency
  due_date INTEGER CHECK (due_date >= 1 AND due_date <= 31), -- Day of month
  billing_cycle_start INTEGER CHECK (billing_cycle_start >= 1 AND billing_cycle_start <= 31),
  preferred_reimbursement_currency VARCHAR(3), -- User's preferred currency
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🏗️ Component Architecture

### Expense Management Pages
```
/expenses/
├── page.tsx                    # Expense dashboard
├── create/
│   └── page.tsx               # Manual expense creation
├── [id]/
│   ├── page.tsx               # Expense details
│   ├── edit/
│   │   └── page.tsx           # Edit expense
│   └── receipt/
│       └── page.tsx           # Receipt viewer/uploader

/trips/[id]/expenses/
├── page.tsx                   # Trip expense summary
├── create/
│   └── page.tsx               # Add expense to trip
└── bulk/
    └── page.tsx               # Bulk expense operations

/profile/cards/
├── page.tsx                   # Payment card management
├── create/
│   └── page.tsx               # Add new card
└── [cardId]/
    ├── page.tsx               # Card details
    └── edit/
        └── page.tsx           # Edit card details
```

### Component Structure
```typescript
ExpenseManagement
├── ExpenseList
│   ├── ExpenseTable
│   ├── ExpenseCards
│   ├── ExpenseFilters
│   └── BulkActions
├── ExpenseForm
│   ├── BasicDetails
│   ├── ReceiptUpload
│   ├── PaymentCardSelector
│   ├── CategorySelector
│   └── ClientBillingOptions
├── ReceiptProcessor
│   ├── ReceiptScanner
│   ├── OCRExtraction
│   ├── DataValidation
│   └── ManualCorrection
├── PaymentCardManagement
│   ├── CardList
│   ├── CardForm
│   ├── DueDateTracking
│   └── ReimbursementSettings
└── CurrencyManager
    ├── ExchangeRates
    ├── ConversionOptions
    ├── PreferenceSettings
    └── ReimbursementCalculator
```

## 📱 AI-Powered Receipt Processing

### OCR Integration
```typescript
interface ReceiptOCR {
  // Claude Vision API integration
  claude_processing: {
    image_formats: ['jpeg', 'png', 'webp', 'pdf'];
    max_file_size: '50MB';
    processing_time: '2-5 seconds';
    accuracy_rate: '95%+';
  };
  
  // Data extraction capabilities
  extraction_fields: {
    amount: number;
    currency: string;
    merchant_name: string;
    transaction_date: Date;
    payment_method: string;
    card_last_four: string;
    tax_amount?: number;
    tip_amount?: number;
    category_suggestion: ExpenseCategory;
  };
  
  // Validation and correction
  validation: {
    amount_verification: boolean;
    date_validation: boolean;
    merchant_verification: boolean;
    duplicate_detection: boolean;
    fraud_detection: boolean;
  };
}
```

### Receipt Processing Workflow
```typescript
interface ReceiptProcessingWorkflow {
  // Upload and initial processing
  upload: {
    drag_drop_interface: boolean;
    camera_capture: boolean;
    bulk_upload: boolean;
    progress_tracking: boolean;
  };
  
  // AI extraction
  ai_processing: {
    automatic_extraction: boolean;
    confidence_scoring: boolean;
    manual_review_threshold: 0.85;
    batch_processing: boolean;
  };
  
  // User validation
  user_validation: {
    extracted_data_review: boolean;
    manual_corrections: boolean;
    approval_workflow: boolean;
    save_as_draft: boolean;
  };
  
  // Final processing
  finalization: {
    expense_creation: boolean;
    receipt_storage: boolean;
    notification_sending: boolean;
    integration_updates: boolean;
  };
}
```

## 💱 Multi-Currency Support

### Currency Management
```typescript
interface CurrencySystem {
  // Supported currencies
  supported_currencies: ['USD', 'BRL', 'EUR', 'GBP', 'CAD', 'MXN', 'COP', 'PEN'];
  
  // Exchange rate handling
  exchange_rates: {
    provider: 'exchangerate-api' | 'fixer.io' | 'currencylayer';
    update_frequency: 'daily';
    historical_rates: boolean;
    rate_caching: boolean;
  };
  
  // Reimbursement logic
  reimbursement_preferences: {
    default_behavior: 'original_currency'; // BRL → BRL, USD → USD
    conversion_option: 'user_choice';
    rate_display: 'always_show';
    fee_consideration: boolean;
  };
}
```

### Currency Conversion Workflow
```typescript
interface CurrencyConversion {
  // User preference capture
  preference_system: {
    home_currency: string;
    auto_conversion: boolean;
    conversion_threshold: number;
    rate_tolerance: number;
  };
  
  // Conversion options
  conversion_options: {
    original_currency: {
      description: 'Reimburse in original expense currency';
      default: true;
      pros: ['No conversion fees', 'Exact amount'];
      cons: ['Multiple currency payments'];
    };
    
    home_currency: {
      description: 'Convert to your preferred currency';
      requires_approval: boolean;
      shows_rate: boolean;
      shows_fees: boolean;
    };
  };
  
  // Rate calculation
  rate_calculation: {
    real_time_rates: boolean;
    rate_locking: boolean;
    conversion_fees: FeeCalculation;
    margin_calculation: MarginCalculation;
  };
}
```

## 💳 Payment Card Management

### Card Registration & Tracking
```typescript
interface PaymentCardManagement {
  // Card registration
  registration: {
    card_details: CardDetailsForm;
    verification: CardVerification;
    due_date_setup: DueDateConfiguration;
    reimbursement_preferences: ReimbursementPreferences;
  };
  
  // Due date tracking
  due_date_management: {
    calendar_integration: boolean;
    reminder_system: ReminderConfiguration;
    urgency_calculation: UrgencyCalculation;
    finance_notifications: FinanceNotificationSystem;
  };
  
  // Reimbursement optimization
  reimbursement_optimization: {
    due_date_prioritization: boolean;
    currency_grouping: boolean;
    batch_processing: boolean;
    payment_scheduling: PaymentScheduling;
  };
}
```

### Due Date Priority System
```typescript
interface DueDatePriority {
  // Priority calculation
  priority_levels: {
    critical: {
      days_until_due: 1;
      color: 'red';
      action: 'immediate_processing';
    };
    urgent: {
      days_until_due: 3;
      color: 'orange';
      action: 'priority_queue';
    };
    high: {
      days_until_due: 7;
      color: 'yellow';
      action: 'expedited_processing';
    };
    normal: {
      days_until_due: 14;
      color: 'green';
      action: 'standard_processing';
    };
  };
  
  // Automated workflows
  automation: {
    finance_alerts: FinanceAlertSystem;
    employee_notifications: EmployeeNotificationSystem;
    escalation_procedures: EscalationProcedures;
    batch_optimization: BatchOptimization;
  };
}
```

## 🏢 Client Billing Integration

### Billable Expense Management
```typescript
interface ClientBilling {
  // Billable designation
  billing_designation: {
    automatic_rules: AutomaticBillingRules;
    manual_assignment: ManualBillingAssignment;
    client_specific_rules: ClientSpecificRules;
    category_defaults: CategoryDefaults;
  };
  
  // Client assignment
  client_assignment: {
    trip_based: boolean;
    meeting_based: boolean;
    manual_override: boolean;
    multiple_clients: boolean; // For shared expenses
  };
  
  // Invoice preparation
  invoice_preparation: {
    expense_aggregation: ExpenseAggregation;
    supporting_documents: SupportingDocuments;
    currency_handling: ClientCurrencyHandling;
    markup_calculation: MarkupCalculation;
  };
}
```

### Invoice Data Export
```typescript
interface InvoiceDataExport {
  // Export formats
  formats: {
    accounting_software: QuickBooksFormat | XeroFormat | SAPFormat;
    spreadsheet: ExcelFormat | CSVFormat;
    pdf_report: PDFReportFormat;
    json_api: JSONAPIFormat;
  };
  
  // Data structure
  invoice_structure: {
    header: InvoiceHeader;
    line_items: InvoiceLineItem[];
    totals: InvoiceTotals;
    supporting_docs: SupportingDocumentList;
  };
  
  // Client customization
  client_customization: {
    custom_fields: CustomFieldMapping;
    branding: ClientBrandingOptions;
    language: InvoiceLanguageOptions;
    currency_display: CurrencyDisplayOptions;
  };
}
```

## 📊 Expense Analytics & Reporting

### Expense Metrics
```typescript
interface ExpenseMetrics {
  // Basic statistics
  basic_stats: {
    total_expenses: number;
    pending_approval: number;
    pending_reimbursement: number;
    average_expense: number;
  };
  
  // Category breakdown
  category_analysis: {
    by_category: Record<ExpenseCategory, number>;
    by_trip_type: Record<TripType, number>;
    by_currency: Record<string, number>;
    by_payment_method: Record<CardType, number>;
  };
  
  // Time-based analysis
  temporal_analysis: {
    monthly_trends: MonthlyTrend[];
    seasonal_patterns: SeasonalPattern[];
    day_of_week_patterns: DayOfWeekPattern[];
    time_to_submission: TimeToSubmission;
  };
  
  // Financial analysis
  financial_analysis: {
    reimbursement_timing: ReimbursementTiming;
    currency_impact: CurrencyImpact;
    client_billing_revenue: ClientBillingRevenue;
    cost_per_trip: CostPerTrip;
  };
}
```

### Expense Reports
```typescript
interface ExpenseReport {
  type: 'expense_summary' | 'reimbursement_report' | 'client_billing' | 'audit_trail';
  
  filters: {
    date_range: DateRange;
    trip_ids: string[];
    user_ids: string[];
    categories: ExpenseCategory[];
    currencies: string[];
    approval_status: ApprovalStatus[];
    billing_status: BillingStatus[];
  };
  
  grouping: {
    by_user: boolean;
    by_trip: boolean;
    by_category: boolean;
    by_currency: boolean;
    by_client: boolean;
  };
  
  format: 'pdf' | 'excel' | 'csv' | 'json';
  
  sections: {
    summary: boolean;
    detailed_expenses: boolean;
    receipt_attachments: boolean;
    approval_history: boolean;
    currency_breakdown: boolean;
  };
}
```

## 🚗 Driver Expense Integration

### Driver-Specific Expenses
```typescript
interface DriverExpenses {
  // Vehicle-related expenses
  vehicle_expenses: {
    fuel: FuelExpenseTracking;
    maintenance: MaintenanceExpenseTracking;
    car_wash: CarWashExpenseTracking;
    parking: ParkingExpenseTracking;
    tolls: TollExpenseTracking;
  };
  
  // Integration with vehicle logs
  vehicle_log_integration: {
    odometer_correlation: OdometerCorrelation;
    fuel_efficiency_calculation: FuelEfficiencyCalculation;
    route_validation: RouteValidation;
    mileage_reimbursement: MileageReimbursement;
  };
  
  // Driver accountability
  driver_accountability: {
    expense_approval_workflow: DriverApprovalWorkflow;
    receipt_requirements: ReceiptRequirements;
    spending_limits: SpendingLimits;
    performance_tracking: PerformanceTracking;
  };
}
```

## 🎯 Implementation Steps

### Phase 1: Basic Expense Management (Week 7)
1. Create expense CRUD operations
2. Implement payment card management
3. Build receipt upload and basic OCR
4. Add expense categorization
5. Create expense list and filtering

### Phase 2: Advanced Features (Week 8)
1. Implement AI-powered OCR with Claude
2. Add multi-currency support
3. Build client billing designation
4. Create reimbursement workflows
5. Add due date tracking and prioritization

### Phase 3: Integration & Analytics (Week 9)
1. Integrate with finance department workflows
2. Build expense analytics dashboard
3. Create reporting and export functionality
4. Add driver expense integration
5. Implement audit trails and compliance

## 🔧 API Endpoints

### Expense CRUD Operations
```typescript
// GET /api/expenses - List expenses with filters
// POST /api/expenses - Create new expense
// GET /api/expenses/[id] - Get expense details
// PUT /api/expenses/[id] - Update expense
// DELETE /api/expenses/[id] - Delete expense

// POST /api/expenses/[id]/receipt - Upload receipt
// GET /api/expenses/[id]/receipt - Get receipt URL
// POST /api/expenses/[id]/approve - Approve expense
// POST /api/expenses/[id]/reject - Reject expense

// GET /api/expenses/analytics - Expense analytics
// POST /api/expenses/export - Export expenses
// GET /api/expenses/currencies - Get exchange rates
```

### OCR and Processing APIs
```typescript
// POST /api/ocr/process-receipt - Process receipt with AI
// GET /api/ocr/[processingId]/status - Get processing status
// POST /api/ocr/[processingId]/validate - Validate extracted data
// POST /api/ocr/batch - Batch process multiple receipts
```

### Payment Card APIs
```typescript
// GET /api/payment-cards - List user's payment cards
// POST /api/payment-cards - Add new payment card
// PUT /api/payment-cards/[id] - Update payment card
// DELETE /api/payment-cards/[id] - Delete payment card
// GET /api/payment-cards/due-dates - Get upcoming due dates
```

---
*Next Phase: Finance Department Module*  
*Dependencies: Authentication (✅), Users (🎯), Trips (🎯), Expenses (🎯)*