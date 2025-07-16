# Wolthers Travel App - Color System Documentation

## Overview

This document describes the centralized color scheme system implemented for the Wolthers Travel App using CSS variables and Tailwind CSS integration. The system provides a consistent, theme-aware color palette that works seamlessly across all components.

## File Structure

```
src/
├── styles/
│   ├── globals.css          # Main color definitions with CSS variables
│   ├── components.css       # Component-specific styles
│   └── utilities.css        # Utility classes
├── components/
│   ├── theme-provider.tsx   # Theme management context
│   ├── theme-toggle.tsx     # Theme switching components
│   └── color-demo.tsx       # Color system demonstration
└── app/
    ├── layout.tsx           # Root layout with theme provider
    └── test-page/
        └── page.tsx         # Updated to use new color system
```

## Color Variables

### Primary Colors
- `--primary`: Main brand color - `oklch(0.4293 0.0597 164.4252)`
- `--primary-foreground`: Text on primary background - `oklch(0.9895 0.0090 78.2827)`
- `--secondary`: Secondary color - `oklch(1.0000 0 0)`
- `--secondary-foreground`: Text on secondary background - `oklch(0.4298 0.0589 164.0275)`

### Background Colors
- `--background`: Main background - `oklch(0.9500 0.0156 86.4259)`
- `--foreground`: Main text color - `oklch(0 0 0)`
- `--card`: Card background - `oklch(1 0 0)`
- `--card-foreground`: Text on cards - `oklch(0.1450 0 0)`

### Accent Colors
- `--accent`: Accent color - `oklch(0.7882 0.0642 76.1505)`
- `--accent-foreground`: Text on accent background - `oklch(0 0 0)`
- `--muted`: Muted background - `oklch(0.9700 0 0)`
- `--muted-foreground`: Muted text - `oklch(0.5560 0 0)`

### Functional Colors
- `--destructive`: Error/danger color - `oklch(0.5770 0.2450 27.3250)`
- `--destructive-foreground`: Text on destructive background - `oklch(1 0 0)`
- `--border`: Border color - `oklch(0.9220 0 0)`
- `--input`: Input field background - `oklch(0.9220 0 0)`
- `--ring`: Focus ring color - `oklch(0.7080 0 0)`

### Chart Colors
- `--chart-1`: Chart color 1 - `oklch(0.4166 0.0697 152.1075)`
- `--chart-2`: Chart color 2 - `oklch(0.6539 0.1132 151.7077)`
- `--chart-3`: Chart color 3 - `oklch(0.8343 0.1055 152.9098)`
- `--chart-4`: Chart color 4 - `oklch(0.9486 0.0717 154.6254)`
- `--chart-5`: Chart color 5 - `oklch(0.9906 0.0139 155.5988)`

### Sidebar Colors
- `--sidebar`: Sidebar background - `oklch(0.9850 0 0)`
- `--sidebar-foreground`: Sidebar text - `oklch(0.5240 0.2080 28.5186)`
- `--sidebar-primary`: Sidebar primary color - `oklch(0.2050 0 0)`
- `--sidebar-primary-foreground`: Text on sidebar primary - `oklch(0.9850 0 0)`
- `--sidebar-accent`: Sidebar accent - `oklch(0.9700 0 0)`
- `--sidebar-accent-foreground`: Text on sidebar accent - `oklch(0.2050 0 0)`
- `--sidebar-border`: Sidebar border - `oklch(0.9220 0 0)`
- `--sidebar-ring`: Sidebar focus ring - `oklch(0.7080 0 0)`

## Dark Mode Support

The system includes a complete dark mode implementation with automatic theme detection:

### Dark Mode Colors
All colors have dark mode variants defined in the `.dark` class, maintaining the same variable names but with different OKLCH values optimized for dark backgrounds.

### Theme Provider
```tsx
import { ThemeProvider } from '@/components/theme-provider'

// In your app layout
<ThemeProvider defaultTheme="system" storageKey="wolthers-travel-theme">
  {children}
</ThemeProvider>
```

### Theme Toggle
```tsx
import { ThemeToggle } from '@/components/theme-toggle'

// Usage
<ThemeToggle />          // With text label
<ThemeToggleIcon />      // Icon only
```

## Tailwind CSS Integration

The color system is fully integrated with Tailwind CSS:

```javascript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        // ... all other colors
      },
    },
  },
}
```

## Usage Examples

### Using Tailwind Classes
```tsx
<div className="bg-primary text-primary-foreground">
  Primary button
</div>

<div className="bg-card text-card-foreground border border-border">
  Card content
</div>
```

### Using Component Classes
```tsx
<button className="btn btn-primary">
  Primary Button
</button>

<div className="card">
  <div className="card-header">
    <h3 className="card-title">Card Title</h3>
  </div>
  <div className="card-content">
    Card content
  </div>
</div>
```

### Using CSS Variables Directly
```css
.custom-component {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}
```

## Component Styles

### Button Variants
- `.btn-primary`: Primary button style
- `.btn-secondary`: Secondary button style
- `.btn-outline`: Outline button style
- `.btn-ghost`: Ghost button style
- `.btn-destructive`: Destructive button style
- `.btn-link`: Link button style

### Button Sizes
- `.btn-sm`: Small button
- `.btn-lg`: Large button
- `.btn-icon`: Icon-only button

### Card Components
- `.card`: Base card component
- `.card-header`: Card header
- `.card-title`: Card title
- `.card-description`: Card description
- `.card-content`: Card content
- `.card-footer`: Card footer

### Form Components
- `.form-group`: Form group wrapper
- `.form-label`: Form label
- `.form-description`: Form description
- `.form-error`: Form error message
- `.input`: Input field style

### Status Badges
- `.badge-default`: Default badge
- `.badge-secondary`: Secondary badge
- `.badge-destructive`: Destructive badge
- `.badge-outline`: Outline badge
- `.badge-pending`: Pending status
- `.badge-approved`: Approved status
- `.badge-rejected`: Rejected status

### Travel-Specific Components
- `.trip-card`: Trip card component
- `.expense-item`: Expense list item
- `.expense-category`: Expense category text
- `.expense-amount`: Expense amount display
- `.expense-date`: Expense date display

## Utility Classes

### Background Colors
```css
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }
.bg-accent { background-color: var(--accent); }
/* ... etc */
```

### Text Colors
```css
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-muted-foreground { color: var(--muted-foreground); }
/* ... etc */
```

### Border Colors
```css
.border-primary { border-color: var(--primary); }
.border-input { border-color: var(--input); }
.border-border { border-color: var(--border); }
/* ... etc */
```

### Shadows
```css
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
/* ... etc */
```

## Best Practices

### 1. Use Semantic Color Names
```tsx
// Good
<div className="bg-primary text-primary-foreground">

// Avoid
<div className="bg-blue-500 text-white">
```

### 2. Prefer Component Classes
```tsx
// Good
<button className="btn btn-primary">

// Acceptable
<button className="bg-primary text-primary-foreground px-4 py-2 rounded">
```

### 3. Use CSS Variables for Custom Components
```css
.custom-alert {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border: 1px solid var(--border);
}
```

### 4. Leverage Opacity Modifiers
```tsx
<div className="bg-primary/10 border-primary/20">
  Subtle primary background
</div>
```

## Testing the Color System

Visit `/test-page` and click "View Color System" to see a comprehensive demonstration of:
- All color variables in action
- Light/dark theme switching
- Component examples
- Form elements
- Travel-specific components
- Button variants and states

## Customization

To customize colors:

1. **Modify CSS Variables**: Edit the OKLCH values in `src/styles/globals.css`
2. **Update Tailwind Config**: Ensure new colors are mapped in `tailwind.config.ts`
3. **Add New Utilities**: Create new utility classes in `src/styles/utilities.css`
4. **Create Component Styles**: Add new component styles in `src/styles/components.css`

## Browser Support

The color system uses:
- **CSS Variables**: Supported in all modern browsers
- **OKLCH Colors**: Supported in modern browsers (Chrome 111+, Firefox 113+, Safari 15.4+)
- **Tailwind CSS**: Full browser support with PostCSS processing

## Migration Guide

### From Old Color System
1. Replace hardcoded colors with CSS variables
2. Update class names to use semantic naming
3. Test in both light and dark modes
4. Update any custom CSS to use the new variables

### Example Migration
```tsx
// Before
<div className="bg-blue-500 text-white border-gray-300">

// After
<div className="bg-primary text-primary-foreground border-border">
```

This centralized color system ensures consistency, maintainability, and accessibility across the entire Wolthers Travel App.