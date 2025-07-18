# OKLCH Color System Documentation

## 🎨 Overview
The Wolthers Travel App uses a comprehensive OKLCH-based color system for consistent, theme-aware design across all components. This system provides automatic light/dark mode support with precise color definitions.

## 🌈 Color Philosophy

### Why OKLCH?
- **Perceptually uniform** - Colors that look equally bright actually are
- **Future-proof** - Wide gamut support for modern displays
- **Precise control** - Mathematical color relationships
- **Accessibility** - Predictable contrast ratios
- **Theme consistency** - Smooth transitions between light/dark modes

## 🎯 Core Color Palette

### Primary Brand Colors
```css
/* Wolthers Brand Green */
--primary: oklch(0.4293 0.0597 164.4252);           /* Main brand color */
--primary-foreground: oklch(0.9895 0.0090 78.2827); /* Text on primary */

/* Clean Secondary */
--secondary: oklch(1.0000 0 0);                      /* Pure white */
--secondary-foreground: oklch(0.4298 0.0589 164.0275); /* Green on white */
```

### Layout & Background Colors
```css
/* App Structure */
--background: oklch(0.9500 0.0156 86.4259);         /* Main app background */
--foreground: oklch(0 0 0);                         /* Primary text color */

/* Card System */
--card: oklch(1 0 0);                               /* Card backgrounds */
--card-foreground: oklch(0.1450 0 0);               /* Card text */

/* Borders & Inputs */
--border: oklch(0.9220 0 0);                        /* Standard borders */
--input: oklch(0.9220 0 0);                         /* Input backgrounds */
--ring: oklch(0.7080 0 0);                          /* Focus rings */
```

### Interactive & State Colors
```css
/* Interactive Elements */
--accent: oklch(0.7882 0.0642 76.1505);             /* Hover states */
--accent-foreground: oklch(0 0 0);                  /* Text on accent */

/* Subtle Elements */
--muted: oklch(0.9700 0 0);                         /* Muted backgrounds */
--muted-foreground: oklch(0.5560 0 0);              /* Muted text */

/* Destructive Actions */
--destructive: oklch(0.5770 0.2450 27.3250);        /* Error/delete states */
--destructive-foreground: oklch(1 0 0);             /* Text on destructive */

/* Informational */
--info: oklch(0.6539 0.1132 151.7077);              /* Info states */
--info-foreground: oklch(1 0 0);                    /* Text on info */

/* Success States */
--success: oklch(0.4166 0.0697 152.1075);           /* Success states */
--success-foreground: oklch(1 0 0);                 /* Text on success */

/* Warning States */
--warning: oklch(0.8343 0.1055 152.9098);           /* Warning states */
--warning-foreground: oklch(0 0 0);                 /* Text on warning */
```

## 📊 Data Visualization Colors

### Chart Color Palette
```css
/* 5-Color Chart System */
--chart-1: oklch(0.4166 0.0697 152.1075);          /* Primary chart color */
--chart-2: oklch(0.6539 0.1132 151.7077);          /* Secondary chart color */
--chart-3: oklch(0.8343 0.1055 152.9098);          /* Tertiary chart color */
--chart-4: oklch(0.9486 0.0717 154.6254);          /* Quaternary chart color */
--chart-5: oklch(0.9906 0.0139 155.5988);          /* Quinary chart color */
```

### Usage Guidelines
- **Chart 1-2**: Primary data series (revenue, trips)
- **Chart 3-4**: Secondary metrics (costs, time)
- **Chart 5**: Accent data or highlights

## 🧭 Navigation Colors

### Sidebar System
```css
/* Sidebar Layout */
--sidebar: oklch(0.9850 0 0);                       /* Sidebar background */
--sidebar-foreground: oklch(0.5240 0.2080 28.5186); /* Sidebar text */

/* Navigation States */
--sidebar-primary: oklch(0.2050 0 0);               /* Active nav item */
--sidebar-primary-foreground: oklch(0.9850 0 0);   /* Active nav text */
--sidebar-accent: oklch(0.9700 0 0);                /* Hover nav item */
--sidebar-accent-foreground: oklch(0.2050 0 0);    /* Hover nav text */

/* Navigation Border */
--sidebar-border: oklch(0.9220 0 0);                /* Sidebar borders */
--sidebar-ring: oklch(0.7080 0 0);                  /* Focus indicators */
```

## 🌙 Dark Mode Implementation

### Dark Theme Colors
```css
.dark {
  /* Background System */
  --background: oklch(0.2407 0.0083 240.2250);      /* Dark background */
  --foreground: oklch(0.7595 0.0107 238.5621);      /* Light text */
  
  /* Card System */
  --card: oklch(0.2236 0.0084 240.2744);            /* Dark cards */
  --card-foreground: oklch(0.9851 0 0);             /* Light card text */
  
  /* Interactive Elements */
  --accent: oklch(0.3920 0.0890 240.9447);          /* Dark mode accent */
  --accent-foreground: oklch(0.9851 0 0);           /* Light accent text */
  
  /* Muted Elements */
  --muted: oklch(0.2236 0.0084 240.2744);           /* Dark muted bg */
  --muted-foreground: oklch(0.5240 0.0189 240.9447); /* Muted text */
  
  /* Borders & Inputs */
  --border: oklch(0.2236 0.0084 240.2744);          /* Dark borders */
  --input: oklch(0.2236 0.0084 240.2744);           /* Dark inputs */
  --ring: oklch(0.4298 0.0589 164.0275);            /* Focus rings */
  
  /* Sidebar Dark Mode */
  --sidebar: oklch(0.1804 0.0090 240.9447);         /* Dark sidebar */
  --sidebar-foreground: oklch(0.8444 0.0189 240.9447); /* Light sidebar text */
  --sidebar-accent: oklch(0.2236 0.0084 240.2744);  /* Dark hover */
  --sidebar-accent-foreground: oklch(0.9851 0 0);   /* Light hover text */
}
```

## ⚙️ Theme Management System

### Theme Provider Implementation
```typescript
// Theme context and provider
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

// Theme persistence
const THEME_STORAGE_KEY = 'wolthers-travel-theme';

// System preference detection
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};
```

### Theme Toggle Component
```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium 
                 transition-colors focus-visible:outline-none focus-visible:ring-2 
                 focus-visible:ring-ring focus-visible:ring-offset-2 
                 disabled:opacity-50 disabled:pointer-events-none 
                 ring-offset-background hover:bg-accent hover:text-accent-foreground 
                 h-10 w-10"
    >
      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
```

## 🎨 Component Color Usage

### Button Variants
```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.btn-primary:hover {
  background-color: oklch(from var(--primary) calc(l - 0.1) c h);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
}

/* Destructive Button */
.btn-destructive {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--foreground);
}

.btn-ghost:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
```

### Card Components
```css
/* Standard Card */
.card {
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Card Header */
.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

/* Card Content */
.card-content {
  padding: 1.5rem;
  padding-top: 0;
}

/* Card Footer */
.card-footer {
  padding: 1.5rem;
  padding-top: 0;
  display: flex;
  align-items: center;
}
```

## 📍 Travel-Specific Colors

### Status Indicators
```css
/* Trip Status Colors */
.status-draft { color: var(--muted-foreground); }
.status-confirmed { color: var(--success); }
.status-in-progress { color: var(--info); }
.status-completed { color: var(--primary); }
.status-cancelled { color: var(--destructive); }

/* Expense Status Colors */
.expense-status-pending { 
  background-color: var(--warning);
  color: var(--warning-foreground);
}
.expense-status-approved { 
  background-color: var(--success);
  color: var(--success-foreground);
}
.expense-status-rejected { 
  background-color: var(--destructive);
  color: var(--destructive-foreground);
}

/* Meeting Confirmation Colors */
.confirmation-pending { color: var(--warning); }
.confirmation-confirmed { color: var(--success); }
.confirmation-declined { color: var(--destructive); }
```

### Currency Display
```css
/* Currency-specific colors */
.currency-usd { color: oklch(0.4166 0.0697 152.1075); }
.currency-brl { color: oklch(0.6539 0.1132 151.7077); }
.currency-eur { color: oklch(0.3920 0.0890 240.9447); }

/* Amount highlighting */
.amount-positive { color: var(--success); }
.amount-negative { color: var(--destructive); }
.amount-neutral { color: var(--foreground); }
```

## 🔧 Tailwind Integration

### Tailwind Configuration
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};
```

### CSS Variables Setup
```css
/* globals.css */
@layer base {
  :root {
    /* Radius */
    --radius: 0.5rem;
    
    /* All color variables defined here */
    --background: oklch(0.9500 0.0156 86.4259);
    --foreground: oklch(0 0 0);
    /* ... rest of color variables */
  }
  
  .dark {
    /* Dark mode overrides */
    --background: oklch(0.2407 0.0083 240.2250);
    --foreground: oklch(0.7595 0.0107 238.5621);
    /* ... rest of dark color variables */
  }
}

/* Ensure smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

## 🧪 Testing & Validation

### Color Contrast Testing
```typescript
// Accessibility validation
const validateContrast = (foreground: string, background: string): boolean => {
  // WCAG 2.1 AA requires 4.5:1 contrast ratio for normal text
  // WCAG 2.1 AA requires 3:1 contrast ratio for large text
  const ratio = calculateContrastRatio(foreground, background);
  return ratio >= 4.5;
};

// Test all color combinations
const contrastTests = [
  { fg: '--primary-foreground', bg: '--primary' },
  { fg: '--secondary-foreground', bg: '--secondary' },
  { fg: '--accent-foreground', bg: '--accent' },
  { fg: '--destructive-foreground', bg: '--destructive' },
  { fg: '--muted-foreground', bg: '--muted' },
  { fg: '--card-foreground', bg: '--card' },
];
```

### Browser Support
- **Modern browsers**: Full OKLCH support (Chrome 111+, Firefox 113+, Safari 15.4+)
- **Fallback strategy**: Automatic conversion to RGB for older browsers
- **Color space detection**: Progressive enhancement approach

## 📱 Interactive Demo

### Color System Demo Component
Available at `/test-page` → "View Color System"

Features:
- Live color palette display
- Theme switching demonstration
- Contrast ratio validation
- Color picker for custom modifications
- Export functionality for design tokens

## 🎯 Best Practices

### Do's
- ✅ Use CSS variables for all colors
- ✅ Test in both light and dark modes
- ✅ Validate contrast ratios
- ✅ Use semantic color names
- ✅ Leverage Tailwind utilities

### Don'ts
- ❌ Hardcode color values in components
- ❌ Create new colors without system integration
- ❌ Ignore accessibility requirements
- ❌ Override theme colors without consideration
- ❌ Use colors outside the defined palette

## 🔄 Migration Guide

### From Hardcoded Colors
```css
/* Before */
.button {
  background-color: #16a34a;
  color: white;
}

/* After */
.button {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

### From Tailwind Classes
```html
<!-- Before -->
<div class="bg-green-600 text-white">

<!-- After -->
<div class="bg-primary text-primary-foreground">
```

---
*Last updated: January 2025*  
*Version: 1.0*  
*Full OKLCH implementation with Tailwind integration*