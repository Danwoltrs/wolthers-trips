'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plane, Users, CreditCard, Car, Building, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user, role } = useAuth();

  const getRoleSpecificCards = () => {
    const baseCards = [
      {
        title: 'Active Trips',
        description: 'Currently ongoing trips',
        value: '5',
        change: '+2 this month',
        icon: Plane,
        color: 'text-blue-600',
      },
      {
        title: 'Upcoming Meetings',
        description: 'Scheduled meetings',
        value: '12',
        change: '+3 this week',
        icon: Users,
        color: 'text-green-600',
      },
    ];

    const roleSpecificCards = {
      GLOBAL_ADMIN: [
        ...baseCards,
        {
          title: 'Total Users',
          description: 'Active system users',
          value: '127',
          change: '+5 new users',
          icon: Users,
          color: 'text-purple-600',
        },
        {
          title: 'System Health',
          description: 'Overall system status',
          value: '98.5%',
          change: 'All systems operational',
          icon: FileText,
          color: 'text-green-600',
        },
      ],
      WOLTHERS_STAFF: [
        ...baseCards,
        {
          title: 'Pending Expenses',
          description: 'Awaiting approval',
          value: '$2,450',
          change: '8 receipts',
          icon: CreditCard,
          color: 'text-orange-600',
        },
        {
          title: 'Fleet Status',
          description: 'Available vehicles',
          value: '4/6',
          change: '2 in use',
          icon: Car,
          color: 'text-blue-600',
        },
      ],
      FINANCE_DEPARTMENT: [
        {
          title: 'Pending Reimbursements',
          description: 'Due this month',
          value: '$15,240',
          change: '23 employees',
          icon: CreditCard,
          color: 'text-red-600',
        },
        {
          title: 'Client Billing',
          description: 'Outstanding invoices',
          value: '$45,680',
          change: '12 clients',
          icon: FileText,
          color: 'text-yellow-600',
        },
        {
          title: 'Monthly Budget',
          description: 'Current utilization',
          value: '67%',
          change: '$89,500 spent',
          icon: Building,
          color: 'text-blue-600',
        },
        {
          title: 'Card Due Dates',
          description: 'Cards due this week',
          value: '8',
          change: '2 overdue',
          icon: CreditCard,
          color: 'text-red-600',
        },
      ],
      COMPANY_ADMIN: [
        ...baseCards,
        {
          title: 'Company Trips',
          description: 'All company trips',
          value: '28',
          change: '+4 this quarter',
          icon: Building,
          color: 'text-purple-600',
        },
        {
          title: 'Team Expenses',
          description: 'Total team spending',
          value: '$8,750',
          change: 'This month',
          icon: CreditCard,
          color: 'text-green-600',
        },
      ],
      CLIENT_ADMIN: [
        ...baseCards,
        {
          title: 'Employee Trips',
          description: 'Company employee trips',
          value: '15',
          change: '+2 this month',
          icon: Users,
          color: 'text-blue-600',
        },
        {
          title: 'Trip Proposals',
          description: 'Pending approval',
          value: '3',
          change: 'Awaiting decision',
          icon: FileText,
          color: 'text-orange-600',
        },
      ],
      CLIENT: [
        {
          title: 'My Trips',
          description: 'Assigned trips',
          value: '2',
          change: '1 upcoming',
          icon: Plane,
          color: 'text-blue-600',
        },
        {
          title: 'My Expenses',
          description: 'Personal expenses',
          value: '$1,240',
          change: '5 receipts',
          icon: CreditCard,
          color: 'text-green-600',
        },
      ],
      DRIVER: [
        {
          title: 'Assigned Trips',
          description: 'Driving assignments',
          value: '3',
          change: '1 today',
          icon: Car,
          color: 'text-blue-600',
        },
        {
          title: 'Vehicle Status',
          description: 'Current vehicle',
          value: 'Available',
          change: 'Ready for trips',
          icon: Car,
          color: 'text-green-600',
        },
      ],
    };

    return roleSpecificCards[role as keyof typeof roleSpecificCards] || baseCards;
  };

  const getWelcomeMessage = () => {
    const roleMessages = {
      GLOBAL_ADMIN: 'Welcome to the system administration dashboard',
      WOLTHERS_STAFF: 'Welcome to your travel management dashboard',
      FINANCE_DEPARTMENT: 'Welcome to the finance management dashboard',
      COMPANY_ADMIN: 'Welcome to your company management dashboard',
      CLIENT_ADMIN: 'Welcome to your business travel overview',
      CLIENT: 'Welcome to your travel portal',
      DRIVER: 'Welcome to your driver dashboard',
    };

    return roleMessages[role as keyof typeof roleMessages] || 'Welcome to Wolthers Trips';
  };

  const getQuickActions = () => {
    const baseActions = [
      { label: 'View Profile', href: '/dashboard/profile' },
      { label: 'View Trips', href: '/dashboard/trips' },
    ];

    const roleActions = {
      GLOBAL_ADMIN: [
        { label: 'Manage Users', href: '/dashboard/users' },
        { label: 'System Settings', href: '/dashboard/settings' },
        { label: 'View Reports', href: '/dashboard/reports' },
      ],
      WOLTHERS_STAFF: [
        { label: 'Create Trip', href: '/dashboard/trips/create' },
        { label: 'Manage Expenses', href: '/dashboard/expenses' },
        { label: 'Fleet Management', href: '/dashboard/fleet' },
      ],
      FINANCE_DEPARTMENT: [
        { label: 'Process Reimbursements', href: '/dashboard/finance/reimbursements' },
        { label: 'Client Billing', href: '/dashboard/finance/billing' },
        { label: 'Finance Tasks', href: '/dashboard/finance/tasks' },
      ],
      COMPANY_ADMIN: [
        { label: 'Manage Company', href: '/dashboard/companies' },
        { label: 'View Team Trips', href: '/dashboard/trips' },
        { label: 'Expense Reports', href: '/dashboard/expenses' },
      ],
      CLIENT_ADMIN: [
        { label: 'Create Proposal', href: '/dashboard/trips/proposals' },
        { label: 'View Team Trips', href: '/dashboard/trips' },
        { label: 'Expense Overview', href: '/dashboard/expenses' },
      ],
      CLIENT: [
        { label: 'My Expenses', href: '/dashboard/expenses' },
        { label: 'Trip Documents', href: '/dashboard/documents' },
      ],
      DRIVER: [
        { label: 'Vehicle Logs', href: '/dashboard/fleet/logs' },
        { label: 'My Assignments', href: '/dashboard/assignments' },
        { label: 'Expense Claims', href: '/dashboard/expenses' },
      ],
    };

    return [...baseActions, ...(roleActions[role as keyof typeof roleActions] || [])];
  };

  return (
    <div className="space-y-6">
      {/* Debug Section - Remove after testing */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold">🔧 Debug Tests (Remove after fixing)</h2>
        <div className="bg-red-500 text-white p-4 m-4 rounded">
          🔴 RED TEST - If you see this with red background, Tailwind is working
        </div>
        <div className="bg-blue-500 text-white p-4 m-4 rounded">
          🔵 BLUE TEST - If you see this with blue background, basic Tailwind is working
        </div>
        <div className="bg-primary text-primary-foreground p-4 m-4 rounded">
          🟡 CSS VARIABLE TEST - If you see this styled, CSS variables are working
        </div>
        <div className="bg-sidebar text-sidebar-foreground p-4 m-4 rounded">
          🟢 SIDEBAR VARIABLE TEST - If you see this styled, sidebar variables are working
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.name ? `Welcome back, ${user.name}` : 'Welcome back'}
        </h1>
        <p className="text-muted-foreground">{getWelcomeMessage()}</p>
        <Badge variant="outline" className="w-fit">
          {role?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getRoleSpecificCards().map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.change}
              </p>
              <CardDescription className="mt-1">{card.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {getQuickActions().map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start"
                onClick={() => window.location.href = action.href}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New trip created</p>
                <p className="text-sm text-muted-foreground">
                  Brazil Coffee Tour - 5 participants
                </p>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Meeting confirmed</p>
                <p className="text-sm text-muted-foreground">
                  Santos Coffee Cooperative - July 20th
                </p>
              </div>
              <div className="text-sm text-muted-foreground">1 day ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Expense submitted</p>
                <p className="text-sm text-muted-foreground">
                  Hotel accommodation - $450 USD
                </p>
              </div>
              <div className="text-sm text-muted-foreground">2 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}