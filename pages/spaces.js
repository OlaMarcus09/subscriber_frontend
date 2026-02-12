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

  useEffect(() => {
    // Fetching spaces from your backend
    const fetchSpaces = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/spaces/`);
            setSpaces(response.data);
            setFilteredSpaces(response.data);
        } catch (err) {
            console.error("Failed to load spaces:", err);
            // Fallback to static if API fails during setup
            const fallback = [
                { id: 1, name: "Seb's Hub", address: "32 Awolowo Ave, Bodija", access_tier: "PREMIUM", amenities: ["AC", "Kitchen", "WiFi"] },
                { id: 3, name: "Stargate Workstation", address: "Cocoa House, Dugbe", access_tier: "STANDARD", amenities: ["AC", "WiFi"] },
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
      results = results.filter(space => 
        space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      results = results.filter(space => space.access_tier === activeFilter.toUpperCase());
    }
    setFilteredSpaces(results);
  }, [searchTerm, activeFilter, spaces]);

  const handleInitiateBooking = async (spaceId) => {
    setIsBooking(true);
    setError(null);
    try {
        // Use fresh token from localStorage
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            throw new Error("UNAUTHORIZED: Please log in again.");
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/spaces/generate-token/`, 
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
        // If backend returns "No active subscription", we catch it here
        const backendError = err.response?.data?.error || err.message;
        setError(`ACCESS_DENIED: ${backendError}`);
        
        // Auto-clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
    } finally {
        setIsBooking(false);
    }
  };

  const SpaceCard = ({ space }) => (
    <div className="group relative bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-accent)] transition-all duration-300 overflow-hidden rounded-sm shadow-sm">
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--text-muted)] group-hover:border-[var(--color-accent)] transition-colors" />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="text-[var(--text-main)] font-mono font-bold text-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors">
                    {space.name}
                </h3>
                <div className="flex items-center text-xs text-[var(--text-muted)] mt-1 font-mono">
                    <MapPin className="w-3 h-3 mr-1" />
                    {space.address}
                </div>
            </div>
            <Badge variant={space.access_tier === 'PREMIUM' ? 'premium' : 'default'}>
                {space.access_tier === 'PREMIUM' ? 'Tier_1' : 'Tier_2'}
            </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-dashed border-[var(--border-color)]">
            <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
                <Wifi className="w-3 h-3" /> <span>NET: OK</span>
            </div>
            {space.amenities?.includes('AC') && (
                <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
                    <Zap className="w-3 h-3" /> <span>PWR: 100%</span>
                </div>
            )}
            {space.amenities?.includes('Coffee') && (
                <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
                    <Coffee className="w-3 h-3" /> <span>FUEL</span>
                </div>
            )}
        </div>

        <button 
            disabled={isBooking}
            onClick={() => handleInitiateBooking(space.id)}
            className="w-full mt-3 bg-[var(--bg-input)] hover:bg-[var(--color-accent)] hover:text-white border border-[var(--border-color)] hover:border-[var(--color-accent)] text-[var(--text-muted)] text-xs font-mono py-2 px-4 transition-all uppercase tracking-widest disabled:opacity-50"
        >
            {isBooking ? ':: REQUESTING_ACCESS...' : ':: INITIATE_BOOKING'}
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout activePage="spaces">
      <Head>
        <title>Grid Access | Workspace OS</title>
      </Head>

      {bookingToken && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-surface)] border-2 border-[var(--color-accent)] p-8 w-full max-w-sm relative text-center">
                <button onClick={() => setBookingToken(null)} className="absolute top-2 right-2 text-[var(--text-muted)]">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-[var(--color-accent)] font-mono text-sm mb-4">ACCESS_GRANTED</h2>
                <div className="text-4xl font-bold font-mono tracking-[1rem] text-[var(--text-main)] mb-6 ml-4">
                    {bookingToken.code}
                </div>
                <p className="text-[var(--text-muted)] text-[10px] font-mono leading-relaxed">
                    SHOW THIS CODE TO THE NODE OPERATOR FOR VALIDATION. 
                    EXPIRES IN 5 MINUTES.
                </p>
                {bookingToken.meta && (
                    <div className="mt-6 pt-4 border-t border-dashed border-[var(--border-color)] flex justify-between text-[10px] font-mono">
                        <span className="text-[var(--text-muted)]">REMAINING_DAYS:</span>
                        <span className="text-[var(--color-accent)]">{bookingToken.meta.days_total - bookingToken.meta.days_used}</span>
                    </div>
                )}
            </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-20 left-4 right-4 bg-red-900/90 text-white p-3 font-mono text-[10px] border border-red-500 z-40">
            &gt; ERROR: {error}
        </div>
      )}

      <div className="mb-6 space-y-6">
        <div className="flex items-end justify-between border-b border-[var(--border-color)] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] font-mono tracking-tight">SECTOR MAP</h1>
            <p className="text-[var(--text-muted)] text-xs font-mono mt-1">
              &gt; LOCATING AVAILABLE NODES...
            </p>
          </div>
          <Cpu className="w-6 h-6 text-[var(--text-muted)]" />
        </div>

        <div className="flex space-x-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="SEARCH_COORDS..."
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] pl-9 pr-4 py-2.5 text-xs font-mono focus:border-[var(--color-accent)] focus:ring-0 outline-none rounded-sm"
                />
            </div>
            <button className="px-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <Filter className="w-4 h-4" />
            </button>
        </div>

        <div className="flex space-x-1 p-1 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-sm">
            {['all', 'premium', 'standard'].map(filter => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                        flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all rounded-sm
                        ${activeFilter === filter ? 'bg-[var(--color-accent)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}
                    `}
                >
                    {filter}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="text-center py-12 font-mono text-xs text-[var(--color-accent)] animate-pulse">
                &gt; DOWNLOADING TOPOLOGY...
             </div>
        ) : (
            <>
                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    <span>Active Nodes: {filteredSpaces.length}</span>
                    <Battery className="w-3 h-3 text-[var(--color-accent)]" />
                </div>
                {filteredSpaces.map(space => (
                    <SpaceCard key={space.id} space={space} />
                ))}
            </>
        )}
      </div>
    </AppLayout>
  );
}