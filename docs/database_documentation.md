# Wolthers Travel App - Database & Storage Documentation

## Overview
This document describes the complete database schema, storage buckets, and security policies for the Wolthers Travel App built with Supabase and Next.js.

## Database Schema

### Core Tables Structure

#### 1. **Companies**
Stores client companies, exporters, farms, and other business entities.

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

**Relationships:**
- Has many `company_locations`
- Has many `company_contacts`
- Has many `users` (employees)
- Referenced by `trips` (client companies)

#### 2. **Company Locations**
Multiple physical locations per company (headquarters, farms, warehouses, etc.).

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

**Relationships:**
- Belongs to `companies`
- Has many `company_contacts`
- Referenced by `meetings`

#### 3. **Users**
All system users with role-based access control.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  company_id UUID REFERENCES companies(id),
  auth_method auth_method_enum NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  reports_to UUID REFERENCES users(id), -- For Client Admin hierarchy
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**User Roles:**
- `global_admin` - Full system access
- `wolthers_staff` - Wolthers employees
- `company_admin` - Company administrators
- `client_admin` - Business owners/CEOs
- `finance_department` - Finance team members
- `client` - Regular client users
- `driver` - Vehicle drivers

**Relationships:**
- Belongs to `companies`
- Has many `trips` (created_by)
- Has many `expenses`
- Has many `payment_cards`
- Self-referential (reports_to)

#### 4. **Company Contacts**
Individual contacts at each company location.

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

**Contact Types:**
- `export_manager`, `farm_owner`, `quality_manager`, `sales_representative`, `logistics_coordinator`, `ceo`, `procurement_manager`

#### 5. **Trips**
Core trip management with branching support.

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

**Trip Types:**
- `convention`, `inland_brazil`, `international`, `domestic_us`, `client_visit`, `farm_visit`

**Trip Status:**
- `draft`, `proposal`, `confirmed`, `in_progress`, `completed`, `cancelled`

#### 6. **Trip Participants**
Many-to-many relationship between trips and users/companies.

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

#### 7. **Meetings**
Individual meetings within trips.

```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
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

#### 8. **Expenses**
All trip-related expenses with multi-currency support.

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  usd_amount DECIMAL(10,2),
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
```

#### 9. **Payment Cards**
User payment cards with due date tracking.

```sql
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

#### 10. **Vehicles**
Fleet management.

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50),
  license_plate VARCHAR(20) UNIQUE,
  vin VARCHAR(50),
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
```

#### 11. **Vehicle Logs**
Driver accountability and trip logging.

```sql
CREATE TABLE vehicle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id),
  driver_name VARCHAR(255) NOT NULL,
  driver_license VARCHAR(50),
  driver_phone VARCHAR(20),
  log_type log_type_enum DEFAULT 'trip_start',
  odometer_start INTEGER,
  odometer_end INTEGER,
  fuel_level_start INTEGER CHECK (fuel_level_start >= 0 AND fuel_level_start <= 100),
  fuel_level_end INTEGER CHECK (fuel_level_end >= 0 AND fuel_level_end <= 100),
  dashboard_photo_start TEXT,
  dashboard_photo_end TEXT,
  start_location VARCHAR(255),
  end_location VARCHAR(255),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  route_notes TEXT,
  vehicle_condition_start TEXT,
  vehicle_condition_end TEXT,
  incidents JSONB DEFAULT '[]',
  ai_extracted_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 12. **Flight Bookings**
Flight cost tracking and management.

```sql
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

#### 13. **Finance Tasks**
Task management for finance department.

```sql
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
```

#### 14. **Out of Office Messages**
Automated OOO management for Wolthers staff.

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

### Database Views

#### 1. **Trip Cost Summary**
Aggregated cost data per trip.

```sql
CREATE VIEW trip_cost_summary AS
SELECT 
  t.id as trip_id,
  t.title,
  t.start_date,
  t.end_date,
  t.status,
  COALESCE(SUM(CASE WHEN e.category = 'accommodation' THEN e.usd_amount END), 0) as accommodation_cost,
  COALESCE(SUM(CASE WHEN e.category = 'meals' THEN e.usd_amount END), 0) as meals_cost,
  COALESCE(SUM(CASE WHEN e.category = 'transportation' THEN e.usd_amount END), 0) as ground_transport_cost,
  COALESCE(SUM(CASE WHEN e.category = 'fuel' THEN e.usd_amount END), 0) as fuel_cost,
  COALESCE(SUM(CASE WHEN e.category = 'other' THEN e.usd_amount END), 0) as other_expenses,
  COALESCE(SUM(f.usd_cost), 0) as flight_cost,
  COALESCE(SUM(e.usd_amount), 0) + COALESCE(SUM(f.usd_cost), 0) as total_cost,
  COALESCE(SUM(CASE WHEN e.client_billable = true THEN e.usd_amount END), 0) + 
  COALESCE(SUM(CASE WHEN f.client_billable = true THEN f.usd_cost END), 0) as client_billable_total,
  COALESCE(SUM(CASE WHEN pc.card_type = 'personal' THEN e.usd_amount END), 0) as personal_card_total,
  COALESCE(SUM(CASE WHEN e.reimbursement_status = 'pending' AND pc.card_type = 'personal' THEN e.usd_amount END), 0) as pending_reimbursement
FROM trips t
LEFT JOIN expenses e ON t.id = e.trip_id
LEFT JOIN payment_cards pc ON e.card_id = pc.id
LEFT JOIN flight_bookings f ON t.id = f.trip_id
GROUP BY t.id, t.title, t.start_date, t.end_date, t.status;
```

#### 2. **Finance Reimbursement Summary**
Finance department reimbursement queue.

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
  t.title as trip_title,
  t.start_date as trip_start,
  t.end_date as trip_end
FROM expenses e
JOIN users u ON e.user_id = u.id
JOIN payment_cards pc ON e.card_id = pc.id
JOIN trips t ON e.trip_id = t.id
WHERE e.reimbursement_status = 'pending'
  AND pc.card_type = 'personal'
GROUP BY u.id, u.full_name, u.email, pc.id, pc.last_four_digits, 
         pc.due_date, pc.card_currency, e.currency, t.id, t.title, t.start_date, t.end_date;
```

#### 3. **Finance Client Billing Summary**
Client billing preparation data.

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

## Storage Buckets

The application uses Supabase Storage with three main buckets:

### 1. **receipts**
- **Purpose**: Store expense receipts and invoice documents
- **Access**: Private (authenticated users only)
- **File Types**: JPEG, PNG, WebP, PDF
- **Size Limit**: 50MB per file
- **Structure**: `{user_id}/{trip_id}/receipt_{timestamp}.{ext}`

### 2. **dashboard-photos**
- **Purpose**: Store vehicle dashboard photos for driver logs
- **Access**: Private (drivers and admin only)
- **File Types**: JPEG, PNG, WebP
- **Size Limit**: 10MB per file
- **Structure**: `{user_id}/{vehicle_log_id}/dashboard_{start|end}_{timestamp}.{ext}`

### 3. **documents**
- **Purpose**: Store trip documents, presentations, and reports
- **Access**: Private (trip participants and admin)
- **File Types**: PDF, DOCX, XLSX, PPTX
- **Size Limit**: 100MB per file
- **Structure**: `{trip_id}/{document_name}.{ext}`

## Row Level Security (RLS) Policies

### User Access Policies

#### Users Table
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
```

#### Companies Table
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

#### Trips Table
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

#### Expenses Table
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
```

### Storage Policies

#### Receipts Bucket
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
```

#### Dashboard Photos Bucket
```sql
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

-- Drivers can view their dashboard photos
CREATE POLICY "Drivers can view their dashboard photos" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'dashboard-photos' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('global_admin', 'wolthers_staff', 'finance_department')
    )
  )
);
```

## Database Indexes

Performance optimization indexes:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_by ON trips(created_by);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_reimbursement_status ON expenses(reimbursement_status);
CREATE INDEX idx_meetings_trip_id ON meetings(trip_id);
CREATE INDEX idx_vehicle_logs_vehicle_id ON vehicle_logs(vehicle_id);
CREATE INDEX idx_finance_tasks_status ON finance_tasks(status);
```

## Default Data

### Initial Company
```sql
INSERT INTO companies (name, fantasy_name, industry, company_type, primary_language) 
VALUES (
  'Wolthers & Associates',
  'Wolthers',
  'Coffee Trading',
  'trader',
  'en'
);
```

### Default Admin User
```sql
INSERT INTO users (email, full_name, role, auth_method, company_id)
VALUES (
  'admin@wolthers.com',
  'System Administrator',
  'global_admin',
  'email_otp',
  (SELECT id FROM companies WHERE name = 'Wolthers & Associates' LIMIT 1)
);
```

### OOO Templates
```sql
INSERT INTO ooo_templates (template_name, message_type, language, subject_template, message_template, is_default) 
VALUES (
  'Business Travel - English', 
  'business_travel', 
  'en', 
  'Out of Office - Business Travel ({start_date} - {end_date})',
  'Thank you for your email. I am currently traveling for business...',
  true
);
```

## Environment Variables

Required environment variables for the application:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=trips@trips.wolthers.com
SMTP_PASSWORD=your_password
SMTP_FROM=ytrips@trips.wolthers.com

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Backup and Maintenance

### Recommended Backup Strategy
1. **Daily automated backups** of the entire Supabase database
2. **Weekly storage bucket backups**
3. **Monthly full system snapshots**
4. **Real-time replication** for critical data

### Maintenance Tasks
1. **Monitor storage usage** and clean up old files
2. **Review and optimize** slow queries
3. **Update RLS policies** as business requirements change
4. **Archive completed trips** older than 2 years
5. **Monitor and rotate** API keys and secrets

---

*Last updated: January 2025*  
*Version: 1.0*