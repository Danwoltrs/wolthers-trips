'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/hooks/use-navigation';
import { useBreakpoint } from '@/hooks/use-media-query';
import { UserDropdown } from './UserDropdown';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const { user } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigation = useNavigation(user?.role);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className={cn(
      'sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6',
      className
    )}>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={navigation.toggleMobileMenu}
          className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Search */}
      <div className="flex-1 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent transition-colors',
              isSearchOpen ? 'ring-2 ring-ring' : ''
            )}
          >
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-muted-foreground">Search...</span>
            <div className="ml-auto">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </button>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors relative">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User dropdown */}
        {user && (
          <UserDropdown user={user} />
        )}
      </div>
    </header>
  );
}