'use client';

import { useAuth } from '@/hooks/use-auth';
import { DashboardCard, QuickAction, RecentActivity } from '@/types/dashboard';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

interface DashboardStats {
  totalTrips: number;
  activeTrips: number;
  totalExpenses: number;
  pendingReimbursements: number;
  totalUsers: number;
  totalCompanies: number;
}

function StatCard({ title, value, change, icon, href, color = 'default' }: DashboardCard) {
  const colorClasses = {
    default: 'bg-card text-card-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    destructive: 'bg-destructive text-destructive-foreground',
  };

  const content = (
    <div className={cn(
      'p-6 rounded-lg border transition-all hover:shadow-md',
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              <svg
                className={cn(
                  'w-4 h-4 mr-1',
                  change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={change.type === 'increase' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
                />
              </svg>
              <span className="text-sm">{change.value}%</span>
            </div>
          )}
        </div>
        <div className="text-3xl opacity-80">
          {/* Icon placeholder */}
          <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
            <span className="text-lg">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

function QuickActionCard({ title, description, href, icon, color = 'default' }: QuickAction) {
  const colorClasses = {
    default: 'border-border hover:border-primary',
    primary: 'border-primary hover:border-primary/80',
    secondary: 'border-secondary hover:border-secondary/80',
  };

  return (
    <Link href={href} className="block">
      <div className={cn(
        'p-4 rounded-lg border transition-all hover:shadow-md',
        colorClasses[color]
      )}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-medium text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function RecentActivityItem({ type, title, description, timestamp, user, href }: RecentActivity) {
  const typeColors = {
    trip: 'bg-blue-100 text-blue-800',
    expense: 'bg-green-100 text-green-800',
    user: 'bg-purple-100 text-purple-800',
    company: 'bg-orange-100 text-orange-800',
    vehicle: 'bg-gray-100 text-gray-800',
  };

  const content = (
    <div className="flex items-start gap-4 p-4 hover:bg-accent rounded-lg transition-colors">
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
        typeColors[type]
      )}>
        {type.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{timestamp}</span>
          {user && (
            <span className="text-xs text-muted-foreground">• {user.name}</span>
          )}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    activeTrips: 0,
    totalExpenses: 0,
    pendingReimbursements: 0,
    totalUsers: 0,
    totalCompanies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual data fetching
    setTimeout(() => {
      setStats({
        totalTrips: 142,
        activeTrips: 8,
        totalExpenses: 45280,
        pendingReimbursements: 12350,
        totalUsers: 28,
        totalCompanies: 15,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getDashboardCards = (role: string | undefined): DashboardCard[] => {
    const baseCards: DashboardCard[] = [
      {
        title: 'Total Trips',
        value: stats.totalTrips,
        change: { value: 12, type: 'increase' },
        icon: '✈️',
        href: '/dashboard/trips',
      },
      {
        title: 'Active Trips',
        value: stats.activeTrips,
        icon: '🚀',
        href: '/dashboard/trips',
        color: 'primary',
      },
    ];

    switch (role) {
      case 'GLOBAL_ADMIN':
        return [
          ...baseCards,
          {
            title: 'Total Users',
            value: stats.totalUsers,
            change: { value: 8, type: 'increase' },
            icon: '👥',
            href: '/dashboard/users',
          },
          {
            title: 'Companies',
            value: stats.totalCompanies,
            icon: '🏢',
            href: '/dashboard/companies',
          },
          {
            title: 'Pending Reimbursements',
            value: `$${stats.pendingReimbursements.toLocaleString()}`,
            icon: '💳',
            href: '/dashboard/finance',
            color: 'warning',
          },
          {
            title: 'Total Expenses',
            value: `$${stats.totalExpenses.toLocaleString()}`,
            change: { value: 15, type: 'increase' },
            icon: '💰',
            href: '/dashboard/expenses',
          },
        ];
      case 'WOLTHERS_STAFF':
        return [
          ...baseCards,
          {
            title: 'My Expenses',
            value: `$${(stats.totalExpenses / 4).toLocaleString()}`,
            icon: '💳',
            href: '/dashboard/expenses',
          },
          {
            title: 'Companies',
            value: stats.totalCompanies,
            icon: '🏢',
            href: '/dashboard/companies',
          },
        ];
      case 'FINANCE_DEPARTMENT':
        return [
          {
            title: 'Pending Reimbursements',
            value: `$${stats.pendingReimbursements.toLocaleString()}`,
            icon: '💳',
            href: '/dashboard/reimbursements',
            color: 'warning',
          },
          {
            title: 'Total Expenses',
            value: `$${stats.totalExpenses.toLocaleString()}`,
            change: { value: 15, type: 'increase' },
            icon: '💰',
            href: '/dashboard/expenses',
          },
          {
            title: 'Active Trips',
            value: stats.activeTrips,
            icon: '🚀',
            href: '/dashboard/trips',
          },
          {
            title: 'Processing Tasks',
            value: 23,
            icon: '📋',
            href: '/dashboard/tasks',
            color: 'primary',
          },
        ];
      default:
        return [
          ...baseCards,
          {
            title: 'My Expenses',
            value: `$${(stats.totalExpenses / 10).toLocaleString()}`,
            icon: '💳',
            href: '/dashboard/expenses',
          },
        ];
    }
  };

  const getQuickActions = (role: string | undefined): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        title: 'New Trip',
        description: 'Create a new travel itinerary',
        href: '/dashboard/trips/create',
        icon: '✈️',
        color: 'primary',
      },
      {
        title: 'Add Expense',
        description: 'Record a new expense',
        href: '/dashboard/expenses/create',
        icon: '💳',
      },
    ];

    switch (role) {
      case 'GLOBAL_ADMIN':
        return [
          ...baseActions,
          {
            title: 'Add User',
            description: 'Invite a new user',
            href: '/dashboard/users/create',
            icon: '👤',
          },
          {
            title: 'Add Company',
            description: 'Register a new company',
            href: '/dashboard/companies/create',
            icon: '🏢',
          },
        ];
      case 'WOLTHERS_STAFF':
        return [
          ...baseActions,
          {
            title: 'Add Company',
            description: 'Register a new company',
            href: '/dashboard/companies/create',
            icon: '🏢',
          },
        ];
      case 'FINANCE_DEPARTMENT':
        return [
          {
            title: 'Process Reimbursement',
            description: 'Review pending reimbursements',
            href: '/dashboard/reimbursements',
            icon: '💰',
            color: 'primary',
          },
          {
            title: 'Generate Report',
            description: 'Create expense reports',
            href: '/dashboard/reports',
            icon: '📊',
          },
        ];
      default:
        return baseActions;
    }
  };

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'trip',
      title: 'Colombia Coffee Tour',
      description: 'Trip created by John Doe',
      timestamp: '2 hours ago',
      user: { name: 'John Doe' },
      href: '/dashboard/trips/1',
    },
    {
      id: '2',
      type: 'expense',
      title: 'Hotel Accommodation',
      description: '$250 expense submitted',
      timestamp: '4 hours ago',
      user: { name: 'Jane Smith' },
      href: '/dashboard/expenses/2',
    },
    {
      id: '3',
      type: 'user',
      title: 'New User Joined',
      description: 'Mike Johnson joined the team',
      timestamp: '1 day ago',
      user: { name: 'Mike Johnson' },
      href: '/dashboard/users/3',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardCards = getDashboardCards(user?.role);
  const quickActions = getQuickActions(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name || user?.email}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your travel operations today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="bg-card border border-border rounded-lg">
          {recentActivity.map((activity, index) => (
            <div key={activity.id}>
              <RecentActivityItem {...activity} />
              {index < recentActivity.length - 1 && (
                <div className="border-t border-border mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}