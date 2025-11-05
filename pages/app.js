import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button'; // Using shadcn Button
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'; // Using shadcn Card

export default function AppHome() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const [userRes, spacesRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/spaces/`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setUser(userRes.data);
        setSpaces(spacesRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AppLayout activePage="home">
      <Head>
        <title>Home | Workspace Africa</title>
      </Head>

      <h1 className="text-3xl font-bold text-foreground">
        Good Morning, {user?.username || '...'}
      </h1>
      
      {/* --- Check-In Button (shadcn) --- */}
      <div className="mt-6">
        <Button asChild className="w-full text-lg h-12" size="lg">
          <Link href="/checkin">Show My Check-In Key</Link>
        </Button>
      </div>

      {/* --- Map Placeholder (light) --- */}
      <Card className="w-full h-48 mt-8">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">(Map View Placeholder)</p>
        </CardContent>
      </Card>

      {/* --- Nearby Spaces List (shadcn) --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-foreground">Nearby Spaces</h2>
        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading spaces...</p>
          ) : (
            spaces.map(space => (
              <Card key={space.id}>
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                  <CardDescription>{space.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">
                    {space.access_tier === 'PREMIUM' ? 'Premium Tier' : 'Standard Tier'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
