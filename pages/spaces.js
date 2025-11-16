import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Wifi, Coffee, Users, Clock, Search, Filter, Star, Zap, Sparkles, Navigation } from 'lucide-react';

export default function SpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/spaces/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSpaces(response.data);
        setFilteredSpaces(response.data);
      } catch (err) {
        console.error('Error fetching spaces:', err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    let results = spaces;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(space => 
        space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tier filter
    if (activeFilter !== 'all') {
      results = results.filter(space => space.access_tier === activeFilter.toUpperCase());
    }
    
    setFilteredSpaces(results);
  }, [searchTerm, activeFilter, spaces]);

  const SpaceCard = ({ space }) => (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group active:scale-95">
      <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-4">
          <div className="flex items-center justify-between w-full">
            <Badge className={`${space.access_tier === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'} border backdrop-blur-sm`}>
              {space.access_tier === 'PREMIUM' ? '⭐ Premium' : '✨ Standard'}
            </Badge>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">{space.name}</h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1 text-purple-400" />
          <span className="line-clamp-2">{space.address}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center">
            <Wifi className="w-4 h-4 mr-1 text-green-400" />
            <span>WiFi</span>
          </div>
          {space.amenities?.includes('AC') && (
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-blue-400" />
              <span>AC</span>
            </div>
          )}
          {space.amenities?.includes('Kitchen') && (
            <div className="flex items-center">
              <Coffee className="w-4 h-4 mr-1 text-orange-400" />
              <span>Kitchen</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <Clock className="w-4 h-4 inline mr-1" />
            Open Now
          </div>
          <Button size="sm" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const FilterButton = ({ active, children, onClick, count }) => (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={`whitespace-nowrap ${
        active 
          ? 'bg-purple-600 text-white border-purple-600' 
          : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800'
      }`}
    >
      {children}
      {count !== undefined && (
        <Badge className="ml-2 bg-gray-700 text-gray-300 border-0 text-xs">
          {count}
        </Badge>
      )}
    </Button>
  );

  return (
    <AppLayout activePage="spaces">
      <Head>
        <title>Spaces | Workspace Africa</title>
      </Head>

      {/* --- Modern Header --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Find Your Space</h1>
            <p className="text-gray-400 text-sm mt-1">Discover amazing co-working spaces near you</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search spaces by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        {/* --- Quick Filters --- */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
            count={spaces.length}
          >
            All Spaces
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'premium'} 
            onClick={() => setActiveFilter('premium')}
            count={spaces.filter(s => s.access_tier === 'PREMIUM').length}
          >
            ⭐ Premium
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'standard'} 
            onClick={() => setActiveFilter('standard')}
            count={spaces.filter(s => s.access_tier === 'STANDARD').length}
          >
            ✨ Standard
          </FilterButton>
        </div>

        {/* --- Advanced Filters (Collapsible) --- */}
        {showFilters && (
          <Card className="mt-4 border-0 bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Advanced Filters</h3>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {['Open Now', 'WiFi', 'Coffee', 'Parking', 'Meeting Rooms', 'Events'].map((amenity) => (
                  <Button
                    key={amenity}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* --- Spaces Grid --- */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <Card key={i} className="animate-pulse border-0 bg-gray-900">
              <div className="aspect-video bg-gray-800 rounded-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {filteredSpaces.length} of {spaces.length} spaces
            </p>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10">
              <Navigation className="w-4 h-4 mr-1" />
              Map View
            </Button>
          </div>
          
          {/* Spaces List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredSpaces.map(space => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredSpaces.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">No spaces found</h3>
              <p className="text-gray-400 text-sm mb-4">
                Try adjusting your search or filters to find more spaces
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
