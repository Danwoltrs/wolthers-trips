# INITIAL.md - Dashboard Foundation Setup

## FEATURE:
Create the core dashboard layout system for the Wolthers Travel Management App with protected routes, responsive navigation sidebar, header with theme toggle, and role-based navigation. This is the foundation that all other modules will build upon.

**Core Requirements:**
- Protected route wrapper that redirects unauthenticated users to login
- Responsive sidebar navigation with role-based menu items (Admin, Manager, User, Client)
- Header component with theme toggle (light/dark), user dropdown, and notifications
- Mobile-first responsive design that works on phone, tablet, and desktop
- Integration with existing OKLCH color system using CSS variables
- Proper TypeScript types and Zod validation
- Accessibility compliance (WCAG 2.1 AA)
- Real-time updates and state management with Zustand

**Technical Implementation:**
- Next.js 14+ App Router with `(dashboard)` route group
- Protected layout component using existing `useAuth()` hook
- Role-based navigation using database user roles (admin, manager, user, client)
- Theme system integration with existing CSS variables
- Mobile responsive with collapsible sidebar
- Loading states and error handling
- Navigation state persistence

## EXAMPLES:
Reference these existing patterns in the examples/ folder:

1. **Authentication Patterns** (`examples/auth/`)
   - Use existing `useAuth()` hook implementation
   - Follow session management patterns
   - Implement redirect logic for protected routes

2. **Color System Usage** (`examples/styling/`)
   - All colors must use CSS variables: `var(--color-primary)`, `var(--color-background)`
   - Follow established button, card, and layout patterns
   - Use existing utility classes for consistent spacing

3. **Component Structure** (`examples/components/`)
   - Follow TypeScript interface patterns for props
   - Use Zod schemas for form validation
   - Implement error boundary patterns

4. **Navigation Patterns** (`examples/navigation/`)
   - Role-based menu rendering
   - Active state management
   - Breadcrumb implementation

## DOCUMENTATION:
Essential documentation to reference during implementation:

### Project Structure & Guidelines
- `CLAUDE.md` - Global AI assistant rules, tech stack, and project conventions
- `task.md` - Current development tasks and priorities
- `README.md` - Project overview and setup instructions

### Core Architecture (docs/core/)
- `docs/core/architecture.md` - Complete tech stack and implementation patterns
- `docs/core/database-documentation.md` - Full database schema including user roles table
- `docs/core/color_system.md` - OKLCH color system implementation and usage
- `docs/core/deployment.md` - Environment variables and deployment configuration
- `docs/core/readme.md` - Core documentation overview

### Module Documentation (docs/modules/)
- `docs/modules/dashboard.md` - Detailed dashboard specifications, navigation structure, and role-based access
- `docs/modules/user_management.md` - User role definitions, permissions, and management workflows
- `docs/modules/company_management.md` - Company and location management patterns
- `docs/modules/trip_management.md` - Trip creation, branching, and management workflows
- `docs/modules/meeting_management.md` - Meeting scheduling and confirmation system
- `docs/modules/expense_management.md` - Expense tracking and approval workflows

### Development Resources (docs/development/)
- `docs/development/` folder - Development-specific documentation and patterns
- `examples/` folder - Code examples and implementation patterns to follow

### External API References
- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS with CSS Variables: https://tailwindcss.com/docs

### Current Implementation Status
- Database schema: ✅ Implemented and tested (see `docs/core/database-documentation.md`)
- Authentication system: ✅ Basic auth ready, needs dashboard integration
- Color system: ✅ Complete OKLCH system with CSS variables (see `docs/core/color_system.md`)
- Environment: ✅ All variables configured and working (see `docs/core/deployment.md`)
- Task tracking: ✅ Current tasks defined in `task.md`

## OTHER CONSIDERATIONS:

### Critical Implementation Details
1. **Route Protection**: Must redirect to `/login` if `useAuth()` returns no user, but avoid infinite redirect loops
2. **Role-Based Navigation**: Use the `user_roles` table to determine which navigation items to show:
   - Admin: All navigation items
   - Manager: All except system administration
   - User: Limited to trips, expenses, meetings they're involved in
   - Client: Read-only access to their company's trips

3. **Responsive Behavior**: 
   - Mobile (< 768px): Collapsible overlay sidebar
   - Tablet (768-1024px): Collapsible sidebar that pushes content
   - Desktop (> 1024px): Fixed sidebar with content adjustment

4. **Theme System Integration**: 
   - Must use existing CSS variables, not hardcoded colors
   - Theme toggle should persist across sessions
   - Dark/light mode affects all components consistently

5. **Performance Considerations**:
   - Lazy load dashboard content after authentication check
   - Use React.memo for navigation components to prevent unnecessary re-renders
   - Implement virtual scrolling if navigation lists become large

### Common AI Assistant Pitfalls to Avoid
- **Don't create new color variables** - use existing CSS variables from the implemented color system
- **Don't implement authentication from scratch** - use the existing `useAuth()` hook
- **Don't hardcode navigation items** - fetch user role from database and render conditionally
- **Don't forget mobile responsiveness** - this is a mobile-first application
- **Don't skip TypeScript types** - all components need proper interfaces
- **Don't forget loading states** - authentication checks take time, show appropriate spinners

### File Structure to Create
```
src/
├── app/(dashboard)/
│   ├── layout.tsx           # Protected dashboard layout
│   └── page.tsx            # Dashboard home page
├── components/
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── NavigationMenu.tsx
│   │   ├── UserDropdown.tsx
│   │   └── ThemeToggle.tsx
│   └── auth/
│       └── AuthGuard.tsx    # Protected route wrapper
├── hooks/
│   ├── use-navigation.ts    # Navigation state management
│   └── use-theme.ts        # Theme management
└── types/
    └── dashboard.ts        # Dashboard-specific types
```

### Success Criteria Validation
The implementation must pass these tests:
1. Unauthenticated users are redirected to login
2. Different user roles see appropriate navigation items
3. Theme toggle works and persists across page refreshes
4. Sidebar collapses properly on mobile devices
5. All colors use CSS variables (no hardcoded hex values)
6. Navigation highlights active page correctly
7. User dropdown shows correct user information and logout works
8. Loading states display during authentication checks
9. Error boundaries catch and display authentication errors
10. All components pass TypeScript strict mode compilation