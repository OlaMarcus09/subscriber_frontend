import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import { Check, Zap, QrCode, Shield, Infinity, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically load Paystack
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

// --- CONFIGURATION ---
// You requested TEST key. Ensure your Paystack Dashboard is in TEST mode 
// and you have created these Plans in TEST mode if you want this to work.
const publicKey = 'pk_test_33ced6d752ba6716b596d2d5159231e7b23d87c7'; 
const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'https://workspace-africa-backend.vercel.app';

// --- PLAN CODES (Must match Backend Database) ---
const PLANS = {
    basic: { 
        code: 'PLN_qhytgtizn15iepe', // Flex Basic
        price: 27000, 
        name: 'Flex Basic' 
    },
    pro: { 
        code: 'PLN_31ksupido3h8d0b', // Flex Pro
        price: 55000, 
        name: 'Flex Pro' 
    },
    unlimited: { 
        code: 'PLN_28x17xi3up6miwc', // Flex Unlimited
        price: 90000, 
        name: 'Flex Unlimited' 
    }
};

const PlanCard = ({ planKey, days, tier, features, icon: Icon, recommended = false, user }) => {
    const plan = PLANS[planKey];
    const [activating, setActivating] = useState(false);
    
    const handleSuccess = (reference) => {
        setActivating(true);
        // Verify payment with backend
        axios.get(`${API_URL}/api/payments/verify/?reference=${reference.reference}`)
            .then(() => {
                alert("Payment Successful! Subscription Activated.");
                Router.push('/profile'); // Redirect to profile to see status
            })
            .catch(err => {
                console.error("Verification failed", err);
                alert("Payment successful at Paystack, but activation failed. Contact support with ref: " + reference.reference);
                setActivating(false);
            });
    };

    const handleClose = () => {
        console.log('Payment closed');
    };

    const componentProps = user ? {
        email: user.email,
        amount: plan.price * 100, // Paystack takes kobo
        publicKey,
        text: activating ? 'ACTIVATING...' : 'ACTIVATE PLAN',
        plan: plan.code,
        onSuccess: handleSuccess,
        onClose: handleClose,
    } : null;

    return (
        <div className={`bg-[var(--bg-surface)] p-6 relative flex flex-col ${recommended ? 'border-t-2 border-t-[var(--color-accent)] border-x border-b border-[var(--border-color)] shadow-2xl scale-105 z-10' : 'border border-[var(--border-color)] hover:border-[var(--text-muted)] shadow-sm'}`}>
            {recommended && <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-[var(--bg-main)] text-[9px] font-mono font-bold px-2 py-1 uppercase">Recommended</div>}
            
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
            
            <div className="w-full py-3 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold hover:opacity-90 transition-all uppercase text-center cursor-pointer shadow-lg relative group border border-[var(--text-main)]">
                 {user ? (
                    <>
                        <PaystackButton {...componentProps} className="w-full h-full absolute inset-0 opacity-0 cursor-pointer z-20" />
                        <span className="pointer-events-none relative z-10 group-hover:tracking-wider transition-all">
                            {activating ? 'FINALIZING...' : 'SUBSCRIBE NOW'}
                        </span>
                    </>
                 ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> LOADING...
                    </span>
                 )}
            </div>
        </div>
    );
};

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('subs');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
             Router.push('/');
             return;
        }
        const response = await axios.get(`${API_URL}/api/users/me/`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('accessToken');
            Router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const dayPassPrice = 4500;
  const handleDayPassSuccess = (ref) => alert("Day Pass Activated: " + ref.reference);

  return (
    <AppLayout activePage="plans">
      <Head><title>Select Access | Workspace OS</title></Head>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-main)] font-mono uppercase mb-2">Select Access Protocol</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">CHOOSE YOUR BANDWIDTH</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-sm flex space-x-1">
            <button onClick={() => setActiveTab('subs')} className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'subs' ? 'bg-[var(--color-accent)] text-[var(--bg-main)] shadow-md font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Monthly Subs</button>
            <button onClick={() => setActiveTab('daypass')} className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'daypass' ? 'bg-[var(--color-accent)] text-[var(--bg-main)] shadow-md font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Day Pass</button>
        </div>
      </div>

      {activeTab === 'subs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-12 items-center">
            <PlanCard 
                planKey="basic" 
                days="8 Days Access" 
                tier="Standard Spaces" 
                features={["Community WiFi"]}
                icon={Shield}
                user={user}
            />
            <PlanCard 
                planKey="pro" 
                days="16 Days Access" 
                tier="Std + Premium" 
                features={["Meeting Room Credits", "Priority Support"]}
                icon={Zap}
                recommended={true}
                user={user}
            />
            <PlanCard 
                planKey="unlimited" 
                days="Unlimited Access" 
                tier="All Locations" 
                features={["Guest Passes (2/mo)", "Dedicated Locker"]}
                icon={Infinity}
                user={user}
            />
        </div>
      )}

      {activeTab === 'daypass' && (
           <div className="max-w-md mx-auto pb-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 text-center relative overflow-hidden rounded-sm shadow-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)] animate-pulse"></div>
                <div className="w-16 h-16 bg-[var(--bg-input)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-accent)]"><QrCode className="w-8 h-8" /></div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] font-mono mb-2">Single Day Pass</h2>
                <div className="mb-8 p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-sm">
                    <div className="text-3xl font-bold text-[var(--text-main)] font-mono">₦{dayPassPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">FLAT RATE / DAY</div>
                </div>
                
                <div className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold uppercase hover:opacity-90 transition-all flex items-center justify-center cursor-pointer relative group">
                    {user ? (
                        <>
                            <PaystackButton 
                                className="w-full h-full absolute inset-0 opacity-0 cursor-pointer z-20"
                                email={user.email}
                                amount={dayPassPrice * 100}
                                publicKey={publicKey}
                                text="PURCHASE PASS"
                                onSuccess={handleDayPassSuccess}
                                onClose={() => console.log('closed')}
                            />
                            <span className="pointer-events-none relative z-10 group-hover:tracking-wider transition-all">PURCHASE PASS</span>
                        </>
                    ) : (
                        <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> LOADING...</span>
                    )}
                </div>
            </div>
            <p className="text-center text-[10px] text-[var(--text-muted)] font-mono mt-4">*Excludes The Bunker (Requires Top-up)</p>
        </div>
      )}

    </AppLayout>
  );
}
