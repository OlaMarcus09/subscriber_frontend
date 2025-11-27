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
     health_pct: 0
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        try {
            const res = await axios.get(`${API_URL}/api/users/me/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const userData = res.data;
            // Calculate usage based on subscription
            const used = userData.days_used_this_month || 0;
            const total = userData.subscription?.plan?.included_days || 18;
            const pct = Math.min((used / total) * 100, 100);

            setAnalytics({
                total_checkins: userData.total_checkins || 0,
                days_used: used,
                days_total: total,
                health_pct: pct
            });
        } catch (err) {
            console.error(err);
        }
      };
      fetchData();
  }, []);

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
        <DataCard label="Total Logins" value={analytics.total_checkins} sub="LIFETIME" />
        <DataCard label="Bandwidth" value={`${analytics.days_used}/${analytics.days_total}`} sub="DAYS USED" />
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
            <span>{analytics.health_pct.toFixed(0)}% UTILIZED</span>
            <span>RESETS MONTHLY</span>
        </div>
      </div>

    </AppLayout>
  );
}
