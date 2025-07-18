'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { NavigationItem } from '@/types/dashboard';

interface NavigationMenuProps {
  items: NavigationItem[];
  isCollapsed: boolean;
  activeItem: string | null;
  onItemClick: (href: string) => void;
  className?: string;
}

// Icon mapping for navigation items
const IconMap: Record<string, React.ReactElement> = {
  LayoutDashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
    </svg>
  ),
  Users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Building2: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
    </svg>
  ),
  MapPin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Car: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  CreditCard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Receipt: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  FileText: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  BarChart3: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  CheckSquare: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function NavigationMenu({ 
  items, 
  isCollapsed, 
  activeItem, 
  onItemClick, 
  className 
}: NavigationMenuProps) {
  const router = useRouter();

  const handleItemClick = (item: NavigationItem) => {
    onItemClick(item.href);
    router.push(item.href);
  };

  const isItemActive = (href: string) => {
    if (activeItem === href) return true;
    
    // Check if current item is a parent of the active item
    if (activeItem && activeItem.startsWith(href) && href !== '/dashboard') {
      return true;
    }
    
    return false;
  };

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => {
        const isActive = isItemActive(item.href);
        const Icon = IconMap[item.icon] || IconMap['LayoutDashboard'];
        
        return (
          <div key={item.href}>
            <button
              onClick={() => handleItemClick(item)}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-nav-item-hover group',
                isActive 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'text-sidebar-foreground hover:text-foreground'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <div className={cn(
                'flex-shrink-0 transition-colors',
                isActive 
                  ? 'text-primary-foreground' 
                  : 'text-sidebar-foreground group-hover:text-foreground'
              )}>
                {Icon}
              </div>
              
              {!isCollapsed && (
                <span className="flex-1 text-left">
                  {item.name}
                </span>
              )}
              
              {!isCollapsed && item.badge && (
                <span className={cn(
                  'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
                  isActive 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-primary/10 text-primary'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
            
            {/* Submenu items (if any) */}
            {item.children && !isCollapsed && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => {
                  const isChildActive = isItemActive(child.href);
                  const ChildIcon = IconMap[child.icon] || IconMap['LayoutDashboard'];
                  
                  return (
                    <button
                      key={child.href}
                      onClick={() => handleItemClick(child)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-nav-item-hover group',
                        isChildActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <div className="flex-shrink-0 w-4 h-4">
                        {ChildIcon}
                      </div>
                      <span className="flex-1 text-left">
                        {child.name}
                      </span>
                      {child.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {child.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}