'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { UserRole } from './use-auth';

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface NavigationState {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  activeItem: string | null;
  navigationItems: NavigationItem[];
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setActiveItem: (href: string) => void;
  getNavigationItems: (role: UserRole | null) => NavigationItem[];
}

// Navigation items by role
const roleNavigationMap: Record<UserRole | 'default', NavigationItem[]> = {
  GLOBAL_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Users', href: '/dashboard/users', icon: 'Users' },
    { name: 'Companies', href: '/dashboard/companies', icon: 'Building2' },
    { name: 'Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Fleet', href: '/dashboard/fleet', icon: 'Car' },
    { name: 'Finance', href: '/dashboard/finance', icon: 'CreditCard' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  ],
  WOLTHERS_STAFF: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Companies', href: '/dashboard/companies', icon: 'Building2' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
    { name: 'Fleet', href: '/dashboard/fleet', icon: 'Car' },
  ],
  COMPANY_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Company', href: '/dashboard/company', icon: 'Building2' },
    { name: 'Users', href: '/dashboard/users', icon: 'Users' },
    { name: 'Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
  ],
  CLIENT_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Team', href: '/dashboard/team', icon: 'Users' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
  ],
  FINANCE_DEPARTMENT: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Reimbursements', href: '/dashboard/reimbursements', icon: 'CreditCard' },
    { name: 'Billing', href: '/dashboard/billing', icon: 'FileText' },
    { name: 'Reports', href: '/dashboard/reports', icon: 'BarChart3' },
    { name: 'Tasks', href: '/dashboard/tasks', icon: 'CheckSquare' },
  ],
  CLIENT: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
  ],
  DRIVER: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Vehicle Logs', href: '/dashboard/vehicle-logs', icon: 'Car' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
  ],
  default: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  ],
};

export function useNavigation(userRole: UserRole | null = null): NavigationState {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Update active item based on pathname
  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const setActiveItemHandler = (href: string) => {
    setActiveItem(href);
  };

  const getNavigationItems = (role: UserRole | null): NavigationItem[] => {
    const key = role || 'default';
    return roleNavigationMap[key] || roleNavigationMap.default;
  };

  const navigationItems = getNavigationItems(userRole);

  return {
    isCollapsed,
    isMobileMenuOpen,
    activeItem,
    navigationItems,
    toggleSidebar,
    toggleMobileMenu,
    setActiveItem: setActiveItemHandler,
    getNavigationItems,
  };
}