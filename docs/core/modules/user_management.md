# User Management Module Specification

## 🎯 Overview
The user management module handles user CRUD operations, role assignment, profile management, and user hierarchies. It supports the complex role-based access system and integrates with the authentication module.

## 👥 User Roles & Hierarchy

### Role Definitions
```typescript
enum UserRole {
  GLOBAL_ADMIN      = 'global_admin',      // Full system access
  WOLTHERS_STAFF    = 'wolthers_staff',    // Create trips, manage expenses, view all
  COMPANY_ADMIN     = 'company_admin',     // Manage company users and trips
  CLIENT_ADMIN      = 'client_admin',      // Business owners, view employee trips
  FINANCE_DEPARTMENT = 'finance_department', // View costs, manage reimbursements
  CLIENT            = 'client',            // View assigned trips only
  DRIVER            = 'driver'             // Vehicle-focused views
}
```

### Permission Matrix
| Role | Create User | Edit Users | View All Users | Manage Roles | View Finance | Create Trips | Manage Fleet |
|------|-------------|------------|----------------|--------------|--------------|--------------|--------------|
| Global Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Wolthers Staff | Company Only | Company Only | Company Only | ❌ | ❌ | ✅ | ✅ |
| Company Admin | Company Only | Company Only | Company Only | Company Only | ❌ | ✅ | ❌ |
| Client Admin | Employee Only | Employee Only | Employee Only | ❌ | ❌ | Proposals Only | ❌ |
| Finance Dept | ❌ | ❌ | View Only | ❌ | ✅ | ❌ | ❌ |
| Client | ❌ | Own Profile | ❌ | ❌ | ❌ | ❌ | ❌ |
| Driver | ❌ | Own Profile | ❌ | ❌ | ❌ | ❌ | Own Vehicle |

### User Hierarchy
```typescript
interface UserHierarchy {
  // Client Admin can oversee employees
  reports_to: string | null;
  
  // Multi-company access for complex relationships
  company_access: string[];
  
  // Trip code access tracking
  trip_code_visits: number;
  prompt_account_creation: boolean; // After 3 visits
}
```

## 🗄️ Database Schema

### Users Table
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

### User Preferences Structure
```typescript
interface UserPreferences {
  // UI Preferences
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'pt' | 'es' | 'fr' | 'de';
  timezone: string;
  currency: string;
  
  // Notification Preferences
  notifications: {
    email: boolean;
    browser: boolean;
    trip_updates: boolean;
    expense_reminders: boolean;
    meeting_confirmations: boolean;
  };
  
  // Dashboard Preferences
  dashboard: {
    layout: 'grid' | 'list';
    cards_visible: string[];
    default_view: string;
  };
  
  // Travel Preferences
  travel: {
    preferred_hotels: string[];
    dietary_restrictions: string[];
    accessibility_needs: string[];
  };
}
```

## 🏗️ Component Architecture

### User Management Pages
```
/users/
├── page.tsx                    # User list with search/filter
├── create/
│   └── page.tsx               # Create new user form
├── [id]/
│   ├── page.tsx               # User profile view
│   ├── edit/
│   │   └── page.tsx           # Edit user form
│   └── permissions/
│       └── page.tsx           # Role and permission management
└── invite/
    └── page.tsx               # User invitation system
```

### Component Structure
```typescript
UserManagement
├── UserList
│   ├── UserTable
│   ├── UserFilters
│   └── UserSearch
├── UserForm
│   ├── BasicInfo
│   ├── RoleSelection
│   ├── CompanyAssignment
│   └── PermissionSettings
├── UserProfile
│   ├── ProfileHeader
│   ├── ContactInfo
│   ├── RoleDisplay
│   └── ActivityHistory
└── UserInvitation
    ├── InvitationForm
    ├── EmailTemplate
    └── InvitationTracking
```

## 📋 User List Interface

### User Table Design
```typescript
interface UserTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  width?: string;
}

const userTableColumns: UserTableColumn[] = [
  { key: 'avatar', label: '', sortable: false, filterable: false, width: '48px' },
  { key: 'full_name', label: 'Name', sortable: true, filterable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true },
  { key: 'company', label: 'Company', sortable: true, filterable: true },
  { key: 'last_login', label: 'Last Login', sortable: true, filterable: false },
  { key: 'status', label: 'Status', sortable: true, filterable: true },
  { key: 'actions', label: 'Actions', sortable: false, filterable: false }
];
```

### Filtering & Search
```typescript
interface UserFilters {
  role: UserRole[];
  company: string[];
  status: ('active' | 'inactive' | 'pending')[];
  last_login: {
    from?: Date;
    to?: Date;
  };
  search: string; // Name or email search
}

// Advanced search capabilities
const searchFields = [
  'full_name',
  'email', 
  'company.name',
  'company.fantasy_name'
];
```

## 📝 User Creation & Editing

### User Form Schema
```typescript
const userFormSchema = z.object({
  // Basic Information
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  
  // Role & Company
  role: z.enum(['global_admin', 'wolthers_staff', 'company_admin', 'client_admin', 'finance_department', 'client', 'driver']),
  company_id: z.string().uuid().optional(),
  
  // Hierarchy
  reports_to: z.string().uuid().optional(),
  
  // Preferences
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.enum(['en', 'pt', 'es', 'fr', 'de']).default('en'),
    timezone: z.string().default('America/New_York'),
    currency: z.string().default('USD')
  }).optional()
});

type UserFormData = z.infer<typeof userFormSchema>;
```

### Role-Based Form Fields
```typescript
interface RoleBasedFields {
  global_admin: {
    required: ['full_name', 'email'];
    optional: ['preferences'];
    hidden: ['company_id', 'reports_to'];
  };
  
  wolthers_staff: {
    required: ['full_name', 'email'];
    optional: ['preferences'];
    hidden: ['company_id', 'reports_to'];
  };
  
  company_admin: {
    required: ['full_name', 'email', 'company_id'];
    optional: ['preferences'];
    hidden: ['reports_to'];
  };
  
  client_admin: {
    required: ['full_name', 'email', 'company_id'];
    optional: ['preferences'];
    hidden: ['reports_to'];
  };
  
  client: {
    required: ['full_name', 'email', 'company_id'];
    optional: ['reports_to', 'preferences'];
    hidden: [];
  };
  
  driver: {
    required: ['full_name', 'email'];
    optional: ['company_id', 'preferences'];
    hidden: ['reports_to'];
  };
  
  finance_department: {
    required: ['full_name', 'email'];
    optional: ['preferences'];
    hidden: ['company_id', 'reports_to'];
  };
}
```

## 🔐 Permission System

### Role Assignment Logic
```typescript
interface RoleAssignmentRules {
  // Who can assign what roles
  assignment_permissions: {
    global_admin: UserRole[]; // Can assign any role
    wolthers_staff: ['company_admin', 'client_admin', 'client', 'driver'];
    company_admin: ['client_admin', 'client']; // Within their company only
    client_admin: ['client']; // Their employees only
  };
  
  // Role change restrictions
  change_restrictions: {
    // Can't demote global_admin unless you're global_admin
    protect_admin: boolean;
    // Can't change role of users outside your company
    company_boundary: boolean;
    // Can't assign higher role than your own
    hierarchy_respect: boolean;
  };
}
```

### Permission Validation
```typescript
export function canManageUser(
  currentUser: User, 
  targetUser: User, 
  action: 'view' | 'edit' | 'delete' | 'change_role'
): boolean {
  // Global admin can do anything
  if (currentUser.role === 'global_admin') return true;
  
  // Users can manage their own profile (limited)
  if (currentUser.id === targetUser.id && action === 'edit') return true;
  
  // Company admin can manage users in their company
  if (currentUser.role === 'company_admin' && 
      currentUser.company_id === targetUser.company_id) {
    return action !== 'delete' || targetUser.role !== 'company_admin';
  }
  
  // Client admin can manage their direct reports
  if (currentUser.role === 'client_admin' && 
      targetUser.reports_to === currentUser.id) {
    return action !== 'delete' && action !== 'change_role';
  }
  
  // Finance can view Wolthers employees
  if (currentUser.role === 'finance_department' && 
      targetUser.role === 'wolthers_staff' && 
      action === 'view') {
    return true;
  }
  
  return false;
}
```

## 📧 User Invitation System

### Invitation Flow
```typescript
interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  company_id?: string;
  invited_by: string;
  invitation_token: string;
  expires_at: Date;
  accepted_at?: Date;
  created_at: Date;
}

// Invitation process:
// 1. Admin sends invitation with role and company
// 2. System generates secure token and sends email
// 3. User clicks link, creates account
// 4. Account created with pre-assigned role and company
```

### Invitation Email Template
```typescript
interface InvitationEmailTemplate {
  subject: string;
  html: string;
  variables: {
    inviter_name: string;
    company_name: string;
    role_name: string;
    invitation_url: string;
    expires_in: string;
  };
}

const invitationTemplate = {
  subject: 'Invitation to join {{company_name}} - Wolthers Travel System',
  html: `
    <h1>You've been invited to join {{company_name}}</h1>
    <p>{{inviter_name}} has invited you to join the Wolthers Travel Management System as a {{role_name}}.</p>
    <a href="{{invitation_url}}" class="button">Accept Invitation</a>
    <p>This invitation expires in {{expires_in}}.</p>
  `
};
```

## 📊 User Analytics & Reporting

### User Activity Tracking
```typescript
interface UserActivity {
  login_frequency: number;
  last_active: Date;
  trip_participation: number;
  expense_submissions: number;
  meetings_attended: number;
  feature_usage: Record<string, number>;
}

// Analytics queries
const userAnalytics = {
  active_users: 'Users logged in last 30 days',
  role_distribution: 'User count by role',
  company_distribution: 'User count by company',
  login_trends: 'Login frequency over time',
  feature_adoption: 'Feature usage by user type'
};
```

### User Reports
```typescript
interface UserReport {
  type: 'user_list' | 'role_summary' | 'activity_report' | 'invitation_status';
  filters: UserFilters;
  format: 'pdf' | 'csv' | 'excel';
  columns: string[];
  sort_by: string;
  sort_order: 'asc' | 'desc';
}
```

## 🎯 Implementation Steps

### Phase 1: Basic User Management (Week 2)
1. Create user list page with search and filters
2. Implement user creation form with role assignment
3. Build user profile and edit pages
4. Add basic permission validation
5. Create user deletion with safety checks

### Phase 2: Advanced Features (Week 3)
1. Implement user invitation system
2. Add user hierarchy management
3. Build role-based permission system
4. Create user preference management
5. Add user activity tracking

### Phase 3: Analytics & Reporting (Week 4)
1. Implement user analytics dashboard
2. Add user activity reports
3. Create user export functionality
4. Build invitation tracking system
5. Add bulk user operations

## 🔧 API Endpoints

### User CRUD Operations
```typescript
// GET /api/users - List users with filters
// POST /api/users - Create new user
// GET /api/users/[id] - Get user details
// PUT /api/users/[id] - Update user
// DELETE /api/users/[id] - Delete user (soft delete)

// POST /api/users/invite - Send user invitation
// POST /api/users/accept-invitation - Accept invitation
// GET /api/users/[id]/activity - Get user activity
// PUT /api/users/[id]/preferences - Update preferences
```

### Permission Validation Middleware
```typescript
export function requirePermission(
  action: string,
  resource: string
) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req);
    const hasPermission = await checkPermission(user, action, resource);
    
    if (!hasPermission) {
      return new Response('Forbidden', { status: 403 });
    }
    
    return NextResponse.next();
  };
}
```

---
*Next Phase: Company Management Module*  
*Dependencies: Authentication (✅), Dashboard (🎯), Database (✅)*