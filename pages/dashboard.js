import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { MapPin, Wifi, Coffee, QrCode, Calendar, Search, Sparkles, ArrowRight, Building2, BarChart3, Terminal } from 'lucide-react';

export default function AppHome() {
  const [spaces, setSpaces] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { 
             console.log("No token found, switching to Demo Mode");
             throw new Error("DEMO_MODE");
        }

        const [userRes, spacesRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/spaces/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);
        
        setUser(userRes.data);
        setSpaces(spacesRes.data);
        setLoading(false);
        
      } catch (err) {
        console.warn('API unavailable or 404. Loading Demo Data for UI Preview.');
        
        // --- DEMO DATA FALLBACK (Real Ibadan Locations) ---
        setTimeout(() => {
            setUser({ username: "Olawale", email: "demo@workspace.africa" });
            setSpaces([
                { id: 1, name: "Seb's Hub", address: "Bodija, Ibadan", access_tier: "PREMIUM" },
                { id: 3, name: "Stargate Workstation", address: "Cocoa House, Dugbe", access_tier: "STANDARD" },
                { id: 4, name: "The Bunker", address: "Ring Road, Ibadan", access_tier: "PREMIUM" },
            ]);
            setLoading(false);
        }, 1000);
      }
    };
    fetchData();
  }, []);

  const QuickAction = ({ icon, title, description, action }) => (
    <div 
      onClick={() => Router.push(action)}
      className="group relative p-4 bg-[#0a0f1c] border border-white/10 hover:border-[var(--color-accent)] transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
            <div className="text-slate-500 group-hover:text-[var(--color-accent)] transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="text-white font-mono text-xs uppercase tracking-wider">{title}</h3>
                <p className="text-slate-500 text-[10px] font-mono mt-1">{description}</p>
            </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
      </div>
    </div>
  );

  const SpaceCard = ({ space }) => (
    <div className="bg-[#0a0f1c] border border-white/10 p-4 relative group hover:border-slate-600 transition-all">
        <div className="absolute top-3 right-3">
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${space.access_tier === 'PREMIUM' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-slate-600 text-slate-500'}`}>
                {space.access_tier === 'PREMIUM' ? 'TIER_1' : 'TIER_2'}
            </span>
        </div>

        <h3 className="text-white font-mono font-bold text-sm mb-1">{space.name}</h3>
        <div className="flex items-center text-slate-500 text-xs font-mono mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            {space.address}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 border-t border-white/5 pt-3">
            <div className="flex items-center"><Wifi className="w-3 h-3 mr-1" /> ONLINE</div>
            <div className="flex items-center"><Coffee className="w-3 h-3 mr-1" /> FUEL</div>
        </div>
    </div>
  );

  return (
    <AppLayout activePage="home">
      <Head><title>Dashboard | Workspace OS</title></Head>

      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex justify-between items-end">
            <div>
                <div className="flex items-center space-x-2 text-[var(--color-accent)] mb-2">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-widest">System_Ready</span>
                </div>
                <h1 className="text-2xl text-white font-bold font-mono">
                    WELCOME_BACK, {user?.username?.toUpperCase() || 'NOMAD'}
                </h1>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-[10px] font-mono text-slate-500">CURRENT_SESSION</div>
                <div className="text-xl font-mono text-white">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        </div>
        
        <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            <input 
                placeholder="> EXECUTE SEARCH_QUERY..." 
                className="w-full bg-[#050505] border border-white/10 text-white font-mono text-xs py-3 pl-12 focus:border-[var(--color-accent)] focus:ring-0 outline-none transition-colors"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Command_Modules</h2>
                    <Sparkles className="w-3 h-3 text-slate-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <QuickAction icon={<QrCode className="w-5 h-5" />} title="Generate Access Key" description="Initialize check-in sequence" action="/checkin" />
                    <QuickAction icon={<Building2 className="w-5 h-5" />} title="Locate Nodes" description="View available workspaces" action="/spaces" />
                    <QuickAction icon={<BarChart3 className="w-5 h-5" />} title="Data Logs" description="Review usage analytics" action="/analytics" />
                    <QuickAction icon={<Calendar className="w-5 h-5" />} title="Protocol Status" description="Manage subscription" action="/profile" />
                </div>
            </div>

            <div className="bg-[#0a0f1c] border border-white/10 p-5">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <div className="text-[10px] font-mono text-[var(--color-accent)] uppercase mb-1">Bandwidth Usage</div>
                        <div className="text-white font-mono text-lg">0 / 18 DAYS</div>
                    </div>
                    <div className="text-xs font-mono text-slate-500">REMAINING: 18</div>
                </div>
                <div className="w-full bg-[#050505] h-1.5 border border-white/10">
                    <div className="bg-[var(--color-accent)] h-full w-[5%] relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white/20"></div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Nearby_Nodes</h2>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-3">
                {loading ? (
                    <div className="text-xs font-mono text-slate-600 animate-pulse">&gt; SCANNING NETWORK...</div>
                ) : (
                    spaces.slice(0, 3).map(space => <SpaceCard key={space.id} space={space} />)
                )}
                <button onClick={() => Router.push('/spaces')} className="w-full py-2 border border-dashed border-slate-700 text-slate-500 font-mono text-[10px] hover:text-white hover:border-white transition-colors">
                    VIEW_ALL_NODES
                </button>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
