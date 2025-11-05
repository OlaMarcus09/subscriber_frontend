import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const userRes = await axios.get(`${API_URL}/api/users/me/`, {
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

  return (
    <AppLayout activePage="profile">
      <Head>
        <title>Your Profile | Workspace Africa</title>
      </Head>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.photo_url} alt={user?.username} />
              <AvatarFallback className="text-xl">
                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.username || '...'}</CardTitle>
              <CardDescription>{user?.email || '...'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Plan</h3>
            <p className="mt-2 text-xl font-bold text-primary">
              {user?.subscription?.plan?.name || 'No Active Plan'}
            </p>
            
            {user?.subscription && (
              <div className="mt-4">
                <p className="text-lg font-bold text-foreground">
                  {user.days_used} / {user.total_days > 900 ? 'Unlimited' : user.total_days}
                </p>
                <p className="text-sm text-muted-foreground">Days Used This Month</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Button
        onClick={handleLogout}
        variant="destructive" // This uses our orange/red theme
        className="w-full mt-8"
      >
        Log Out
      </Button>
      
    </AppLayout>
  );
}
