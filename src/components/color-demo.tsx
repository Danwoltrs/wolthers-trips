'use client'

import { ThemeToggle } from './theme-toggle'

export function ColorDemo() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Wolthers Travel Color System</h1>
        <ThemeToggle />
      </div>

      {/* Color Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Colors */}
        <div className="card p-6">
          <h3 className="card-title text-lg mb-4">Primary Colors</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-md"></div>
              <span className="text-sm font-medium">Primary</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground rounded-md border"></div>
              <span className="text-sm font-medium">Primary Foreground</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary rounded-md"></div>
              <span className="text-sm font-medium">Secondary</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary-foreground rounded-md"></div>
              <span className="text-sm font-medium">Secondary Foreground</span>
            </div>
          </div>
        </div>

        {/* Accent Colors */}
        <div className="card p-6">
          <h3 className="card-title text-lg mb-4">Accent Colors</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-md"></div>
              <span className="text-sm font-medium">Accent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-foreground rounded-md"></div>
              <span className="text-sm font-medium">Accent Foreground</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-md"></div>
              <span className="text-sm font-medium">Muted</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted-foreground rounded-md"></div>
              <span className="text-sm font-medium">Muted Foreground</span>
            </div>
          </div>
        </div>

        {/* Chart Colors */}
        <div className="card p-6">
          <h3 className="card-title text-lg mb-4">Chart Colors</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-1 rounded-md"></div>
              <span className="text-sm font-medium">Chart 1</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-2 rounded-md"></div>
              <span className="text-sm font-medium">Chart 2</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-3 rounded-md"></div>
              <span className="text-sm font-medium">Chart 3</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-4 rounded-md"></div>
              <span className="text-sm font-medium">Chart 4</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-5 rounded-md"></div>
              <span className="text-sm font-medium">Chart 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Examples */}
      <div className="card p-6">
        <h3 className="card-title text-lg mb-4">Button Examples</h3>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-outline">Outline Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-destructive">Destructive Button</button>
          <button className="btn btn-link">Link Button</button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="card p-6">
        <h3 className="card-title text-lg mb-4">Status Badges</h3>
        <div className="flex flex-wrap gap-4">
          <span className="badge badge-default">Default</span>
          <span className="badge badge-secondary">Secondary</span>
          <span className="badge badge-outline">Outline</span>
          <span className="badge badge-destructive">Destructive</span>
          <span className="badge badge-pending">Pending</span>
          <span className="badge badge-approved">Approved</span>
          <span className="badge badge-rejected">Rejected</span>
        </div>
      </div>

      {/* Form Example */}
      <div className="card p-6">
        <h3 className="card-title text-lg mb-4">Form Example</h3>
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="input" 
              placeholder="Enter your email"
            />
            <p className="form-description">We'll never share your email with anyone else.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Enter your password"
            />
          </div>
          <button className="btn btn-primary">Submit</button>
        </div>
      </div>

      {/* Sidebar Example */}
      <div className="card p-6">
        <h3 className="card-title text-lg mb-4">Sidebar Example</h3>
        <div className="sidebar rounded-lg p-4 max-w-sm">
          <div className="sidebar-header">
            <h4 className="font-semibold">Navigation</h4>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="sidebar-nav-item active">
              📊 Dashboard
            </a>
            <a href="#" className="sidebar-nav-item">
              ✈️ Trips
            </a>
            <a href="#" className="sidebar-nav-item">
              💳 Expenses
            </a>
            <a href="#" className="sidebar-nav-item">
              📅 Meetings
            </a>
            <a href="#" className="sidebar-nav-item">
              ⚙️ Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Travel Specific Components */}
      <div className="card p-6">
        <h3 className="card-title text-lg mb-4">Travel Components</h3>
        <div className="space-y-4">
          <div className="trip-card">
            <h4 className="font-semibold text-lg mb-2">Business Trip to NYC</h4>
            <p className="text-muted-foreground mb-3">March 15-20, 2024</p>
            <div className="flex gap-2">
              <span className="badge trip-status-active">Active</span>
              <span className="badge expense-status-pending">Pending Expenses</span>
            </div>
          </div>
          
          <div className="expense-item">
            <div>
              <div className="expense-category">Hotel</div>
              <div className="expense-date">March 15, 2024</div>
            </div>
            <div className="expense-amount currency-usd">$250.00</div>
          </div>

          <div className="expense-item">
            <div>
              <div className="expense-category">Transportation</div>
              <div className="expense-date">March 16, 2024</div>
            </div>
            <div className="expense-amount currency-usd">$45.00</div>
          </div>
        </div>
      </div>
    </div>
  )
}