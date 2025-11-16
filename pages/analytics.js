import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, MapPin, Clock, Star, Zap, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  const analyticsData = {
    overview: {
      totalCheckins: 47,
      monthlyCheckins: 12,
      favoriteSpace: 'Tech Hub Ibadan',
      daysUsed: 8,
      daysRemaining: 7
    },
    monthlyStats: {
      current: 12,
      previous: 8,
      change: 50,
      trend: 'up'
    },
    spacesVisited: [
      { name: 'Tech Hub Ibadan', visits: 8, tier: 'PREMIUM' },
      { name: 'Creative Space UI', visits: 3, tier: 'STANDARD' },
      { name: 'Lekki Workspace', visits: 1, tier: 'PREMIUM' }
    ],
    weeklyPattern: [
      { day: 'Mon', checkins: 3 },
      { day: 'Tue', checkins: 2 },
      { day: 'Wed', checkins: 4 },
      { day: 'Thu', checkins: 1 },
      { day: 'Fri', checkins: 2 },
      { day: 'Sat', checkins: 0 },
      { day: 'Sun', checkins: 0 }
    ],
    peakHours: [
      { hour: '8-9 AM', percentage: 15 },
      { hour: '9-10 AM', percentage: 25 },
      { hour: '10-11 AM', percentage: 20 },
      { hour: '2-3 PM', percentage: 18 },
      { hour: '4-5 PM', percentage: 12 }
    ]
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

  const StatCard = ({ title, value, change, trend, icon, color = "purple" }) => (
    <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
          {change && (
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

      {/* --- Overview Stats --- */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Monthly Check-ins"
          value={analyticsData.monthlyStats.current}
          change={analyticsData.monthlyStats.change}
          trend={analyticsData.monthlyStats.trend}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Total Check-ins"
          value={analyticsData.overview.totalCheckins}
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
            {analyticsData.overview.daysUsed} of 15 days used this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressBar
              percentage={(analyticsData.overview.daysUsed / 15) * 100}
              color="purple"
              label="Days Used"
              value={`${analyticsData.overview.daysUsed}/15 days`}
            />
          </div>
        </CardContent>
      </Card>

      {/* --- Top Spaces --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            Top Spaces Visited
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.spacesVisited.map((space, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{space.name}</h4>
                    <Badge className={`${space.tier === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'} text-xs mt-1`}>
                      {space.tier === 'PREMIUM' ? '⭐ Premium' : '✨ Standard'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{space.visits}</div>
                  <div className="text-gray-400 text-xs">visits</div>
                </div>
              </div>
            ))}
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
            {analyticsData.weeklyPattern.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-6 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(day.checkins / 4) * 80}px` }}
                ></div>
                <span className="text-gray-400 text-xs mt-2">{day.day}</span>
                <span className="text-white text-xs font-bold mt-1">{day.checkins}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- Peak Hours --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-400" />
            Peak Hours
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your most frequent check-in times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>{hour.hour}</span>
                  <span>{hour.percentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${hour.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
