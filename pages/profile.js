import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/login');
          return;
        }
        
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

      <h1 className="text-3xl font-bold text-neutral-900">
        Your Profile
      </h1>
      
      <div className="p-6 mt-8 bg-white shadow rounded-2xl">
        {loading ? (
          <p>Loading profile...</p>
        ) : user ? (
          <div>
            <img 
              src={user.photo_url || `https://ui-avatars.com/api/?name=${user.username}&background=0d9488&color=fff&size=80`} 
              alt="User"
              className="w-20 h-20 rounded-full"
            />
            <h2 className="mt-4 text-3xl font-bold text-neutral-900">
              {user.username}
            </h2>
            <p className="text-lg text-neutral-600">{user.email}</p>
            
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Current Plan</h3>
              <p className="mt-2 text-xl font-bold text-teal-600">
                {user.subscription?.plan?.name || 'No Active Plan'}
              </p>
              
              {user.subscription && (
                <div className="mt-4">
                  <p className="text-lg font-bold text-neutral-900">
                    {user.days_used} / {user.total_days > 900 ? 'Unlimited' : user.total_days}
                  </p>
                  <p className="text-sm text-neutral-600">Days Used This Month</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Could not load user profile.</p>
        )}
      </div>
      
      <button
        onClick={handleLogout}
        className="w-full px-6 py-3 mt-8 font-bold text-red-700 bg-red-100 rounded-lg text-md hover:bg-red-200"
      >
        Log Out
      </button>
      
    </AppLayout>
  );
}
