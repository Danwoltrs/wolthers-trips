'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/hooks/use-navigation';
import { useBreakpoint } from '@/hooks/use-media-query';
import { NavigationMenu } from './NavigationMenu';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import Link from 'next/link';

export function DashboardSidebar() {
  const { user } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigation = useNavigation(user?.role);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && navigation.isMobileMenuOpen) {
        const sidebar = document.getElementById('dashboard-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          navigation.toggleMobileMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, navigation]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && navigation.isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={navigation.toggleMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div 
        id="dashboard-sidebar"
        className={cn(
          'bg-sidebar-background border-r border-border transition-all duration-300 flex flex-col',
          // Mobile styles
          isMobile && 'fixed inset-y-0 left-0 z-50 w-64 transform',
          isMobile && navigation.isMobileMenuOpen ? 'translate-x-0' : isMobile && '-translate-x-full',
          // Desktop styles
          !isMobile && 'relative',
          !isMobile && (navigation.isCollapsed ? 'w-16' : 'w-64')
        )}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            {(!navigation.isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Wolthers
                </span>
                <span className="text-xs text-muted-foreground">
                  Travel
                </span>
              </div>
            )}
          </Link>
          
          {/* Desktop collapse button */}
          {!isMobile && (
            <button
              onClick={navigation.toggleSidebar}
              className="p-1 rounded-md hover:bg-nav-item-hover transition-colors"
            >
              <svg
                className={cn(
                  'w-4 h-4 text-sidebar-foreground transition-transform',
                  navigation.isCollapsed && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <NavigationMenu
            items={navigation.navigationItems}
            isCollapsed={navigation.isCollapsed && !isMobile}
            activeItem={navigation.activeItem}
            onItemClick={(href) => {
              navigation.setActiveItem(href);
              if (isMobile) {
                navigation.toggleMobileMenu();
              }
            }}
          />
        </div>

        {/* User Info Footer */}
        {user && (!navigation.isCollapsed || isMobile) && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.role?.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}