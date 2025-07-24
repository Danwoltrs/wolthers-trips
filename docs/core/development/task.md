# TASK.md - Claude Code Development Tasks

## 🎯 Current Status
**Phase**: Dashboard Development  
**Priority**: High  
**Dependencies**: Authentication (✅), Database (✅), Color System (✅)

## 📋 Immediate Tasks (Next 3 Days)

### TASK-001: Dashboard Foundation Setup
**Priority**: URGENT  
**Estimated Time**: 4-6 hours  
**Status**: PENDING

**Description**: Create the core dashboard layout with protected routes, navigation sidebar, and header components using the established Tailwind color system.

**Requirements**:
1. Create `app/(dashboard)/layout.tsx` with protected route wrapper
2. Implement `DashboardSidebar` component with role-based navigation
3. Build `DashboardHeader` with theme toggle and user dropdown
4. Add responsive design for mobile/tablet/desktop
5. Integrate with existing color system (all colors from CSS variables)

**Files to Create/Modify**:
```
src/app/(dashboard)/
├── layout.tsx
├── page.tsx
src/components/
├── dashboard/
│   ├── DashboardSidebar.tsx
│   ├── DashboardHeader.tsx
│   ├── NavigationMenu.tsx
│   └── UserDropdown.tsx
├── auth/
│   └── AuthGuard.tsx
src/hooks/
└── use-navigation.ts
```

**Acceptance Criteria**:
- [ ] Protected routes redirect to login if not authenticated
- [ ] Sidebar shows role-appropriate navigation items
- [ ] Theme toggle works correctly (light/dark)
- [ ] Responsive design functions on all screen sizes
- [ ] All components use CSS variables for colors
- [ ] Navigation highlights active page
- [ ] User dropdown shows correct user info and logout

**Implementation Notes**:
- Use `useAuth()` hook for authentication state
- Reference `docs/modules/dashboard.md` for navigation structure
- All styling must use the Tailwind color system
- Ensure accessibility with proper ARIA labels
- Test with different user roles

---

### TASK-002: User Management Module
**Priority**: HIGH  
**Estimated Time**: 6-8 hours  
**Status**: PENDING  
**Dependencies**: TASK-001

**Description**: Implement complete user management functionality including CRUD operations, role assignment, and profile management.

**Requirements**:
1. Create user list page with search and filtering
2. Implement user creation and editing forms
3. Build user profile management
4. Add role-based permission checks
5. Create user invitation system

**Files to Create/Modify**:
```
src/app/(dashboard)/users/
├── page.tsx
├── create/
│   └── page.tsx
├── [id]/
│   ├── page.tsx
│   └── edit/
│       └── page.tsx
src/components/users/
├── UserList.tsx
├── UserForm.tsx
├── UserCard.tsx
├── RoleSelector.tsx
└── InviteUserModal.tsx
src/lib/api/
└── users.ts
```

**API Endpoints to Implement**:
```typescript
// GET /api/users - List users with filters
// POST /api/users - Create user
// GET /api/users/[id] - Get user details
// PUT /api/users/[id] - Update user
// DELETE /api/users/[id] - Delete user
// POST /api/users/invite - Send user invitation
```

**Acceptance Criteria**:
- [ ] User list displays with proper role-based filtering
- [ ] User creation form validates all required fields
- [ ] Role assignment works correctly
- [ ] Profile editing saves successfully
- [ ] Search and filtering functions properly
- [ ] Permission checks prevent unauthorized actions
- [ ] Email invitations send correctly

---

### TASK-003: Company Management Foundation
**Priority**: HIGH  
**Estimated Time**: 8-10 hours  
**Status**: PENDING  
**Dependencies**: TASK-002

**Description**: Build company management system with locations and contacts, following the detailed specification in the documentation.

**Requirements**:
1. Implement company CRUD operations
2. Add location management for multiple locations per company
3. Create contact management system
4. Build search and filtering capabilities
5. Add Google Maps integration for location data

**Files to Create/Modify**:
```
src/app/(dashboard)/companies/
├── page.tsx
├── create/
│   └── page.tsx
├── [id]/
│   ├── page.tsx
│   ├── edit/
│   │   └── page.tsx
│   ├── locations/
│   │   └── page.tsx
│   └── contacts/
│       └── page.tsx
src/components/companies/
├── CompanyList.tsx
├── CompanyForm.tsx
├── LocationManager.tsx
├── ContactManager.tsx
└── CompanySearch.tsx
```

**Acceptance Criteria**:
- [ ] Company list with advanced search/filtering
- [ ] Multi-step company creation wizard
- [ ] Location management with Google Maps
- [ ] Contact management with communication tracking
- [ ] Company analytics dashboard
- [ ] Export functionality for company data

## 📅 Sprint Planning (Next 2 Weeks)

### Week 1: Core Foundation
- **Day 1-2**: TASK-001 (Dashboard Foundation)
- **Day 3-4**: TASK-002 (User Management)
- **Day 5**: TASK-003 Start (Company Management)

### Week 2: Advanced Features
- **Day 1-2**: TASK-003 Complete (Company Management)
- **Day 3-4**: Trip Management Foundation
- **Day 5**: Meeting Management Setup

## 🎯 Development Guidelines

### Code Quality Standards
1. **TypeScript Strict Mode**: All code must pass strict TypeScript checks
2. **Zod Validation**: All forms and API inputs must use Zod schemas
3. **Error Handling**: Comprehensive error boundaries and user feedback
4. **Performance**: Optimize for Core Web Vitals
5. **Accessibility**: WCAG 2.1 AA compliance

### File Organization
```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── [module]/          # Module-specific components
│   └── layout/            # Layout components
├── lib/                   # Utilities and services
│   ├── api/               # API functions
│   ├── validations/       # Zod schemas
│   └── utils/             # Helper functions
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript definitions
└── styles/                # Global styles
```

### Color System Usage
```tsx
// ✅ Correct - Use CSS variables
<div className="bg-primary text-primary-foreground">
<div className="hover:bg-accent hover:text-accent-foreground">

// ❌ Wrong - Don't hardcode colors
<div className="bg-blue-500 text-white">
<div style={{ backgroundColor: '#3b82f6' }}>
```

### Component Examples
```tsx
// Button component using color system
export function Button({ variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        variants[variant],
        props.className
      )}
      {...props}
    />
  );
}
```

## 🔧 API Development Pattern

### Standard API Route Structure
```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { z } from 'zod';

const CreateSchema = z.object({
  // Define schema
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Implement logic with RLS
    const { data, error } = await supabase
      .from('table_name')
      .select('*');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateSchema.parse(body);
    
    // Implement creation logic
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 🧪 Testing Requirements

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage for utilities and hooks
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows
- **Accessibility Tests**: All interactive components

### Testing Tools
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **axe-core**: Accessibility testing

## 📝 Documentation Updates

### Required Documentation
1. Update `README.md` with new features
2. Document API endpoints in respective module files
3. Add component documentation with Storybook
4. Update deployment guide with new environment variables

## 🚨 Known Issues & Considerations

### Current Blockers
- None (all dependencies resolved)

### Performance Considerations
- Implement virtual scrolling for large lists
- Use React Query for caching and background updates
- Optimize images with Next.js Image component
- Implement code splitting for route-based chunks

### Security Considerations
- All database queries use RLS policies
- Input validation on both client and server
- File upload size and type restrictions
- Rate limiting on API endpoints

## 🎯 Success Metrics

### Key Performance Indicators
- **Page Load Speed**: < 2 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Lighthouse Score**: > 90
- **Error Rate**: < 1%
- **User Task Completion**: > 95%

### User Experience Goals
- Intuitive navigation and workflows
- Responsive design on all devices
- Accessible to users with disabilities
- Consistent visual design and interactions

---

## 📞 Support & Resources

### Documentation References
- **Core Architecture**: `docs/core/architecture.md`
- **Database Schema**: `docs/core/database.md`
- **Color System**: `docs/core/color-system.md`
- **Current Module**: `docs/modules/dashboard.md`

### Quick Links
- **Test Page**: `http://localhost:3000/test-page`
- **Color Demo**: `http://localhost:3000/test-page` → "View Color System"
- **Database**: Supabase Dashboard
- **Deployment**: Vercel Dashboard

### Emergency Contacts
- **Technical Issues**: Check documentation first
- **Database Issues**: Verify connection at test page
- **Deployment Issues**: Check Vercel logs

---
*Last Updated: January 2025*  
*Next Review: After TASK-001 completion*  
*Priority: Complete dashboard foundation before proceeding*