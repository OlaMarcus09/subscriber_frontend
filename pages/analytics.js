import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics] = useState({
     overview: { total_checkins: 12, days_used: 3 },
     weekly_pattern: [
        { day: 'M', val: 10 }, { day: 'T', val: 40 }, { day: 'W', val: 25 }, 
        { day: 'T', val: 60 }, { day: 'F', val: 30 }, { day: 'S', val: 5 }, { day: 'S', val: 0 }
     ]
  });

  const DataCard = ({ label, value, sub }) => (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 shadow-sm">
        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">{label}</div>
        <div className="text-3xl font-mono font-bold text-[var(--text-main)] mb-1">{value}</div>
        {sub && <div className="text-xs font-mono text-[var(--color-accent)]">{sub}</div>}
    </div>
  );

  return (
    <AppLayout activePage="analytics">
      <Head><title>Data Logs | Workspace OS</title></Head>

      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-[var(--text-main)] mb-2">USAGE_METRICS</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">Analyzing network activity logs.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <DataCard label="Total Logins" value={analytics.overview.total_checkins} sub="+12% THIS_CYCLE" />
        <DataCard label="Bandwidth" value="3/18" sub="DAYS USED" />
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 mb-6 relative shadow-sm">
         <div className="absolute top-0 left-0 bg-[var(--color-accent)] text-white text-[9px] font-mono px-2 py-0.5">WEEKLY_PATTERN</div>
         
         <div className="flex items-end justify-between h-40 mt-6 space-x-2">
            {analytics.weekly_pattern.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div 
                        style={{ height: `${d.val}%` }} 
                        className="w-full bg-[var(--bg-input)] group-hover:bg-[var(--color-accent)] transition-all duration-300 relative min-h-[4px]"
                    ></div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] mt-2">{d.day}</div>
                </div>
            ))}
         </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-xs font-mono text-[var(--text-main)] uppercase">Subscription Health</span>
        </div>
        <div className="w-full bg-[var(--bg-input)] h-2 mb-2 overflow-hidden rounded-full">
            <div className="h-full bg-[var(--color-accent)] w-[15%]"></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>15% UTILIZED</span>
            <span>RENEWAL: 15 DAYS</span>
        </div>
      </div>

    </AppLayout>
  );
}
