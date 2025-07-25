# Styling Documentation - Tailwind Color Codes

## 🎨 Core Color System

### Foundation Colors
Use these Tailwind classes for all base elements:
```css
/* Light Theme */
bg-neutral-100        /* Background: oklch(0.9500 0.0156 86.4259) */
text-black            /* Foreground: oklch(0 0 0) */
bg-neutral-200        /* Muted background: oklch(0.9220 0 0) */
text-gray-600         /* Muted foreground: oklch(0.5240 0.2080 28.5186) */

/* Dark Theme */
bg-slate-800          /* Background: oklch(0.2407 0.0083 240.2250) */
text-slate-200        /* Foreground: oklch(0.7595 0.0107 238.5621) */
bg-slate-700          /* Muted background: oklch(0.2926 0.0159 240.3354) */
text-slate-400        /* Muted foreground: oklch(0.6107 0.0824 238.9684) */
```

### Primary Palette
Main brand colors for buttons, links, and primary actions:
```css
bg-green-600         /* Primary: oklch(0.4166 0.0697 152.1075) */
text-white           /* Primary foreground: oklch(1 0 0) */
bg-neutral-200       /* Secondary: oklch(0.9220 0 0) */
text-gray-900        /* Secondary foreground: oklch(0.2050 0 0) */
```

### Accent Colors
For highlights, hover states, and secondary elements:
```css
bg-neutral-100      /* Accent: oklch(0.9700 0 0) */
text-gray-900       /* Accent foreground: oklch(0.2050 0 0) */
```

### Card System
For content containers and surfaces:
```css
bg-white            /* Card background: oklch(1 0 0) */
text-gray-900       /* Card foreground: oklch(0.2050 0 0) */
border-gray-200     /* Card border: oklch(0.9220 0 0) */
```

## 🚨 Status Colors

### Destructive/Error States
```css
bg-red-600          /* Destructive: oklch(0.5762 0.2332 27.3288) */
text-white          /* Destructive foreground: oklch(1 0 0) */
```

### Informational States
```css
bg-cyan-600         /* Info: oklch(0.6539 0.1132 151.7077) */
text-white          /* Info foreground: oklch(1 0 0) */
```

### Success States
```css
bg-green-700        /* Success: oklch(0.4166 0.0697 152.1075) */
text-white          /* Success foreground: oklch(1 0 0) */
```

### Warning States
```css
bg-yellow-400       /* Warning: oklch(0.8343 0.1055 152.9098) */
text-black          /* Warning foreground: oklch(0 0 0) */
```

## 📊 Data Visualization

### Chart Color Palette
```css
/* 5-Color Chart System */
bg-green-700       /* Chart 1: oklch(0.4166 0.0697 152.1075) */
bg-cyan-600        /* Chart 2: oklch(0.6539 0.1132 151.7077) */
bg-yellow-400      /* Chart 3: oklch(0.8343 0.1055 152.9098) */
bg-yellow-200      /* Chart 4: oklch(0.9486 0.0717 154.6254) */
bg-yellow-50       /* Chart 5: oklch(0.9906 0.0139 155.5988) */
```
Usage Guidelines
- Chart 1-2: Primary data series (revenue, trips)
- Chart 3-4: Secondary metrics (costs, time)
- Chart 5: Accent data or highlights

## 🧭 Navigation Colors

### Sidebar System
```css
/* Sidebar Layout */
bg-neutral-50       /* Sidebar background: oklch(0.9850 0 0) */
text-gray-600       /* Sidebar text: oklch(0.5240 0.2080 28.5186) */

/* Navigation States */
bg-gray-900         /* Active nav item: oklch(0.2050 0 0) */
text-neutral-50     /* Active nav text: oklch(0.9850 0 0) */
bg-neutral-200      /* Hover nav item: oklch(0.9700 0 0) */
text-gray-900       /* Hover nav text: oklch(0.2050 0 0) */

/* Navigation Border */
border-gray-300     /* Sidebar borders: oklch(0.9220 0 0) */
ring-gray-500       /* Focus ring: oklch(0.7080 0 0) */
```

## 🎯 Component Classes

### Button Variants
```css
/* Primary Button */
bg-green-600 hover:bg-green-700 text-white

/* Secondary Button */
bg-neutral-200 hover:bg-neutral-300 text-gray-900

/* Destructive Button */
bg-red-600 hover:bg-red-700 text-white

/* Ghost Button */
hover:bg-neutral-100 text-gray-900

/* Outline Button */
border border-gray-300 hover:bg-neutral-100 text-gray-900
```

### Badge Variants
```css
/* Default Badge */
bg-neutral-200 text-gray-900

/* Success Badge */
bg-green-100 text-green-800

/* Warning Badge */
bg-yellow-100 text-yellow-800

/* Error Badge */
bg-red-100 text-red-800

/* Info Badge */
bg-cyan-100 text-cyan-800
```

### Input States
```css
/* Default Input */
border-gray-300 focus:border-green-600 focus:ring-green-600

/* Error Input */
border-red-500 focus:border-red-500 focus:ring-red-500

/* Success Input */
border-green-500 focus:border-green-500 focus:ring-green-500
```

## 📱 Responsive Design Classes

### Container System
```css
/* Max widths */
max-w-sm     /* 384px */
max-w-md     /* 448px */
max-w-lg     /* 512px */
max-w-xl     /* 576px */
max-w-2xl    /* 672px */
max-w-4xl    /* 896px */
max-w-6xl    /* 1152px */
max-w-7xl    /* 1280px */
```

### Breakpoint Usage
```css
/* Mobile First */
class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"

/* Sidebar Responsive */
class="hidden md:block md:w-64 lg:w-72"

/* Navigation Responsive */
class="block md:hidden" /* Mobile menu toggle */
class="hidden md:block" /* Desktop navigation */
```

## 🔧 Tailwind Configuration

### Custom Colors Setup
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // green-600
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#e5e5e5', // neutral-200
          foreground: '#171717'  // gray-900
        },
        accent: {
          DEFAULT: '#f5f5f5', // neutral-100
          foreground: '#171717'
        },
        destructive: {
          DEFAULT: '#dc2626', // red-600
          foreground: '#ffffff'
        },
        success: {
          DEFAULT: '#059669', // green-600
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#fbbf24', // yellow-400
          foreground: '#000000'
        },
        info: {
          DEFAULT: '#0891b2', // cyan-600
          foreground: '#ffffff'
        }
      }
    }
  }
}
```

### Component Utility Classes
```css
/* Card Components */
.card {
  @apply bg-white border border-gray-200 rounded-lg shadow-sm;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-content {
  @apply px-6 py-4;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200;
}

/* Button Components */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply btn bg-green-600 hover:bg-green-700 text-white;
}

.btn-secondary {
  @apply btn bg-neutral-200 hover:bg-neutral-300 text-gray-900;
}

.btn-destructive {
  @apply btn bg-red-600 hover:bg-red-700 text-white;
}
```

## 🎨 Theme Implementation

### Dark Mode Classes
Add `dark:` prefix to all classes for dark mode variants:
```css
/* Example: Card in light and dark mode */
bg-white dark:bg-slate-800 
text-gray-900 dark:text-slate-200 
border-gray-200 dark:border-slate-700
```

### Theme Toggle Button
```css
bg-neutral-100 hover:bg-neutral-200 
dark:bg-slate-700 dark:hover:bg-slate-600 
text-gray-900 dark:text-slate-200
```

## 📋 Usage Examples

### Dashboard Card
```html
<div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
  <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-200">Trip Details</h3>
  </div>
  <div class="px-6 py-4">
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      Pending
    </span>
  </div>
</div>
```

### Navigation Item
```html
<a class="flex items-center px-4 py-2 text-gray-600 hover:bg-neutral-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-md transition-colors">
  Dashboard
</a>
```

### Form Input
```html
<input class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600">
```

## 🔄 Migration Notes
Replace all instances of CSS variables with these Tailwind classes:
```
var(--primary) → bg-green-600
var(--background) → bg-neutral-100 dark:bg-slate-800
var(--foreground) → text-black dark:text-slate-200
var(--muted) → bg-neutral-200 dark:bg-slate-700
var(--card) → bg-white dark:bg-slate-800
var(--border) → border-gray-200 dark:border-slate-700
```

This ensures consistent styling across the entire application while maintaining the established design system.

## ⚠️ Important Configuration Update (July 2025)

### Tailwind CSS Version Change
- **Previous**: Tailwind CSS v4.x (beta) with `@tailwindcss/postcss`
- **Current**: Tailwind CSS v3.4.17 (stable) with standard `tailwindcss` plugin

### PostCSS Configuration
```javascript
// postcss.config.js (Updated)
module.exports = {
  plugins: {
    tailwindcss: {},  // Changed from @tailwindcss/postcss
    autoprefixer: {},
  },
}
```

### CSS Import Syntax
```css
/* globals.css - Standard v3 syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This ensures stable CSS generation and proper styling across all components.

EOF < /dev/null