import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Home, QrCode, User, MapPin, Sparkles, BarChart3 } from 'lucide-react';

const NavLink = ({ href, children, isActive, icon: Icon }) => (
  <Link href={href} legacyBehavior>
    <a className={`
      flex flex-col items-center justify-center flex-1 py-3
      transition-all duration-200 relative
      ${isActive 
        ? 'text-purple-400 scale-105' 
        : 'text-gray-500 hover:text-gray-300'
      }
    `}>
      <div className={`relative ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
        <Icon className="w-6 h-6" />
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        )}
      </div>
      <span className="text-xs font-medium mt-1">{children}</span>
      
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
      )}
    </a>
  </Link>
);

export default function AppLayout({ children, activePage }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      
      {/* --- Modern Header --- */}
      <header className="sticky top-0 z-10 w-full py-4 bg-black/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="container flex items-center justify-between px-4 mx-auto max-w-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Workspace
            </span>
          </div>
          
          {/* Premium Badge */}
          <div className="flex items-center space-x-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-300 text-xs font-medium">Pro</span>
          </div>
        </div>
      </header>
      
      {/* --- Main Content Area --- */}
      <main className="flex-1 w-full max-w-lg p-4 pb-24 mx-auto overflow-y-auto">
        {children}
      </main>

      {/* --- Enhanced Bottom Tab Bar --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 h-16 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 shadow-2xl flex px-4">
        <NavLink href="/app" isActive={activePage === 'home'} icon={Home}>
          Home
        </NavLink>
        <NavLink href="/spaces" isActive={activePage === 'spaces'} icon={MapPin}>
          Spaces
        </NavLink>
        <NavLink href="/checkin" isActive={activePage === 'checkin'} icon={QrCode}>
          Check-In
        </NavLink>
        <NavLink href="/analytics" isActive={activePage === 'analytics'} icon={BarChart3}>
          Analytics
        </NavLink>
        <NavLink href="/profile" isActive={activePage === 'profile'} icon={User}>
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
