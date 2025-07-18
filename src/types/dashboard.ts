import { UserRole } from '@/hooks/use-auth';

export interface DashboardStats {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  totalExpenses: number;
  pendingExpenses: number;
  totalUsers: number;
  totalCompanies: number;
  vehicleCount: number;
  pendingReimbursements: number;
  monthlyRevenue: number;
}

export interface DashboardCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: string;
  href?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: 'default' | 'primary' | 'secondary';
}

export interface RecentActivity {
  id: string;
  type: 'trip' | 'expense' | 'user' | 'company' | 'vehicle';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  href?: string;
}

export interface DashboardConfig {
  role: UserRole;
  stats: DashboardStats;
  cards: DashboardCard[];
  quickActions: QuickAction[];
  recentActivity: RecentActivity[];
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export interface HeaderProps {
  onMenuToggle: () => void;
  className?: string;
}

export interface NavigationMenuProps {
  items: NavigationItem[];
  isCollapsed: boolean;
  activeItem: string | null;
  onItemClick: (href: string) => void;
  className?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface UserDropdownProps {
  user: {
    name?: string | null;
    email: string;
    role?: UserRole;
    company?: string;
    avatar?: string | null;
  };
  onSignOut: () => void;
  className?: string;
}

export interface MediaQueryHook {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface DashboardMetrics {
  period: 'today' | 'week' | 'month' | 'quarter' | 'year';
  trips: {
    total: number;
    active: number;
    completed: number;
    upcoming: number;
  };
  expenses: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
  };
  companies: {
    total: number;
    active: number;
  };
  vehicles: {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
  };
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface SearchResult {
  id: string;
  type: 'trip' | 'user' | 'company' | 'expense';
  title: string;
  description: string;
  href: string;
  avatar?: string;
}

export interface DashboardTheme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
}

export interface DashboardSettings {
  theme: DashboardTheme;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  dashboard: {
    showQuickActions: boolean;
    showRecentActivity: boolean;
    cardsPerRow: number;
  };
  sidebar: {
    collapsed: boolean;
    autoCollapse: boolean;
  };
}