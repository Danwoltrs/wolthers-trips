import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Wolthers Travel',
  description: 'Manage your trips, expenses, and travel operations',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          {/* Sidebar */}
          <DashboardSidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <DashboardHeader />
            
            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6 bg-background">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}