import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Wifi, Coffee, Users, Clock, Zap, Star, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  // Static featured spaces for landing page (to avoid 401 error)
  const featuredSpaces = [
    {
      id: 1,
      name: "Tech Hub Ibadan",
      address: "Bodija, Ibadan",
      access_tier: "PREMIUM",
      amenities: ["wifi", "coffee", "printing"]
    },
    {
      id: 2,
      name: "Creative Space UI",
      address: "University Area, Ibadan",
      access_tier: "STANDARD",
      amenities: ["wifi", "meeting-rooms"]
    },
    {
      id: 3,
      name: "Lekki Workspace",
      address: "Lekki Phase 1, Lagos",
      access_tier: "PREMIUM",
      amenities: ["wifi", "coffee", "parking"]
    },
    {
      id: 4,
      name: "Abuja Business Center",
      address: "Garki, Abuja",
      access_tier: "PREMIUM",
      amenities: ["wifi", "coffee", "ac"]
    },
    {
      id: 5,
      name: "Yaba Innovation Hub",
      address: "Yaba, Lagos",
      access_tier: "STANDARD",
      amenities: ["wifi", "events"]
    },
    {
      id: 6,
      name: "Ikeja Corporate",
      address: "Ikeja, Lagos",
      access_tier: "PREMIUM",
      amenities: ["wifi", "coffee", "printing"]
    }
  ];

  useEffect(() => {
    // Use static data to avoid 401 error on landing page
    setSpaces(featuredSpaces);
    setLoading(false);
  }, []);

  const SpaceCard = ({ space }) => (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group">
      <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-4">
          <Badge className={`${space.access_tier === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'} border backdrop-blur-sm`}>
            {space.access_tier === 'PREMIUM' ? '⭐ Premium' : '✨ Standard'}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Sparkles className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{space.name}</h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1 text-purple-400" />
          <span className="line-clamp-1">{space.address}</span>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center">
            <Wifi className="w-3 h-3 mr-1 text-green-400" />
            <span>WiFi</span>
          </div>
          <div className="flex items-center">
            <Coffee className="w-3 h-3 mr-1 text-orange-400" />
            <span>Coffee</span>
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1 text-blue-400" />
            <span>Community</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FeatureItem = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Workspace Africa | Your City, Your Office</title>
        <meta name="description" content="Flexible co-working spaces across Nigeria. Work from premium locations with one simple pass." />
      </Head>

      {/* --- Modern Header --- */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Workspace
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="hidden sm:flex text-gray-300 hover:text-white hover:bg-gray-800">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="container relative px-4 mx-auto py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm font-medium mb-6 border border-purple-500/20">
              <Zap className="w-4 h-4 mr-2" />
              🚀 Perfect for Freelancers & Creatives
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Your City,<br />Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Office.</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Stop being locked into one location. Access premium co-working spaces across Nigeria with one flexible pass. 
              <span className="block text-purple-300 font-medium mt-3 text-sm">
                ✨ Perfect for digital nomads, freelancers, and remote workers
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="text-lg h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                <Link href="/signup">Start Your Journey →</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg h-14 px-8 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <a href="#spaces">Explore Spaces</a>
              </Button>
            </div>

            {/* Email Capture */}
            <div className="max-w-md mx-auto bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <p className="text-gray-300 text-sm mb-3">Get early access & updates</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                  Notify Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get access to amazing workspaces in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '📱', title: 'Sign Up & Choose Plan', desc: 'Pick the perfect plan for your needs in under 2 minutes' },
              { icon: '🗺️', title: 'Browse & Select Space', desc: 'Find the perfect spot near you with our interactive map' },
              { icon: '🔑', title: 'Check In & Get Working', desc: 'Generate your digital key and start working immediately' }
            ].map((step, index) => (
              <div key={index} className="text-center p-6 group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center text-2xl border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="font-bold text-xl text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Why Choose Workspace Africa?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to work flexibly across Nigeria</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FeatureItem
              icon="🌍"
              title="Multiple Cities"
              description="Access workspaces across Ibadan, Lagos, Abuja and more cities coming soon"
            />
            <FeatureItem
              icon="💳"
              title="One Pass, Many Spaces"
              description="Single subscription gives you access to all our partner spaces nationwide"
            />
            <FeatureItem
              icon="⚡"
              title="Instant Access"
              description="Generate check-in codes instantly from your phone. No appointments needed"
            />
            <FeatureItem
              icon="💰"
              title="Flexible Plans"
              description="Choose from daily, monthly, or unlimited plans that fit your workflow"
            />
          </div>
        </div>
      </section>

      {/* --- Featured Spaces --- */}
      <section id="spaces" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Featured Spaces</h2>
            <p className="text-gray-400">Discover amazing co-working spaces across Nigeria</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse bg-gray-900 border-0">
                  <div className="aspect-video bg-gray-800 rounded-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map(space => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
              <Link href="/signup" className="flex items-center justify-center">
                See All Spaces & Get Started
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-y border-gray-800">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Ready to Transform Your Workday?</h2>
          <p className="text-purple-200 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of freelancers, creators, and remote workers who've found their perfect workspace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-white text-black hover:bg-gray-100 text-lg h-14 px-8 font-bold">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 text-lg h-14 px-8">
              <Link href="/login">Existing Member</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container px-4 mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
              W
            </div>
            <span className="font-bold text-white">Workspace Africa</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Workspace Africa. Your city, your office. 🚀</p>
          <div className="flex justify-center space-x-6 mt-4 text-xs">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
