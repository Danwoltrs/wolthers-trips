'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24"> {/* navbar height (16) + spacing (32) = 48 (pt-12) but using pt-24 for better spacing */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}