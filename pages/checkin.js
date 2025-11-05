import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function CheckInPage() {
  const [qrCode, setQrCode] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCheckInData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { Router.push('/login'); return; }

      const [userRes, tokenRes] = await Promise.all([
        axios.get(`${API_URL}/api/users/me/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.post(`${API_URL}/api/check-in/generate/`, {}, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setUser(userRes.data);
      setQrCode(tokenRes.data.code);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        Router.push('/login');
      } else {
        setError(err.response?.data?.error || 'Could not generate code.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckInData();
  }, []);

  return (
    <AppLayout activePage="checkin">
      <Head>
        <title>Your Check-In Code | Workspace Africa</title>
      </Head>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-foreground">
          Your Digital Key
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Show this at the partner's front desk to check in.
        </p>

        <Card className="p-8 mt-8 shadow-xl">
          <CardContent className="p-0">
            {loading && (
              <p className="py-20 text-center text-muted-foreground">Generating your code...</p>
            )}
            
            {error && (
              <div className="py-20 text-center">
                <p className="text-lg text-destructive">{error}</p>
                <Button onClick={fetchCheckInData} className="mt-4">
                  Try Again
                </Button>
              </div>
            )}

            {qrCode && user && (
              <div className="flex flex-col items-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.photo_url} alt={user.username} />
                  <AvatarFallback className="text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-3 text-2xl font-bold text-foreground">
                  {user.username}
                </p>
                <p className="text-sm text-primary">
                  {user.subscription?.plan?.name || 'No Plan Active'}
                </p>
                
                <div className="my-8 text-center">
                  <p className="text-6xl font-extrabold tracking-widest text-foreground">
                    {qrCode.slice(0, 3)}-{qrCode.slice(3, 6)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    (QR code placeholder)
                  </p>
                </div>
                
                <div className="w-full pt-4 text-center border-t">
                  <p className="text-lg font-bold text-foreground">
                    {user.days_used} / {user.total_days > 900 ? 'Unlimited' : user.total_days}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Used This Month</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
