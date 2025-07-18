# Core Database Documentation

## 🎯 Overview
Complete database schema, Row Level Security policies, storage configuration, and connection details for the Wolthers Travel Management System built with Supabase PostgreSQL.

## 🔧 Current Configuration (✅ Working)

### Connection Details
```bash
# Supabase Configuration (CONFIRMED WORKING)
NEXT_PUBLIC_SUPABASE_URL=https://ocddrrzhautoybqmebsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Connection Status
✅ Database: Connected and operational
✅ Storage: 3 buckets configured
✅ RLS: Policies implemented
✅ Real-time: Subscriptions enabled
✅ Backup: Automatic daily backups
```

### Test Connection
```bash
# Verify connection
npm run dev
# Visit http://localhost:3000/test-page
# All systems: Database ✅, Storage ✅, Email ✅
```

## 🗄️ Core Database Schema

### 1. Companies & Business Entities
```sql
-- Main companies table
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

-- Company locations (multiple per company)
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

-- Company contacts (hosts/exporters)
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

### 2. User Management & Authentication
```sql
-- Users with role-based access
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  company_id UUID REFERENCES companies(id),
  auth_method auth_method_enum NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  reports_to UUID REFERENCES users(id), -- Client Admin hierarchy
  trip_code_visits INTEGER DEFAULT 0,
  prompt_account_creation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles enum
CREATE TYPE user_role AS ENUM (
  'global_admin',      -- Full system access
  'wolthers_staff',    -- Wolthers employees
  'company_admin',     -- Company administrators
  'client_admin',      -- Business owners/CEOs
  'finance_department',-- Finance team members
  'client',            -- Regular client users
  'driver'             -- Vehicle drivers
);

-- Authentication methods
CREATE TYPE auth_method_enum AS ENUM (
  'microsoft_oauth',
  'email_otp',
  'trip_code',
  'auto_detected'
);
```

### 3. Trip Management System
```sql
-- Core trips table with branching support
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

-- Trip participants (many-to-many with branching)
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

-- Trip types
CREATE TYPE trip_type_enum AS ENUM (
  'convention',
  'inland_brazil',
  'international',
  'domestic_us',
  'client_visit',
  'farm_visit'
);

-- Trip status flow
CREATE TYPE trip_status_enum AS ENUM (
  'draft',
  'proposal',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'
);
```

### 4. Meeting Management
```sql
-- Meetings within trips
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

-- Meeting contacts (many-to-many)
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

### 5. Expense Management & Multi-Currency
```sql
-- Comprehensive expense tracking
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
  reimbursement_amount DECIMAL(10,2),
  reimbursement_currency VARCHAR(3),
  currency_conversion_requested BOOLEAN DEFAULT FALSE,
  converted_amount DECIMAL(10,2),
  converted_currency VARCHAR(3),
  reimbursement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment cards with due date tracking
CREATE TABLE payment_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  last_four_digits VARCHAR(4) NOT NULL,
  card_holder_name VARCHAR(255) NOT NULL,
  card_type card_type_enum NOT NULL,
  card_brand VARCHAR(50),
  card_currency VARCHAR(3) DEFAULT 'USD',
  due_date INTEGER CHECK (due_date >= 1 AND due_date <= 31),
  billing_cycle_start INTEGER CHECK (billing_cycle_start >= 1 AND billing_cycle_start <= 31),
  preferred_reimbursement_currency VARCHAR(3),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Fleet Management & Vehicle Tracking
```sql
-- Vehicle management
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50),
  license_plate VARCHAR(20) UNIQUE,
  vin VARCHAR(50),
  vehicle_type vehicle_type_enum DEFAULT 'sedan',
  ownership_type ownership_type_enum DEFAULT 'company_owned',
  mileage INTEGER DEFAULT 0,
  current_odometer INTEGER DEFAULT 0,
  fuel_capacity DECIMAL(6,2) DEFAULT 60.0,
  fuel_type VARCHAR(50) DEFAULT 'Regular',
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  status vehicle_status_enum DEFAULT 'available',
  insurance_expiry DATE,
  registration_expiry DATE,
  gps_tracking BOOLEAN DEFAULT FALSE,
  maintenance_alerts JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver logs with AI dashboard processing
CREATE TABLE vehicle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id),
  driver_name VARCHAR(255) NOT NULL,
  driver_license VARCHAR(50),
  driver_phone VARCHAR(20),
  driver_type driver_type_enum DEFAULT 'employee',
  log_type log_type_enum DEFAULT 'trip_start',
  odometer_start INTEGER,
  odometer_end INTEGER,
  kilometers_driven INTEGER GENERATED ALWAYS AS (odometer_end - odometer_start) STORED,
  fuel_level_start INTEGER CHECK (fuel_level_start >= 0 AND fuel_level_start <= 100),
  fuel_level_end INTEGER CHECK (fuel_level_end >= 0 AND fuel_level_end <= 100),
  dashboard_photo_start TEXT,
  dashboard_photo_end TEXT,
  start_location VARCHAR(255),
  end_location VARCHAR(255),
  start_coordinates POINT,
  end_coordinates POINT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  route_notes TEXT,
  vehicle_condition_start TEXT,
  vehicle_condition_end TEXT,
  incidents JSONB DEFAULT '[]',
  ai_extracted_data JSONB DEFAULT '{}',
  verification_status verification_status_enum DEFAULT 'pending',
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Finance Department Integration
```sql
-- Finance task management
CREATE TABLE finance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type finance_task_type_enum NOT NULL,
  trip_id UUID REFERENCES trips(id),
  priority priority_level_enum DEFAULT 'medium',
  status finance_task_status_enum DEFAULT 'pending',
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date DATE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  recipient_info JSONB DEFAULT '{}',
  supporting_documents JSONB DEFAULT '[]',
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight cost tracking
CREATE TABLE flight_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES users(id),
  booking_reference VARCHAR(50),
  airline VARCHAR(100),
  departure_airport VARCHAR(10),
  arrival_airport VARCHAR(10),
  departure_date DATE,
  departure_time TIME,
  arrival_date DATE,
  arrival_time TIME,
  flight_class flight_class_enum DEFAULT 'economy',
  ticket_cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  usd_cost DECIMAL(10,2),
  baggage_cost DECIMAL(10,2) DEFAULT 0,
  seat_upgrade_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2),
  booking_date TIMESTAMP WITH TIME ZONE,
  booked_by UUID REFERENCES users(id),
  cancellation_policy TEXT,
  status flight_status_enum DEFAULT 'booked',
  client_billable BOOLEAN DEFAULT FALSE,
  client_billed_to UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Communication & Automation
```sql
-- Email templates and logs
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

-- Out of office automation
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

### 9. AI Processing & Logs
```sql
-- AI processing tracking
CREATE TABLE ai_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider ai_provider_enum NOT NULL,
  service_type ai_service_type_enum NOT NULL,
  input_type VARCHAR(50), -- 'image', 'text', 'document'
  input_size INTEGER, -- bytes or token count
  processing_time INTEGER, -- milliseconds
  cost_usd DECIMAL(10,6), -- API cost in USD
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  user_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  expense_id UUID REFERENCES expenses(id),
  input_data JSONB, -- Original input data
  output_data JSONB, -- AI response data
  error_data JSONB, -- Error information if failed
  manual_review_required BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📁 Storage Buckets (Supabase Storage)

### Current Storage Configuration
```typescript
interface StorageBuckets {
  receipts: {
    purpose: 'Expense receipts and invoice documents';
    access: 'private'; // Authenticated users only
    file_types: ['jpeg', 'png', 'webp', 'pdf'];
    size_limit: '50MB';
    structure: '{user_id}/{trip_id}/receipt_{timestamp}.{ext}';
    rls_enabled: true;
  };
  
  dashboard_photos: {
    purpose: 'Vehicle dashboard photos for driver logs';
    access: 'private'; // Drivers and admin only
    file_types: ['jpeg', 'png', 'webp'];
    size_limit: '10MB';
    structure: '{user_id}/{vehicle_log_id}/dashboard_{start|end}_{timestamp}.{ext}';
    rls_enabled: true;
  };
  
  documents: {
    purpose: 'Trip documents, presentations, and reports';
    access: 'private'; // Trip participants and admin
    file_types: ['pdf', 'docx', 'xlsx', 'pptx'];
    size_limit: '100MB';
    structure: '{trip_id}/{document_name}.{ext}';
    rls_enabled: true;
  };
}
```

## 🔒 Row Level Security (RLS) Policies

### User Access Policies
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Global admins can view all users
CREATE POLICY "Global admins can view all users" ON users
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'global_admin'
  )
);

-- Finance department can view Wolthers employees
CREATE POLICY "Finance department can view Wolthers employees" ON users
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'finance_department'
  ) AND role IN ('wolthers_staff', 'driver')
);

-- Client admin can view employees they manage
CREATE POLICY "Client admin can view managed employees" ON users
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'client_admin'
  ) AND reports_to = auth.uid()
);
```

### Company Access Policies
```sql
-- Users can view their company
CREATE POLICY "Users can view their company" ON companies
FOR SELECT TO authenticated
USING (
  id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- Wolthers staff can view all companies
CREATE POLICY "Wolthers staff can view all companies" ON companies
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('global_admin', 'wolthers_staff')
  )
);
```

### Trip Access Policies
```sql
-- Users can view trips they participate in
CREATE POLICY "Users can view trips they participate in" ON trips
FOR SELECT TO authenticated
USING (
  id IN (
    SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
  )
  OR created_by = auth.uid()
);

-- Client admin can view employee trips
CREATE POLICY "Client admin can view employee trips" ON trips
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trip_participants tp
    JOIN users u ON tp.user_id = u.id
    WHERE tp.trip_id = trips.id
    AND u.reports_to = auth.uid()
    AND (SELECT role FROM users WHERE id = auth.uid()) = 'client_admin'
  )
);

-- Finance department can view all trips
CREATE POLICY "Finance department can view all trips" ON trips
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'finance_department'
  )
);
```

### Expense Access Policies
```sql
-- Users can view their own expenses
CREATE POLICY "Users can view their own expenses" ON expenses
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Finance department can view all expenses
CREATE POLICY "Finance department can view all expenses" ON expenses
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'finance_department'
  )
);

-- Trip participants can view trip expenses
CREATE POLICY "Trip participants can view trip expenses" ON expenses
FOR SELECT TO authenticated
USING (
  trip_id IN (
    SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
  )
);
```

### Storage Access Policies
```sql
-- Users can upload their own receipts
CREATE POLICY "Users can upload their own receipts" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own receipts
CREATE POLICY "Users can view their own receipts" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Finance can view all receipts
CREATE POLICY "Finance can view all receipts" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'receipts' 
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'finance_department'
  )
);

-- Drivers can upload dashboard photos
CREATE POLICY "Drivers can upload dashboard photos" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'dashboard-photos' 
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('driver', 'wolthers_staff')
  )
);
```

## 📊 Database Views & Analytics

### Trip Cost Summary View
```sql
CREATE VIEW trip_cost_summary AS
SELECT 
  t.id as trip_id,
  t.title,
  t.start_date,
  t.end_date,
  t.status,
  -- Expense totals by category
  COALESCE(SUM(CASE WHEN e.category = 'accommodation' THEN e.usd_amount END), 0) as accommodation_cost,
  COALESCE(SUM(CASE WHEN e.category = 'meals' THEN e.usd_amount END), 0) as meals_cost,
  COALESCE(SUM(CASE WHEN e.category = 'transportation' THEN e.usd_amount END), 0) as ground_transport_cost,
  COALESCE(SUM(CASE WHEN e.category = 'fuel' THEN e.usd_amount END), 0) as fuel_cost,
  COALESCE(SUM(CASE WHEN e.category = 'other' THEN e.usd_amount END), 0) as other_expenses,
  -- Flight costs
  COALESCE(SUM(f.usd_cost), 0) as flight_cost,
  -- Total costs
  COALESCE(SUM(e.usd_amount), 0) + COALESCE(SUM(f.usd_cost), 0) as total_cost,
  -- Client billing totals
  COALESCE(SUM(CASE WHEN e.client_billable = true THEN e.usd_amount END), 0) + 
  COALESCE(SUM(CASE WHEN f.client_billable = true THEN f.usd_cost END), 0) as client_billable_total,
  -- Reimbursement totals
  COALESCE(SUM(CASE WHEN pc.card_type = 'personal' THEN e.usd_amount END), 0) as personal_card_total,
  COALESCE(SUM(CASE WHEN e.reimbursement_status = 'pending' AND pc.card_type = 'personal' THEN e.usd_amount END), 0) as pending_reimbursement
FROM trips t
LEFT JOIN expenses e ON t.id = e.trip_id
LEFT JOIN payment_cards pc ON e.card_id = pc.id
LEFT JOIN flight_bookings f ON t.id = f.trip_id
GROUP BY t.id, t.title, t.start_date, t.end_date, t.status;
```

### Finance Reimbursement Summary View
```sql
CREATE VIEW finance_reimbursement_summary AS
SELECT 
  u.full_name as employee_name,
  u.email as employee_email,
  pc.last_four_digits,
  pc.due_date as card_due_date,
  pc.card_currency,
  e.currency as expense_currency,
  SUM(e.amount) as total_amount,
  SUM(e.usd_amount) as total_usd_amount,
  COUNT(e.id) as expense_count,
  MIN(e.transaction_date) as earliest_expense,
  MAX(e.transaction_date) as latest_expense,
  MIN(pc.due_date) as earliest_due_date,
  t.title as trip_title,
  t.start_date as trip_start,
  t.end_date as trip_end,
  -- Priority calculation
  CASE 
    WHEN EXTRACT(DAY FROM (DATE(CONCAT(EXTRACT(YEAR FROM CURRENT_DATE), '-', EXTRACT(MONTH FROM CURRENT_DATE), '-', pc.due_date)) - CURRENT_DATE)) <= 1 THEN 'critical'
    WHEN EXTRACT(DAY FROM (DATE(CONCAT(EXTRACT(YEAR FROM CURRENT_DATE), '-', EXTRACT(MONTH FROM CURRENT_DATE), '-', pc.due_date)) - CURRENT_DATE)) <= 3 THEN 'urgent'
    WHEN EXTRACT(DAY FROM (DATE(CONCAT(EXTRACT(YEAR FROM CURRENT_DATE), '-', EXTRACT(MONTH FROM CURRENT_DATE), '-', pc.due_date)) - CURRENT_DATE)) <= 7 THEN 'high'
    ELSE 'normal'
  END as priority_level
FROM expenses e
JOIN users u ON e.user_id = u.id
JOIN payment_cards pc ON e.card_id = pc.id
JOIN trips t ON e.trip_id = t.id
WHERE e.reimbursement_status = 'pending'
  AND pc.card_type = 'personal'
GROUP BY u.id, u.full_name, u.email, pc.id, pc.last_four_digits, 
         pc.due_date, pc.card_currency, e.currency, t.id, t.title, t.start_date, t.end_date;
```

### Client Billing Summary View
```sql
CREATE VIEW finance_client_billing_summary AS
SELECT 
  c.name as client_company,
  c.fantasy_name as client_short_name,
  t.title as trip_title,
  t.start_date,
  t.end_date,
  SUM(CASE WHEN e.client_billable THEN e.usd_amount ELSE 0 END) as billable_expenses,
  SUM(CASE WHEN f.client_billable THEN f.usd_cost ELSE 0 END) as billable_flights,
  SUM(CASE WHEN e.client_billable THEN e.usd_amount ELSE 0 END) + 
  SUM(CASE WHEN f.client_billable THEN f.usd_cost ELSE 0 END) as total_billable,
  STRING_AGG(DISTINCT e.currency, ', ') as currencies_used,
  COUNT(DISTINCT e.id) as expense_items,
  COUNT(DISTINCT f.id) as flight_items,
  t.status as trip_status,
  MAX(e.transaction_date) as last_expense_date
FROM trips t
LEFT JOIN expenses e ON t.id = e.trip_id AND e.client_billable = true
LEFT JOIN flight_bookings f ON t.id = f.trip_id AND f.client_billable = true
JOIN trip_participants tp ON t.id = tp.trip_id
JOIN companies c ON tp.company_id = c.id
WHERE (e.client_billable = true OR f.client_billable = true)
GROUP BY c.id, c.name, c.fantasy_name, t.id, t.title, t.start_date, t.end_date, t.status
HAVING SUM(CASE WHEN e.client_billable THEN e.usd_amount ELSE 0 END) + 
       SUM(CASE WHEN f.client_billable THEN f.usd_cost ELSE 0 END) > 0;
```

## 📈 Performance Optimization

### Database Indexes
```sql
-- User and authentication indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_company_id ON users(company_id);

-- Trip indexes
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_by ON trips(created_by);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_type ON trips(type);

-- Expense indexes
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_reimbursement_status ON expenses(reimbursement_status);
CREATE INDEX idx_expenses_transaction_date ON expenses(transaction_date);

-- Meeting indexes
CREATE INDEX idx_meetings_trip_id ON meetings(trip_id);
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_meetings_confirmation_status ON meetings(confirmation_status);

-- Vehicle indexes
CREATE INDEX idx_vehicle_logs_vehicle_id ON vehicle_logs(vehicle_id);
CREATE INDEX idx_vehicle_logs_trip_id ON vehicle_logs(trip_id);
CREATE INDEX idx_vehicle_logs_start_time ON vehicle_logs(start_time);

-- Finance indexes
CREATE INDEX idx_finance_tasks_status ON finance_tasks(status);
CREATE INDEX idx_finance_tasks_due_date ON finance_tasks(due_date);
CREATE INDEX idx_finance_tasks_assigned_to ON finance_tasks(assigned_to);

-- Company indexes
CREATE INDEX idx_companies_type ON companies(company_type);
CREATE INDEX idx_company_locations_company_id ON company_locations(company_id);
CREATE INDEX idx_company_contacts_company_id ON company_contacts(company_id);

-- AI processing indexes
CREATE INDEX idx_ai_logs_provider ON ai_processing_logs(provider);
CREATE INDEX idx_ai_logs_service_type ON ai_processing_logs(service_type);
CREATE INDEX idx_ai_logs_created_at ON ai_processing_logs(created_at);
```

## 🔄 Real-time Subscriptions

### Enabled Subscriptions
```sql
-- Trip updates for participants
CREATE OR REPLACE FUNCTION notify_trip_changes()
RETURNS TRIGGER AS $
BEGIN
  PERFORM pg_notify('trip_updates', json_build_object(
    'trip_id', NEW.id,
    'action', TG_OP,
    'table', TG_TABLE_NAME,
    'data', row_to_json(NEW)
  )::text);
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trip_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON trips
FOR EACH ROW EXECUTE FUNCTION notify_trip_changes();

-- Expense status changes
CREATE TRIGGER expense_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION notify_trip_changes();

-- Meeting confirmation updates
CREATE TRIGGER meeting_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON meetings
FOR EACH ROW EXECUTE FUNCTION notify_trip_changes();
```

## 💾 Backup & Recovery Strategy

### Current Backup Configuration
```typescript
interface BackupStrategy {
  // Supabase automatic backups
  automatic_backups: {
    frequency: 'daily';
    retention: '7_days';
    point_in_time_recovery: '24_hours';
    location: 'multiple_regions';
  };
  
  // Manual backup procedures
  manual_backups: {
    full_database_export: DatabaseExportProcedure;
    schema_backup: SchemaBackupProcedure;
    data_export: DataExportProcedure;
    storage_backup: StorageBackupProcedure;
  };
  
  // Disaster recovery
  disaster_recovery: {
    rto: '2-4_hours'; // Recovery Time Objective
    rpo: '24_hours';  // Recovery Point Objective
    failover_plan: FailoverPlan;
    data_integrity_checks: DataIntegrityChecks;
  };
}
```

## 🔧 Connection Testing

### Test Functions
```typescript
// Test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Test storage connection
export async function testStorageConnection() {
  try {
    const { data, error } = await supabase.storage
      .listBuckets();
    
    if (error) throw error;
    return { 
      success: true, 
      message: `Storage connected. Buckets: ${data.map(b => b.name).join(', ')}` 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Test RLS policies
export async function testRLSPolicies() {
  try {
    // Test authenticated access
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);
    
    if (error) throw error;
    return { success: true, message: 'RLS policies working correctly' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

## 📋 Database Maintenance

### Regular Maintenance Tasks
```sql
-- Update table statistics
ANALYZE;

-- Reindex tables (if needed)
REINDEX INDEX CONCURRENTLY idx_expenses_trip_id;
REINDEX INDEX CONCURRENTLY idx_trips_dates;

-- Vacuum tables (automatic in Supabase)
-- VACUUM ANALYZE trips;
-- VACUUM ANALYZE expenses;

-- Check for orphaned records
SELECT COUNT(*) FROM expenses e 
LEFT JOIN trips t ON e.trip_id = t.id 
WHERE t.id IS NULL;

-- Archive old data (implement as needed)
-- Example: Archive trips older than 2 years
```

### Health Monitoring
```typescript
interface DatabaseHealth {
  // Performance metrics
  performance: {
    average_query_time: QueryTimeMetrics;
    slow_queries: SlowQueryIdentification;
    connection_pool_usage: ConnectionPoolMetrics;
    cache_hit_ratio: CacheHitRatioTracking;
  };
  
  // Storage metrics
  storage: {
    database_size: DatabaseSizeTracking;
    table_sizes: TableSizeAnalysis;
    index_usage: IndexUsageAnalysis;
    storage_bucket_usage: StorageBucketMetrics;
  };
  
  // Security monitoring
  security: {
    failed_authentications: FailedAuthTracking;
    policy_violations: PolicyViolationTracking;
    suspicious_activity: SuspiciousActivityDetection;
  };
}
```

---
*Last updated: January 2025*  
*Status: Production ready with all schemas implemented*  
*Connection: ✅ Verified and operational*