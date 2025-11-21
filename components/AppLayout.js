import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Grid, CreditCard, User, Terminal } from 'lucide-react';

const NavLink = ({ href, icon: Icon, label }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link href={href} legacyBehavior>
      <a className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-slate-600 hover:text-slate-400'}`}>
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
        <span className="text-[9px] font-mono uppercase tracking-widest">{label}</span>
      </a>
    </Link>
  );
};

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative font-sans selection:bg-[var(--color-accent)] selection:text-white">
      
      {/* --- OS HEADER BAR (Matches Screenshot) --- */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-10 text-[10px] font-mono tracking-wider text-slate-500">
            <div className="flex items-center space-x-4">
                <span className="flex items-center text-white">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                    WORKSPACE_AFRICA_OS
                </span>
                <span className="hidden sm:inline">LOC: IBADAN [7.37°N, 3.94°E]</span>
            </div>
            <div>NET_STATUS: ONLINE</div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 pb-24">
        {children}
      </main>

      {/* --- BOTTOM HUD NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-[#050505]/95 border-t border-white/10 backdrop-blur-xl">
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
