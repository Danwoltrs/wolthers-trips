'use client';

import { useState } from 'react';
import { Icon, WolthersLogo } from '@/components/ui/Icon';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Logout functionality placeholder
    console.log('Logout clicked');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-full relative">
        {/* Logo */}
        <div className="flex items-center">
          <WolthersLogo variant="green" width={140} height={38} />
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
            <Icon name="user" size={16} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
            <Icon name="gear" size={16} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
            <Icon name="noteblock" size={16} />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-md transition-colors"
          >
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <button className="mobile-nav-item w-full text-left flex items-center space-x-2">
            <Icon name="user" size={16} />
            <span>Profile</span>
          </button>
          <button className="mobile-nav-item w-full text-left flex items-center space-x-2">
            <Icon name="gear" size={16} />
            <span>Settings</span>
          </button>
          <button className="mobile-nav-item w-full text-left flex items-center space-x-2">
            <Icon name="noteblock" size={16} />
            <span>Notifications</span>
          </button>
          <button
            onClick={handleSignOut}
            className="mobile-nav-item w-full text-left flex items-center space-x-2 text-destructive"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}