import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
// We'll add icons later
// import { Home, User, QrCode } from 'lucide-react';

const NavLink = ({ href, children, isActive }) => (
  <Link href={href} legacyBehavior>
    <a className={`
      flex flex-col items-center justify-center flex-1 py-2
      transition-colors
      ${isActive 
        ? 'text-primary'  // This is our Deep Teal!
        : 'text-neutral-500 hover:text-neutral-700'
      }
    `}>
      {/* <Icon className="w-6 h-6" /> */}
      <span className="text-xs font-medium">{children}</span>
    </a>
  </Link>
);

export default function AppLayout({ children, activePage }) {
  return (
    // New "Framer-style" light theme
    <div className="flex flex-col min-h-screen bg-neutral-50">
      
      {/* --- Light Header with our Logo --- */}
      <header className="sticky top-0 z-10 w-full py-4 bg-white border-b border-neutral-200">
        <div className="container flex items-center justify-between px-6 mx-auto max-w-lg">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="h-8" // Sleek, smaller logo
          />
        </div>
      </header>
      
      {/* --- Main Content Area (light gray) --- */}
      <main className="flex-1 w-full max-w-lg p-6 pb-20 mx-auto">
        {children}
      </main>

      {/* --- Bottom Tab Bar (white) --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 h-16 bg-white border-t border-neutral-200 flex">
        <NavLink href="/app" isActive={activePage === 'home'}>
          Home
        </NavLink>
        <NavLink href="/checkin" isActive={activePage === 'checkin'}>
          Check-In
        </NavLink>
        <NavLink href="/profile" isActive={activePage === 'profile'}>
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
