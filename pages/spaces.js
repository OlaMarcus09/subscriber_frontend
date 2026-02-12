import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { MapPin, Wifi, Coffee, Zap, Search, Filter, Cpu, Battery, X } from 'lucide-react';

const Badge = ({ children, variant = 'default' }) => {
  const styles = variant === 'premium' 
    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30' 
    : 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-color)]';
    
  return (
    <span className={`${styles} text-[10px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-wider`}>
      {children}
    </span>
  );
};

export default function SpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [bookingToken, setBookingToken] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get safe API base URL
  const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  useEffect(() => {
    const fetchSpaces = async () => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/spaces/`);
            setSpaces(response.data);
            setFilteredSpaces(response.data);
        } catch (err) {
            console.error("Using fallback data...");
            const fallback = [
                { id: 1, name: "Seb's Hub", address: "32 Awolowo Ave, Bodija", access_tier: "PREMIUM", amenities: ["AC", "WiFi"] },
                { id: 3, name: "Stargate Workstation", address: "Cocoa House, Dugbe", access_tier: "STANDARD", amenities: ["WiFi"] },
            ];
            setSpaces(fallback);
            setFilteredSpaces(fallback);
        } finally {
            setLoading(false);
        }
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    let results = spaces;
    if (searchTerm) {
      results = results.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (activeFilter !== 'all') {
      results = results.filter(s => s.access_tier === activeFilter.toUpperCase());
    }
    setFilteredSpaces(results);
  }, [searchTerm, activeFilter, spaces]);

  const handleInitiateBooking = async (spaceId) => {
    setIsBooking(true);
    setError(null);
    try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
        
        if (!token) throw new Error("AUTH_REQUIRED: Please log in again.");

        // Trailing slash added to URL for Django compatibility
        const response = await axios.post(
            `${getBaseUrl()}/api/spaces/generate-token/`, 
            { space_id: spaceId },
            { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            }
        );
        setBookingToken(response.data);
    } catch (err) {
        const msg = err.response?.data?.error || err.message;
        setError(`ACCESS_DENIED: ${msg}`);
        setTimeout(() => setError(null), 5000);
    } finally {
        setIsBooking(false);
    }
  };

  const SpaceCard = ({ space }) => (
    <div className="group bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-sm shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-[var(--text-main)] font-mono font-bold text-lg">{space.name}</h3>
          <div className="flex items-center text-xs text-[var(--text-muted)] mt-1 font-mono">
            <MapPin className="w-3 h-3 mr-1" /> {space.address}
          </div>
        </div>
        <Badge variant={space.access_tier === 'PREMIUM' ? 'premium' : 'default'}>
          {space.access_tier === 'PREMIUM' ? 'Tier_1' : 'Tier_2'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 py-3 border-t border-dashed border-[var(--border-color)]">
        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]"><Wifi className="w-3 h-3" /> <span>NET: OK</span></div>
        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]"><Zap className="w-3 h-3" /> <span>PWR: 100%</span></div>
        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]"><Coffee className="w-3 h-3" /> <span>FUEL</span></div>
      </div>

      <button 
        disabled={isBooking}
        onClick={() => handleInitiateBooking(space.id)}
        className="w-full mt-3 bg-[var(--bg-input)] hover:bg-[var(--color-accent)] hover:text-white border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono py-2 uppercase tracking-widest disabled:opacity-50"
      >
        {isBooking ? ':: REQUESTING...' : ':: INITIATE_BOOKING'}
      </button>
    </div>
  );

  return (
    <AppLayout activePage="spaces">
      <Head><title>Grid Access | Workspace OS</title></Head>

      {bookingToken && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-surface)] border-2 border-[var(--color-accent)] p-8 w-full max-w-sm relative text-center">
                <button onClick={() => setBookingToken(null)} className="absolute top-2 right-2 text-[var(--text-muted)]"><X /></button>
                <h2 className="text-[var(--color-accent)] font-mono text-sm mb-4">ACCESS_GRANTED</h2>
                <div className="text-4xl font-bold font-mono tracking-[1rem] text-[var(--text-main)] mb-6 ml-4">{bookingToken.code}</div>
                <p className="text-[var(--text-muted)] text-[10px] font-mono uppercase">Show this to the node operator.</p>
                {bookingToken.meta && (
                  <div className="mt-6 pt-4 border-t border-dashed border-[var(--border-color)] flex justify-between text-[10px] font-mono">
                      <span>REMAINING:</span>
                      <span className="text-[var(--color-accent)]">{bookingToken.meta.days_total - bookingToken.meta.days_used} DAYS</span>
                  </div>
                )}
            </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-20 left-4 right-4 bg-red-900/90 text-white p-3 font-mono text-[10px] border border-red-500 z-40">&gt; ERROR: {error}</div>
      )}

      <div className="mb-6 space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight">SECTOR MAP</h1>
        <div className="flex space-x-1 p-1 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-sm">
            {['all', 'premium', 'standard'].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`flex-1 py-1.5 text-[10px] font-mono uppercase ${activeFilter === f ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--text-muted)]'}`}>{f}</button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? <div className="text-center py-12 animate-pulse">&gt; LOADING TOPOLOGY...</div> : filteredSpaces.map(s => <SpaceCard key={s.id} space={s} />)}
      </div>
    </AppLayout>
  );
}