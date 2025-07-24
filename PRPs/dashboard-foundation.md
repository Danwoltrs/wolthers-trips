# PRP: Dashboard Foundation Setup

## Executive Summary

This PRP outlines the implementation of the core dashboard layout system for the Wolthers Travel Management App. The foundation includes protected routes, responsive navigation sidebar, header with theme toggle, and role-based navigation. This is the critical foundation that all other modules will build upon.

**Status**: Ready for implementation  
**Priority**: URGENT  
**Estimated Time**: 4-6 hours  
**Dependencies**: ✅ Authentication system, ✅ Database schema, ✅ Color system

## Context & Research Findings

### Current Implementation Status
- **Database**: ✅ Supabase PostgreSQL fully configured with 14+ tables
- **Authentication**: ✅ NextAuth.js with Microsoft OAuth + role-based sessions
- **Color System**: ✅ Complete Tailwind implementation with CSS variables
- **Environment**: ✅ All variables configured and tested at `/test-page`
- **Theme System**: ✅ Light/dark mode with persistence and toggle component

### Existing Codebase Patterns to Follow

#### Authentication Pattern
```typescript
// Current NextAuth implementation in src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "azure-ad",
      name: "Azure AD",
      type: "oauth",
      authorization: {
        url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        params: {
          scope: "openid email profile",
          response_type: "code",
        },
      },
      // Role assignment in session callback
      callbacks: {
        session: async ({ session, token }) => {
          if (token.email === "daniel@wolthers.com") {
            session.user.role = "GLOBAL_ADMIN";
          } else if (token.email?.endsWith("@wolthers.com")) {
            session.user.role = "WOLTHERS_STAFF";
          } else {
            session.user.role = "CLIENT";
          }
          return session;
        }
      }
    }
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};
```

#### Color System Pattern (CSS Variables)
```css
/* From src/styles/globals.css - Use these exact variables */
:root {
  --primary: oklch(0.4293 0.0597 164.4252);
  --primary-foreground: oklch(0.9895 0.0090 78.2827);
  --secondary: oklch(1.0000 0 0);
  --secondary-foreground: oklch(0.4298 0.0589 164.0275);
  --background: oklch(0.9500 0.0156 86.4259);
  --foreground: oklch(0 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.1450 0 0);
  --sidebar-background: oklch(0.9675 0.0116 86.4259);
  --sidebar-foreground: oklch(0.4298 0.0589 164.0275);
  --nav-item-hover: oklch(0.9369 0.0234 86.4259);
}
```

#### Theme System Pattern
```typescript
// From src/components/theme-provider.tsx
const ThemeProvider = ({ children, ...props }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
};
```

#### Component Pattern (From src/styles/components.css)
```css
/* Follow these existing component patterns */
.btn {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.card {
  @apply rounded-lg border border-border bg-card text-card-foreground shadow-sm;
}

.nav-item {
  @apply flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-nav-item-hover;
}
```

### Database Schema for User Roles
```sql
-- From docs/core/database-documentation.md
CREATE TYPE user_role AS ENUM (
  'global_admin',      -- Full system access (daniel@wolthers.com)
  'wolthers_staff',    -- Wolthers employees (@wolthers.com)
  'company_admin',     -- Company administrators
  'client_admin',      -- Business owners/CEOs
  'finance_department',-- Finance team members
  'client',            -- Regular client users
  'driver'             -- Vehicle drivers
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Navigation Structure by Role
```typescript
// From docs/core/modules/dashboard.md
const navigationItems = {
  global_admin: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Users', href: '/dashboard/users', icon: 'Users' },
    { name: 'Companies', href: '/dashboard/companies', icon: 'Building2' },
    { name: 'Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Fleet', href: '/dashboard/fleet', icon: 'Car' },
    { name: 'Finance', href: '/dashboard/finance', icon: 'CreditCard' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  ],
  wolthers_staff: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Companies', href: '/dashboard/companies', icon: 'Building2' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
    { name: 'Fleet', href: '/dashboard/fleet', icon: 'Car' },
  ],
  client: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Trips', href: '/dashboard/trips', icon: 'MapPin' },
    { name: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
  ]
};
```

## Implementation Blueprint

### Phase 1: Authentication Infrastructure
```typescript
// 1. Create useAuth hook (src/hooks/use-auth.ts)
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user || null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    role: session?.user?.role || null,
    hasRole: (role: string) => session?.user?.role === role,
    hasAnyRole: (roles: string[]) => roles.includes(session?.user?.role || ''),
  };
}

// 2. Create AuthGuard component (src/components/auth/AuthGuard.tsx)
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

### Phase 2: Dashboard Layout Foundation
```typescript
// 3. Create dashboard layout (src/app/(dashboard)/layout.tsx)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

// 4. Create sidebar component (src/components/dashboard/DashboardSidebar.tsx)
export function DashboardSidebar() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = getNavigationItems(user?.role);

  return (
    <div className={cn(
      "bg-sidebar-background border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <NavigationMenu items={navigationItems} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
```

### Phase 3: Responsive Design & Mobile Support
```typescript
// 5. Add responsive behavior with mobile overlay
export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "bg-sidebar-background border-r border-border transition-all duration-300",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-64 transform" : "relative",
        isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0",
        !isMobile && isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Navigation content */}
      </div>
    </>
  );
}
```

## Documentation References

### Essential Documentation
1. **Authentication System**: https://next-auth.js.org/getting-started/example
2. **Next.js App Router**: https://nextjs.org/docs/app/building-your-application/routing/route-groups
3. **Tailwind CSS Variables**: https://tailwindcss.com/docs/customizing-colors#using-css-variables
4. **Core Architecture**: `/docs/core/architecture.md`
5. **Database Schema**: `/docs/core/database-documentation.md`
6. **Color System**: `/docs/core/color_system.md`
7. **Dashboard Module**: `/docs/core/modules/dashboard.md`

### External API References
- **Supabase Auth**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Lucide Icons**: https://lucide.dev/icons/
- **React Hook Form**: https://react-hook-form.com/get-started
- **Zod Validation**: https://zod.dev/?id=basic-usage

## Implementation Tasks (In Order)

### Task 1: Authentication Infrastructure
1. Create `src/hooks/use-auth.ts` - Custom authentication hook
2. Create `src/components/auth/AuthGuard.tsx` - Route protection component
3. Create `src/hooks/use-navigation.ts` - Navigation state management
4. Add TypeScript types in `src/types/dashboard.ts`

### Task 2: Layout Foundation
1. Create `src/app/(dashboard)/layout.tsx` - Protected dashboard layout
2. Create `src/components/dashboard/DashboardSidebar.tsx` - Navigation sidebar
3. Create `src/components/dashboard/DashboardHeader.tsx` - Header with user dropdown
4. Create `src/components/dashboard/NavigationMenu.tsx` - Role-based navigation

### Task 3: Navigation Components
1. Create `src/components/dashboard/UserDropdown.tsx` - User menu and logout
2. Update `src/components/theme-toggle.tsx` - Integrate with header
3. Create responsive utilities for mobile support
4. Add active state management for navigation items

### Task 4: Dashboard Home Page
1. Create `src/app/(dashboard)/page.tsx` - Dashboard overview
2. Add role-based dashboard cards and statistics
3. Implement quick actions and recent activity
4. Add real-time updates with React Query

### Task 5: Testing & Validation
1. Test authentication flows and redirects
2. Validate role-based navigation visibility
3. Test responsive design across devices
4. Verify theme toggle functionality
5. Test navigation state persistence

## Error Handling Strategy

### Authentication Errors
```typescript
// Handle authentication failures gracefully
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground mt-2">{error.message}</p>
          <Button onClick={() => router.push('/auth/signin')} className="mt-4">
            Sign In Again
          </Button>
        </div>
      </div>
    );
  }

  // Rest of component...
}
```

### Navigation Errors
```typescript
// Handle navigation failures
export function NavigationMenu({ items, isCollapsed }: NavigationMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    try {
      router.push(href);
    } catch (error) {
      console.error('Navigation error:', error);
      // Show toast notification or fallback
    }
  };

  // Rest of component...
}
```

## Critical Gotchas & Common Pitfalls

### 1. Infinite Redirect Loop
```typescript
// ❌ Wrong - Can cause infinite redirects
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/auth/signin');
  }
}, [isAuthenticated, router]);

// ✅ Correct - Check loading state first
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/signin');
  }
}, [isAuthenticated, isLoading, router]);
```

### 2. Hardcoded Colors
```typescript
// ❌ Wrong - Don't hardcode colors
<div className="bg-blue-500 text-white">

// ✅ Correct - Use CSS variables
<div className="bg-primary text-primary-foreground">
```

### 3. Missing Mobile Responsive
```typescript
// ❌ Wrong - Desktop-only sidebar
<div className="w-64 bg-sidebar-background">

// ✅ Correct - Responsive with mobile overlay
<div className={cn(
  "bg-sidebar-background transition-all duration-300",
  isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : "relative w-64"
)}>
```

### 4. Role-Based Navigation Issues
```typescript
// ❌ Wrong - Hardcoded navigation
const navItems = ['Dashboard', 'Users', 'Settings'];

// ✅ Correct - Role-based navigation
const navItems = getNavigationItems(user?.role);
```

## Validation Gates (Executable)

### 1. TypeScript Compilation
```bash
# Must pass without errors
npx tsc --noEmit
```

### 2. Linting
```bash
# Must pass all linting rules
npm run lint
```

### 3. Authentication Tests
```bash
# Test authentication flows
npm run test -- --testNamePattern="Auth"
```

### 4. Visual Regression Tests
```bash
# Test responsive design
npm run test:visual
```

### 5. Accessibility Tests
```bash
# Test WCAG compliance
npm run test:a11y
```

## Success Criteria Checklist

### Authentication & Security
- [ ] Unauthenticated users redirect to login without infinite loops
- [ ] Role-based navigation shows appropriate items only
- [ ] Session persistence works across page refreshes
- [ ] Logout functionality works correctly
- [ ] Error boundaries catch authentication failures

### User Interface
- [ ] Theme toggle works and persists (light/dark/system)
- [ ] All colors use CSS variables (no hardcoded values)
- [ ] Navigation highlights active page correctly
- [ ] Loading states display during authentication checks
- [ ] User dropdown shows correct information

### Responsive Design
- [ ] Mobile (< 768px): Collapsible overlay sidebar
- [ ] Tablet (768-1024px): Collapsible sidebar that pushes content
- [ ] Desktop (> 1024px): Fixed sidebar with content adjustment
- [ ] Touch interactions work on mobile devices

### Performance & Accessibility
- [ ] Components use React.memo to prevent unnecessary re-renders
- [ ] Proper ARIA labels and keyboard navigation
- [ ] Page load performance < 2 seconds
- [ ] No console errors or warnings

## Implementation Confidence Score

**Score: 9/10**

### Strengths:
- Comprehensive existing authentication system
- Complete color system with CSS variables
- Well-documented database schema
- Clear role-based access patterns
- Proven Next.js App Router structure

### Risk Mitigation:
- All dependencies are resolved and tested
- Patterns exist in codebase to follow
- Clear validation gates provided
- Detailed error handling strategy
- Comprehensive documentation references

### Minor Risks:
- Mobile responsive testing across different devices
- Role-based navigation edge cases with permissions

This PRP provides complete context for one-pass implementation success with Claude Code's comprehensive toolset and the existing robust foundation.