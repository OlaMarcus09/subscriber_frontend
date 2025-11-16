import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Calendar, CreditCard, Settings, HelpCircle, LogOut, Edit3, Star, Zap, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const profileStats = {
    checkinsThisMonth: 0,
    favoriteSpace: 'None',
    memberSince: 'Just now',
    planUsage: '0/18 days'
  };

  const subscriptionData = {
    planName: 'Flex Pro',
    billingCycle: 'Monthly',
    price: '₦15,000',
    nextBilling: 'Dec 5, 2024',
    status: 'active',
    totalDays: 18,
    daysUsed: 0,
    daysRemaining: 18
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        setUser(userRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/login');
  };

  const StatCard = ({ icon, title, value, subtitle, color = "purple" }) => (
    <Card className="border-0 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-white font-bold text-lg">{value}</p>
            {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MenuItem = ({ icon, title, description, action, color = "gray" }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group">
      <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  );

  return (
    <AppLayout activePage="profile">
      <Head>
        <title>Profile | Workspace Africa</title>
      </Head>

      {/* --- Profile Header --- */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user?.username || 'User'}</h1>
            <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'subscription', label: 'Subscription' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* --- Overview Tab --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              title="Check-ins"
              value={profileStats.checkinsThisMonth}
              subtitle="This month"
              color="purple"
            />
            <StatCard
              icon={<Star className="w-5 h-5" />}
              title="Favorite Space"
              value={profileStats.favoriteSpace}
              color="yellow"
            />
          </div>

          {/* Usage Progress */}
          <Card className="border-0 bg-gradient-to-r from-gray-900 to-black border border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Monthly Usage</h3>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  {profileStats.planUsage}
                </Badge>
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: '0%' }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 days used</span>
                <span>18 days remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Member Since */}
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white font-semibold">{profileStats.memberSince}</p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Subscription Tab --- */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Current Plan */}
          <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-2">
                    Active
                  </Badge>
                  <h3 className="font-bold text-white text-lg">{subscriptionData.planName}</h3>
                  <p className="text-gray-400 text-sm">{subscriptionData.billingCycle}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">{subscriptionData.price}</p>
                  <p className="text-gray-400 text-sm">per month</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Next Billing</span>
                  <span>{subscriptionData.nextBilling}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Plan Access</span>
                  <span>Standard + Premium</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Days Available</span>
                  <span>{subscriptionData.totalDays} days/month</span>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                Manage Subscription
              </Button>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Plan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  '18 days per month',
                  'Access to all standard spaces',
                  'Premium space access',
                  'High-speed WiFi',
                  'Free coffee & tea',
                  'Community events'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Settings Tab --- */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <MenuItem
            icon={<User className="w-5 h-5" />}
            title="Personal Information"
            description="Update your profile details"
            color="blue"
          />
          <MenuItem
            icon={<CreditCard className="w-5 h-5" />}
            title="Payment Methods"
            description="Manage your payment options"
            color="purple"
          />
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            title="Preferences"
            description="Customize your experience"
            color="green"
          />
          <MenuItem
            icon={<HelpCircle className="w-5 h-5" />}
            title="Help & Support"
            description="Get help and contact support"
            color="yellow"
          />
        </div>
      )}

      {/* --- Logout Button --- */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <Button 
          variant="outline" 
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </AppLayout>
  );
}
