# Dashboard Module Specification

## 🎯 Overview
The dashboard serves as the main interface for all authenticated users, providing role-based navigation, overview metrics, and quick actions. It includes a responsive sidebar, header with user controls, and customizable dashboard cards.

## 🏗️ Architecture

### Layout Structure
```
Dashboard Layout
├── Header (sticky)
│   ├── Logo/Brand
│   ├── Navigation Icons
│   ├── Theme Toggle
│   └── User Dropdown
├── Sidebar (collapsible)
│   ├── Role-based Navigation
│   ├── Quick Actions
│   └── Status Indicators
└── Main Content Area
    ├── Dashboard Overview
    ├── Quick Stats Cards
    └── Recent Activity
```

### Component Hierarchy
```typescript
DashboardLayout
├── DashboardHeader
│   ├── NavigationIcons
│   ├── ThemeToggle
│   └── UserDropdown
├── DashboardSidebar
│   ├── NavigationMenu
│   ├── QuickActions
│   └── StatusBadges
└── DashboardMain
    ├── OverviewCards
    ├── QuickStats
    └── RecentActivity
```

## 🎨 Design System Integration

### Header Design
```typescript
interface HeaderProps {
  // Sticky header with brand colors
  background: 'bg-card border-b border-border';
  height: 'h-16';
  padding: 'px-4 lg:px-6';
  
  // Logo section
  logo: {
    size: 'h-8 w-auto';
    color: 'text-primary';
    responsive: 'hidden sm:block';
  };
  
  // Navigation icons
  navigation: {
    spacing: 'space-x-4';
    iconSize: 'h-5 w-5';
    activeColor: 'text-primary';
    hoverColor: 'hover:text-primary';
  };
  
  // User dropdown
  userDropdown: {
    trigger: 'h-8 w-8 rounded-full';
    menu: 'w-56 mt-2';
    items: UserDropdownItem[];
  };
}
```

### Sidebar Design
```typescript
interface SidebarProps {
  // Collapsible sidebar
  width: {
    expanded: 'w-64';
    collapsed: 'w-16';
  };
  
  // Navigation items
  navigation: {
    itemHeight: 'h-10';
    padding: 'px-3 py-2';
    activeBackground: 'bg-primary text-primary-foreground';
    hoverBackground: 'hover:bg-accent hover:text-accent-foreground';
  };
  
  // Role-based visibility
  roleVisibility: RoleBasedNavigation;
}
```

## 📊 Role-Based Navigation

### Navigation Menu Structure
```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  href: string;
  badge?: number;
  roles: UserRole[];
  submenu?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard',
    roles: ['*'] // All roles
  },
  {
    id: 'trips',
    label: 'Trips',
    icon: PlaneIcon,
    href: '/trips',
    roles: ['global_admin', 'wolthers_staff', 'company_admin', 'client_admin', 'client'],
    submenu: [
      { id: 'trips-all', label: 'All Trips', href: '/trips' },
      { id: 'trips-create', label: 'Create Trip', href: '/trips/create' },
      { id: 'trips-proposals', label: 'Proposals', href: '/trips/proposals' }
    ]
  },
  {
    id: 'companies',
    label: 'Companies',
    icon: BuildingIcon,
    href: '/companies',
    roles: ['global_admin', 'wolthers_staff', 'company_admin']
  },
  {
    id: 'users',
    label: 'Users',
    icon: UsersIcon,
    href: '/users',
    roles: ['global_admin', 'wolthers_staff', 'company_admin']
  },
  {
    id: 'fleet',
    label: 'Fleet',
    icon: TruckIcon,
    href: '/fleet',
    roles: ['global_admin', 'wolthers_staff', 'driver']
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: CreditCardIcon,
    href: '/finance',
    roles: ['finance_department', 'global_admin'],
    submenu: [
      { id: 'finance-reimbursements', label: 'Reimbursements', href: '/finance/reimbursements' },
      { id: 'finance-billing', label: 'Client Billing', href: '/finance/billing' },
      { id: 'finance-tasks', label: 'Tasks', href: '/finance/tasks' }
    ]
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon,
    href: '/profile',
    roles: ['*'] // All roles
  }
];
```

### Role-Based Dashboard Cards
```typescript
interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  href: string;
  roles: UserRole[];
  priority: number;
  badge?: number;
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'my-trips',
    title: 'My Trips',
    description: 'View and manage your upcoming trips',
    icon: CalendarIcon,
    href: '/trips',
    roles: ['*'],
    priority: 1
  },
  {
    id: 'pending-approvals',
    title: 'Pending Approvals',
    description: 'Trip proposals awaiting your approval',
    icon: ClockIcon,
    href: '/trips/proposals',
    roles: ['wolthers_staff', 'global_admin'],
    priority: 2
  },
  {
    id: 'expense-tracking',
    title: 'Expense Tracking',
    description: 'Track and submit your expenses',
    icon: ReceiptIcon,
    href: '/expenses',
    roles: ['wolthers_staff', 'client', 'driver'],
    priority: 3
  },
  {
    id: 'finance-queue',
    title: 'Reimbursement Queue',
    description: 'Process pending reimbursements',
    icon: DollarSignIcon,
    href: '/finance/reimbursements',
    roles: ['finance_department'],
    priority: 1
  },
  {
    id: 'client-billing',
    title: 'Client Billing',
    description: 'Prepare client invoices',
    icon: FileTextIcon,
    href: '/finance/billing',
    roles: ['finance_department'],
    priority: 2
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    description: 'Manage vehicles and driver logs',
    icon: TruckIcon,
    href: '/fleet',
    roles: ['global_admin', 'wolthers_staff'],
    priority: 4
  }
];
```

## 🔒 Protected Routes

### Route Protection Structure
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
```

### Auth Guard Component
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    redirect('/login');
  }
  
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    return <UnauthorizedPage />;
  }
  
  return <>{children}</>;
}
```

## 📊 Dashboard Overview

### Quick Stats Display
```typescript
interface QuickStat {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const quickStats: QuickStat[] = [
  {
    label: 'Active Trips',
    value: 12,
    change: { value: 2, type: 'increase', period: 'from last month' },
    icon: PlaneIcon,
    color: 'primary'
  },
  {
    label: 'Pending Expenses',
    value: '$2,450',
    change: { value: 15, type: 'decrease', period: 'from last week' },
    icon: ReceiptIcon,
    color: 'warning'
  },
  {
    label: 'Confirmed Meetings',
    value: 28,
    change: { value: 8, type: 'increase', period: 'this week' },
    icon: CalendarIcon,
    color: 'success'
  }
];
```

### Recent Activity Feed
```typescript
interface ActivityItem {
  id: string;
  type: 'trip' | 'expense' | 'meeting' | 'approval';
  title: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
  };
  actionUrl?: string;
}

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'trip',
    title: 'New trip created',
    description: 'Brazil Coffee Farm Visit - March 2025',
    timestamp: new Date('2025-01-15T10:30:00'),
    user: { name: 'John Doe' },
    actionUrl: '/trips/trip-123'
  },
  {
    id: '2',
    type: 'expense',
    title: 'Expense submitted',
    description: 'Hotel accommodation - $250.00',
    timestamp: new Date('2025-01-15T09:15:00'),
    user: { name: 'Jane Smith' },
    actionUrl: '/expenses/expense-456'
  }
];
```

## 🎯 Implementation Steps

### Phase 1: Basic Layout (Week 1)
1. Create `DashboardLayout` component
2. Implement `DashboardHeader` with navigation icons
3. Build `DashboardSidebar` with role-based navigation
4. Add `ThemeToggle` component
5. Create `UserDropdown` with profile/logout options

### Phase 2: Dashboard Content (Week 2)
1. Implement dashboard overview cards
2. Add quick stats display
3. Create recent activity feed
4. Build responsive design for mobile/tablet
5. Add loading states and error handling

### Phase 3: Advanced Features (Week 3)
1. Add real-time updates for activity feed
2. Implement customizable dashboard layout
3. Add search functionality
4. Create notification system
5. Add keyboard shortcuts

## 🎨 Styling Guidelines

### Color Usage
- **Primary colors** for active navigation items
- **Accent colors** for hover states
- **Card backgrounds** for content areas
- **Muted colors** for secondary text
- **Success/warning/error** colors for status indicators

### Responsive Design
- **Mobile**: Collapsed sidebar, full-screen content
- **Tablet**: Expandable sidebar, grid layout
- **Desktop**: Full sidebar, multi-column layout

### Animation & Transitions
- **Sidebar collapse/expand**: Smooth width transition
- **Theme switching**: Fade transition between modes
- **Navigation hover**: Subtle background color transition
- **Card interactions**: Gentle scale and shadow effects

## 🔧 Technical Implementation

### State Management
```typescript
// Dashboard store
interface DashboardStore {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  activeNavItem: string;
  setActiveNavItem: (item: string) => void;
  
  quickStats: QuickStat[];
  setQuickStats: (stats: QuickStat[]) => void;
  
  recentActivity: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
}
```

### API Integration
```typescript
// Dashboard data hooks
export function useDashboardData() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 5 * 60 * 1000 // 5 minutes
  });
  
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
    refetchInterval: 30 * 1000 // 30 seconds
  });
  
  return {
    stats,
    activity,
    isLoading: statsLoading || activityLoading
  };
}
```

---
*Next Phase: User Management Module*  
*Dependencies: Authentication (✅), Database (✅), Color System (✅)*