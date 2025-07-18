'use client';

import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'next-auth/react';
import { Bell, Settings, User, LogOut } from 'lucide-react';

export function Header() {
  const { user } = useAuth();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              Wolthers Travel
            </h1>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100">
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </button>
            
            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}