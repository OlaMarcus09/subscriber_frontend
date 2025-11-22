import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Grid, CreditCard, User, Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NavLink = ({ href, icon: Icon, label }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link href={href} legacyBehavior>
      <a className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
        <span className="text-[9px] font-mono uppercase tracking-widest">{label}</span>
      </a>
    </Link>
  );
};

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative font-sans selection:bg-[var(--color-accent)] selection:text-white bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      
      {/* --- OS HEADER BAR --- */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-main)]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-12">
            <div className="flex items-center space-x-4">
                <span className="flex items-center text-[var(--text-main)] font-mono text-xs font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mr-2 animate-pulse"></span>
                    WORKSPACE_OS
                </span>
            </div>
            <div className="flex items-center space-x-3">
                <div className="text-[9px] font-mono text-[var(--text-muted)] hidden sm:block">NET_STATUS: ONLINE</div>
                <ThemeToggle />
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 pb-24">
        {children}
      </main>

      {/* --- BOTTOM HUD NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-[var(--bg-surface)]/95 border-t border-[var(--border-color)] backdrop-blur-xl">
        <div className="flex items-center justify-around h-full max-w-lg mx-auto">
          <NavLink href="/dashboard" icon={Home} label="Home" />
          <NavLink href="/spaces" icon={Grid} label="Spaces" />
          <NavLink href="/plans" icon={CreditCard} label="Billing" />
          <NavLink href="/profile" icon={User} label="ID_Card" />
        </div>
      </nav>
    </div>
  );
}
