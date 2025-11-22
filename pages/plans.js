import React, { useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { CreditCard, Clock, Download, Zap, ChevronRight, Shield } from 'lucide-react';

export default function BillingPage() {
  // Mock Data representing the logged-in user's sub
  const subscription = {
    plan: 'FLEX_PRO',
    status: 'ACTIVE',
    price: '₦45,000',
    cycle: 'Monthly',
    renewal: 'Dec 22, 2025',
    payment_method: 'VISA •••• 4242'
  };

  const invoices = [
    { id: 'INV-001', date: 'Nov 22, 2025', amount: '₦45,000', status: 'PAID' },
    { id: 'INV-002', date: 'Oct 22, 2025', amount: '₦45,000', status: 'PAID' },
    { id: 'INV-003', date: 'Sep 22, 2025', amount: '₦22,500', status: 'PAID' }, // Was on basic before
  ];

  return (
    <AppLayout activePage="billing">
      <Head><title>Billing | Workspace OS</title></Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-main)] font-mono uppercase mb-2">Financial Protocols</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">SUBSCRIPTION STATUS & TRANSACTIONS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* --- ACTIVE PLAN CARD --- */}
        <div className="md:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden rounded-sm shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Shield className="w-4 h-4 text-[var(--color-accent)]" />
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Current Access</span>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--text-main)] font-mono">{subscription.plan}</h2>
                </div>
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-mono uppercase font-bold rounded-sm">
                    {subscription.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">Renewal Date</div>
                    <div className="flex items-center text-[var(--text-main)] font-bold">
                        <Clock className="w-4 h-4 mr-2 text-[var(--text-muted)]" /> {subscription.renewal}
                    </div>
                </div>
                <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">Billing Amount</div>
                    <div className="text-[var(--text-main)] font-bold">{subscription.price} <span className="text-[var(--text-muted)] font-normal">/mo</span></div>
                </div>
            </div>

            <div className="flex space-x-3 border-t border-[var(--border-color)] pt-4">
                <button className="flex-1 py-3 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity">
                    Upgrade_Bandwidth
                </button>
                <button className="px-6 border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs hover:text-red-500 hover:border-red-500 transition-colors uppercase">
                    Cancel
                </button>
            </div>
        </div>

        {/* --- PAYMENT METHOD --- */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-4">Payment Method</div>
                <div className="flex items-center mb-2">
                    <CreditCard className="w-6 h-6 text-[var(--text-main)] mr-3" />
                    <span className="text-lg font-mono font-bold text-[var(--text-main)]">•••• 4242</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Expires 12/28</p>
            </div>
            <button className="w-full mt-6 py-2 border border-dashed border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs uppercase hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                Update Card
            </button>
        </div>
      </div>

      {/* --- INVOICE HISTORY --- */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-sm shadow-sm">
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
            <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold">Transaction Log</h3>
            <button className="text-[10px] font-mono text-[var(--color-accent)] hover:underline">VIEW_ALL</button>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                    <th className="p-4 font-normal">Invoice ID</th>
                    <th className="p-4 font-normal">Date</th>
                    <th className="p-4 font-normal">Amount</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal text-right">Action</th>
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                        <td className="p-4 text-[var(--text-main)] font-bold">{inv.id}</td>
                        <td className="p-4 text-[var(--text-muted)]">{inv.date}</td>
                        <td className="p-4 text-[var(--text-main)]">{inv.amount}</td>
                        <td className="p-4 text-green-600">{inv.status}</td>
                        <td className="p-4 text-right">
                            <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                                <Download className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

    </AppLayout>
  );
}
