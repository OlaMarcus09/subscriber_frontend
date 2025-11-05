import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';

export default function AppHome() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/login');
          return;
        }
        
        const [userRes, spacesRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/spaces/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
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

      <h1 className="text-3xl font-bold text-neutral-900">
        Good Morning, {user?.username || '...'}
      </h1>
      
      {/* --- Check-In Button (Teal) --- */}
      <div className="mt-6">
        <Link href="/checkin" legacyBehavior>
          <a className="block w-full px-6 py-4 font-bold text-center text-white bg-teal-600 shadow-lg rounded-xl text-lg hover:bg-teal-700">
            Show My Check-In Key
          </a>
        </Link>
      </div>

      {/* --- Map Placeholder (light) --- */}
      <div className="w-full h-48 mt-8 bg-neutral-200 rounded-xl flex items-center justify-center">
        <p className="text-neutral-500">(Map View Placeholder)</p>
      </div>

      {/* --- Nearby Spaces List (light) --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-neutral-900">Nearby Spaces</h2>
        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-neutral-600">Loading spaces...</p>
          ) : (
            spaces.map(space => (
              <div key={space.id} className="p-4 bg-white shadow rounded-xl border border-neutral-100">
                <p className="font-bold text-neutral-900">{space.name}</p>
                <p className="text-sm text-neutral-600">{space.address}</p>
                <p className="mt-2 text-xs font-medium text-teal-600">
                  {space.access_tier === 'PREMIUM' ? 'Premium Tier' : 'Standard Tier'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
