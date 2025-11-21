import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Check } from 'lucide-react';

export default function Plans() {
  return (
    <AppLayout>
      <Head><title>Bandwidth Selection | Workspace Africa</title></Head>

      <div className="text-center mb-16 mt-8">
        <h1 className="text-4xl font-bold text-white mb-2">Select Access Protocol</h1>
        <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Choose your bandwidth.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* --- TIER 1: FLEX_BASIC --- */}
        <div className="bg-[#080c14] border border-white/5 p-8 flex flex-col relative group hover:border-slate-600 transition-colors">
            <div className="text-slate-500 font-mono text-xs uppercase mb-4 tracking-widest">FLEX_BASIC</div>
            <div className="mb-8">
                <span className="text-4xl font-bold text-white">₦22,500</span>
                <span className="text-slate-600 font-mono text-xs">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {['8 Days Access', 'Standard Spaces', 'Community WiFi'].map((item) => (
                    <li key={item} className="flex items-center text-sm text-slate-400 font-mono">
                        <Check className="w-3 h-3 text-green-500 mr-3" /> {item}
                    </li>
                ))}
            </ul>
            <button className="btn-outline">ACTIVATE_BASIC</button>
        </div>

        {/* --- TIER 2: FLEX_PRO (Highlighted) --- */}
        <div className="bg-[#0a0f1c] border-t-2 border-t-[var(--color-accent)] border-x border-b border-white/10 p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-[9px] font-mono font-bold px-2 py-1 uppercase">Recommended</div>
            
            <div className="text-[var(--color-accent)] font-mono text-xs uppercase mb-4 tracking-widest">FLEX_PRO</div>
            <div className="mb-8">
                <span className="text-5xl font-bold text-white">₦45,000</span>
                <span className="text-slate-600 font-mono text-xs">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {['16 Days Access', 'All Spaces (Std + Premium)', 'Meeting Room Credits', 'Priority Support'].map((item) => (
                    <li key={item} className="flex items-center text-sm text-slate-300 font-mono">
                        <Check className="w-3 h-3 text-[var(--color-accent)] mr-3" /> {item}
                    </li>
                ))}
            </ul>
            <button className="btn-primary">ACTIVATE_PRO</button>
        </div>

        {/* --- TIER 3: FLEX_UNLIMITED --- */}
        <div className="bg-[#080c14] border border-white/5 p-8 flex flex-col relative group hover:border-slate-600 transition-colors">
            <div className="text-slate-500 font-mono text-xs uppercase mb-4 tracking-widest">FLEX_UNLIMITED</div>
            <div className="mb-8">
                <span className="text-4xl font-bold text-white">₦75,000</span>
                <span className="text-slate-600 font-mono text-xs">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Days', 'All Locations', 'Guest Passes (4/mo)', 'Dedicated Locker'].map((item) => (
                    <li key={item} className="flex items-center text-sm text-slate-400 font-mono">
                        <Check className="w-3 h-3 text-green-500 mr-3" /> {item}
                    </li>
                ))}
            </ul>
            <button className="btn-outline">ACTIVATE_MAX</button>
        </div>

      </div>
    </AppLayout>
  );
}
