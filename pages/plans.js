import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { CreditCard, Check, Zap, QrCode, Shield, Infinity } from 'lucide-react';
import { PaystackButton } from 'react-paystack';

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('subs');
  // In a real app, get this from the logged-in user context
  const [userEmail, setUserEmail] = useState('user@example.com');

  // --- CONFIGURATION ---
  const publicKey = 'pk_test_33ced6d752ba6716b596d2d5159231e7b23d87c7';
  
  const plans = {
    basic: { code: 'PLN_mu2w42h302kwhs4', price: 27000, name: 'Flex Basic' },
    pro: { code: 'PLN_rlctlj6pkky8t94', price: 55000, name: 'Flex Pro' },
    unlimited: { code: 'PLN_bn2p2x82io1fooy', price: 90000, name: 'Flex Unlimited' }
  };

  // Day Pass Config (No Plan Code, just Amount)
  const dayPassPrice = 4500;

  // --- HANDLERS ---
  const handleSuccess = (reference) => {
    console.log(reference);
    alert("Payment Successful! Reference: " + reference.reference);
    // TODO: Send reference to backend to activate subscription/generate token
  };

  const handleClose = () => {
    console.log('Payment closed');
  };

  const PlanCard = ({ planKey, days, tier, features, icon: Icon, recommended = false }) => {
    const plan = plans[planKey];
    
    const componentProps = {
        email: userEmail,
        amount: plan.price * 100, // Convert to kobo
        publicKey,
        text: 'ACTIVATE PLAN',
        plan: plan.code, // This enables recurring billing
        onSuccess: handleSuccess,
        onClose: handleClose,
    };

    return (
        <div className={`bg-[var(--bg-surface)] p-6 relative flex flex-col ${recommended ? 'border-t-2 border-t-[var(--color-accent)] border-x border-b border-[var(--border-color)] shadow-lg scale-105 z-10' : 'border border-[var(--border-color)] hover:border-[var(--text-muted)] shadow-sm'}`}>
            {recommended && <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-[9px] font-mono font-bold px-2 py-1 uppercase">Recommended</div>}
            
            <div className="flex items-center space-x-2 mb-4 text-[var(--color-accent)]">
                <Icon className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-widest">{plan.name}</span>
            </div>
            
            <div className="mb-6">
                <span className="text-3xl font-bold text-[var(--text-main)] font-mono">₦{plan.price.toLocaleString()}</span>
                <span className="text-[var(--text-muted)] font-mono text-xs">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8 text-sm text-[var(--text-main)] font-mono flex-1">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> {days}</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> {tier}</li>
                {features.map((f, i) => (
                    <li key={i} className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> {f}</li>
                ))}
            </ul>
            
            <div className="w-full py-3 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold hover:opacity-90 transition-all uppercase text-center cursor-pointer shadow-lg">
                <PaystackButton {...componentProps} className="w-full h-full block" />
            </div>
        </div>
    );
  };

  return (
    <AppLayout activePage="plans">
      <Head><title>Select Access | Workspace OS</title></Head>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-main)] font-mono uppercase mb-2">Select Access Protocol</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">CHOOSE YOUR BANDWIDTH</p>
      </div>

      {/* --- TABS --- */}
      <div className="flex justify-center mb-10">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-sm flex space-x-1">
            <button onClick={() => setActiveTab('subs')} className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'subs' ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Monthly Subs</button>
            <button onClick={() => setActiveTab('daypass')} className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'daypass' ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Day Pass</button>
        </div>
      </div>

      {/* --- SUBSCRIPTION CARDS --- */}
      {activeTab === 'subs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto pb-12">
            
            {/* BASIC */}
            <PlanCard 
                planKey="basic" 
                days="8 Days Access" 
                tier="Standard Spaces" 
                features={["Community WiFi"]}
                icon={Shield}
            />

            {/* PRO */}
            <PlanCard 
                planKey="pro" 
                days="16 Days Access" 
                tier="Std + Premium" 
                features={["Meeting Room Credits", "Priority Support"]}
                icon={Zap}
                recommended={true}
            />

            {/* UNLIMITED */}
            <PlanCard 
                planKey="unlimited" 
                days="Unlimited Access" 
                tier="All Locations" 
                features={["Guest Passes (2/mo)", "Dedicated Locker"]}
                icon={Infinity}
            />

        </div>
      )}

      {/* --- DAY PASS --- */}
      {activeTab === 'daypass' && (
        <div className="max-w-md mx-auto pb-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 text-center relative overflow-hidden rounded-sm shadow-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)] animate-pulse"></div>
                <div className="w-16 h-16 bg-[var(--bg-input)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-accent)]"><QrCode className="w-8 h-8" /></div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] font-mono mb-2">Single Day Pass</h2>
                <p className="text-[var(--text-muted)] text-sm mb-6">Instant 24h access to any Standard or Premium hub.</p>

                <div className="mb-8 p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-sm">
                    <div className="text-3xl font-bold text-[var(--text-main)] font-mono">₦{dayPassPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">FLAT RATE / ONE-OFF</div>
                </div>
                
                <div className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold uppercase hover:opacity-90 transition-all flex items-center justify-center cursor-pointer">
                    <PaystackButton 
                        className="w-full h-full block"
                        email={userEmail}
                        amount={dayPassPrice * 100}
                        publicKey={publicKey}
                        text="PURCHASE PASS"
                        onSuccess={handleSuccess}
                        onClose={handleClose}
                    />
                </div>
            </div>
            <p className="text-center text-[10px] text-[var(--text-muted)] font-mono mt-4">*Excludes The Bunker (Requires Top-up)</p>
        </div>
      )}

    </AppLayout>
  );
}
