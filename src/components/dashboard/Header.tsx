'use client';

import { Icon, WolthersLogo } from '@/components/ui/Icon';

export function Header() {
  const handleSignOut = () => {
    // Logout functionality placeholder
    console.log('Logout clicked');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex items-center">
          <WolthersLogo variant="green" width={140} height={38} />
        </div>

        {/* User Menu Icons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Icon name="user" size={16} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Icon name="gear" size={16} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Icon name="noteblock" size={16} />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}