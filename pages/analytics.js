import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import { Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
     total_checkins: 0, 
     days_used: 0,
     days_total: 18,
     health_pct: 0,
     is_unlimited: false // Added flag
  });
  
  const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
        if (!token) { Router.push('/'); return; }

        try {
            // Updated endpoint to use your profile route
            const res = await axios.get(`${getBaseUrl()}/api/users/profile/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const userData = res.data;
            const used = userData.days_used || 0;
            const total = userData.total_days || 0;
            
            // Logic for Unlimited check
            const isUnlimited = total >= 999;
            // For unlimited, health is always 0% used (good), otherwise calculate %
            const pct = isUnlimited ? 0 : Math.min((used / total) * 100, 100);

            setAnalytics({
                total_checkins: userData.total_checkins || 0,
                days_used: used,
                days_total: total,
                health_pct: pct,
                is_unlimited: isUnlimited
            });
        } catch (err) {
            console.error("Analytics fetch failed:", err);
        }
      };
      fetchData();
  }, []);

  const DataCard = ({ label, value, sub }) => (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 shadow-sm">
        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">{label}</div>
        <div className="text-3xl font-mono font-bold text-[var(--text-main)] mb-1 uppercase">{value}</div>
        {sub && <div className="text-xs font-mono text-[var(--color-accent)] uppercase">{sub}</div>}
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
        <DataCard label="Total Logins" value={analytics.total_checkins} sub="LIFETIME" />
        {/* --- BANDWIDTH LOGIC UPDATED --- */}
        <DataCard 
            label="Bandwidth" 
            value={analytics.is_unlimited ? "UNLIMITED" : `${analytics.days_used}/${analytics.days_total}`} 
            sub="DAYS USED" 
        />
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-xs font-mono text-[var(--text-main)] uppercase">Subscription Health</span>
        </div>
        <div className="w-full bg-[var(--bg-input)] h-2 mb-2 overflow-hidden rounded-full">
            <div className="h-full bg-[var(--color-accent)] transition-all duration-1000" style={{ width: `${analytics.health_pct}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>{analytics.is_unlimited ? "OPTIMAL" : `${analytics.health_pct.toFixed(0)}% UTILIZED`}</span>
            <span>RESETS MONTHLY</span>
        </div>
      </div>
    </AppLayout>
  );
}