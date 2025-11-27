import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import { Check, Zap, QrCode, Shield, Infinity } from 'lucide-react';
import dynamic from 'next/dynamic';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('subs');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const publicKey = 'pk_test_33ced6d752ba6716b596d2d5159231e7b23d87c7'; 
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }
        const response = await axios.get(`${API_URL}/api/users/me/`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        console.error("User Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSuccess = async (reference) => {
    alert("Payment Successful! Processing...");
    // Force profile update on backend (logic to be added)
    setTimeout(() => Router.push('/profile'), 2000);
  };

  const handleClose = () => console.log('Payment closed');

  // Individual Card Component to isolate scope
  const SubscriptionCard = ({ name, price, planCode, days, features, icon: Icon, recommended }) => {
    const componentProps = {
        email: user?.email || 'error@workspace.africa',
        amount: price * 100, // Kobo
        publicKey,
        text: 'SUBSCRIBE NOW',
        plan: planCode, // Specific Plan Code
        onSuccess: handleSuccess,
        onClose: handleClose,
    };

    return (
        <div className={`bg-[var(--bg-surface)] p-6 relative flex flex-col ${recommended ? 'border-t-2 border-t-[var(--color-accent)] border-x border-b border-[var(--border-color)] shadow-xl scale-105 z-10' : 'border border-[var(--border-color)] hover:border-[var(--text-muted)] shadow-sm'}`}>
            {recommended && <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-[9px] font-mono font-bold px-2 py-1 uppercase">Recommended</div>}
            
            <div className="flex items-center space-x-2 mb-4 text-[var(--color-accent)]">
                <Icon className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-widest">{name}</span>
            </div>
            
            <div className="mb-6">
                <span className="text-3xl font-bold text-[var(--text-main)] font-mono">₦{price.toLocaleString()}</span>
                <span className="text-[var(--text-muted)] font-mono text-xs">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8 text-sm text-[var(--text-main)] font-mono flex-1">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> {days}</li>
                {features.map((f, i) => (
                    <li key={i} className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> {f}</li>
                ))}
            </ul>
            
            <div className="w-full py-3 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold hover:opacity-90 transition-all uppercase text-center cursor-pointer shadow-lg">
                {user ? <PaystackButton {...componentProps} className="w-full h-full block" /> : 'Loading...'}
            </div>
        </div>
    );
  };

  return (
    <AppLayout activePage="plans">
      <Head><title>Access Protocols | Workspace OS</title></Head>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-main)] font-mono uppercase mb-2">Select Access Protocol</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">CHOOSE YOUR BANDWIDTH</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-sm flex space-x-1">
            <button onClick={() => setActiveTab('subs')} className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'subs' ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--text-muted)]'}`}>Monthly Subs</button>
            <button onClick={() => setActiveTab('daypass')} className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'daypass' ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--text-muted)]'}`}>Day Pass</button>
        </div>
      </div>

      {activeTab === 'subs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto pb-12">
            <SubscriptionCard 
                name="FLEX BASIC" price={27000} planCode="PLN_2ah21zqr7w3jpdp" days="8 Days Access"
                features={["Standard Spaces", "Community WiFi"]} icon={Shield} 
            />
            <SubscriptionCard 
                name="FLEX PRO" price={55000} planCode="PLN_qhytgtizn15iepe" days="16 Days Access"
                features={["Std + Premium", "Priority Support"]} icon={Zap} recommended={true}
            />
            <SubscriptionCard 
                name="FLEX UNLIMITED" price={90000} planCode="PLN_31ksupido3h8d0b" days="Unlimited Access"
                features={["All Locations", "Dedicated Locker", "Guest Passes"]} icon={Infinity} 
            />
        </div>
      )}

      {/* Day Pass Logic remains the same... */}
      {activeTab === 'daypass' && (
        <div className="max-w-md mx-auto pb-12">
             {/* ... (Day pass code is fine, kept short for brevity) ... */}
             <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 text-center relative rounded-sm shadow-md">
                <h2 className="text-2xl font-bold text-[var(--text-main)] font-mono mb-2">Single Day Pass</h2>
                <div className="mb-8 p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-sm">
                    <div className="text-3xl font-bold text-[var(--text-main)] font-mono">₦4,500</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">FLAT RATE / DAY</div>
                </div>
                {user && (
                    <div className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold uppercase hover:opacity-90 cursor-pointer">
                        <PaystackButton 
                            className="w-full h-full block"
                            email={user.email}
                            amount={4500 * 100}
                            publicKey={publicKey}
                            text="PURCHASE PASS"
                            onSuccess={handleSuccess}
                            onClose={handleClose}
                        />
                    </div>
                )}
            </div>
        </div>
      )}
    </AppLayout>
  );
}
