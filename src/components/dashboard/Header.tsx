'use client';

import { Icon, WolthersLogo } from '@/components/ui/Icon';

export function Header() {
  const handleSignOut = () => {
    // Logout functionality placeholder
    console.log('Logout clicked');
  };

  return (
    <header className="bg-accent-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <WolthersLogo variant="off-white" width={140} height={38} />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white hover:text-gray-200 rounded-md hover:bg-accent-600 transition-colors duration-200">
              <Icon name="noteblock" size={20} />
            </button>
            <button className="p-2 text-white hover:text-gray-200 rounded-md hover:bg-accent-600 transition-colors duration-200">
              <Icon name="gear" size={20} />
            </button>
            <button className="p-2 text-white hover:text-gray-200 rounded-md hover:bg-accent-600 transition-colors duration-200">
              <Icon name="user" size={20} />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 text-white hover:text-gray-200 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              <span className="text-sm font-medium">Exit</span>
            </button>
            
            
          </div>
        </div>
      </div>
    </header>
  );
}