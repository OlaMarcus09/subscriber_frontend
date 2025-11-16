import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, MapPin, Clock, Star, Zap, Sparkles, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  // Default zero analytics data
  const zeroAnalytics = {
    overview: {
      total_checkins: 0,
      monthly_checkins: 0,
      days_used: 0,
      favorite_space: 'None',
      member_since: 'Just now'
    },
    subscription: {
      plan_name: 'Flex Pro',
      total_days: 18,
      days_used: 0,
      days_remaining: 18,
      access_tier: 'PREMIUM'
    },
    monthly_stats: {
      current: 0,
      previous: 0,
      change: 0,
      trend: 'neutral'
    },
    spaces_visited: [],
    weekly_pattern: [
      { day: 'Mon', checkins: 0 },
      { day: 'Tue', checkins: 0 },
      { day: 'Wed', checkins: 0 },
      { day: 'Thu', checkins: 0 },
      { day: 'Fri', checkins: 0 },
      { day: 'Sat', checkins: 0 },
      { day: 'Sun', checkins: 0 }
    ],
    peak_hours: []
  };

  const [analytics, setAnalytics] = useState(zeroAnalytics);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        setUser(userRes.data);
        // For now, we use zero data since no check-ins exist
        setAnalytics({
          ...zeroAnalytics,
          overview: {
            ...zeroAnalytics.overview,
            member_since: new Date(userRes.data.date_created).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) || 'Just now'
          }
        });
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

  const StatCard = ({ title, value, change, trend, icon, color = "purple" }) => (
    <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
          {change !== undefined && change > 0 && (
            <Badge className={`${trend === 'up' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'} text-xs`}>
              {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {change}%
            </Badge>
          )}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </CardContent>
    </Card>
  );

  const ProgressBar = ({ percentage, color = "purple", label, value }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div 
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AppLayout activePage="analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const usagePercentage = analytics.subscription ? 
    (analytics.overview.days_used / analytics.subscription.total_days) * 100 : 0;

  return (
    <AppLayout activePage="analytics">
      <Head>
        <title>Analytics | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Analytics</h1>
            <p className="text-gray-400 text-sm mt-1">Track your workspace usage and patterns</p>
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mb-4">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={`flex-1 capitalize ${
                timeRange === range 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* --- Empty State --- */}
      {analytics.overview.total_checkins === 0 && (
        <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">No Data Yet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Start checking into workspaces to see your analytics and usage patterns here.
            </p>
            <Button 
              onClick={() => Router.push('/spaces')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Find a Space to Check In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* --- Overview Stats --- */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Monthly Check-ins"
          value={analytics.overview.monthly_checkins}
          change={analytics.monthly_stats?.change}
          trend={analytics.monthly_stats?.trend}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Total Check-ins"
          value={analytics.overview.total_checkins}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
      </div>

      {/* --- Usage Progress --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Monthly Usage
          </CardTitle>
          <CardDescription className="text-gray-400">
            {analytics.overview.days_used} of {analytics.subscription?.total_days || 18} days used this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressBar
              percentage={usagePercentage}
              color="purple"
              label="Days Used"
              value={`${analytics.overview.days_used}/${analytics.subscription?.total_days || 18} days`}
            />
          </div>
        </CardContent>
      </Card>

      {/* --- Weekly Pattern --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-400" />
            Weekly Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end h-32 mb-4">
            {analytics.weekly_pattern.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-6 bg-gradient-to-t from-purple-500/50 to-blue-500/50 rounded-t transition-all duration-500"
                  style={{ height: `${Math.max(day.checkins * 20, 8)}px` }} // Minimum height for visibility
                ></div>
                <span className="text-gray-400 text-xs mt-2">{day.day}</span>
                <span className="text-white text-xs font-bold mt-1">{day.checkins}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center">
            Check in during the week to see your pattern
          </p>
        </CardContent>
      </Card>

      {/* --- Member Info --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Your Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Plan</span>
              <span className="text-white font-medium">Flex Pro</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Access Tier</span>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                ⭐ Premium
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Member Since</span>
              <span className="text-white">{analytics.overview.member_since}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Favorite Space</span>
              <span className="text-white">{analytics.overview.favorite_space}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
