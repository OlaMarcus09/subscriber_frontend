import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

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
      if (!token) {
        Router.push('/login');
        return;
      }

      const [userRes, tokenRes] = await Promise.all([
        axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post(`${API_URL}/api/check-in/generate/`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
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
        <h1 className="text-3xl font-bold text-center text-neutral-900">
          Your Digital Key
        </h1>
        <p className="mt-2 text-center text-neutral-600">
          Show this at the partner's front desk to check in.
        </p>

        {/* --- The main QR Code Card --- */}
        <div className="p-8 mt-8 bg-white shadow-xl rounded-2xl">
          {loading && (
            <p className="py-20 text-center text-neutral-500">Generating your code...</p>
          )}
          
          {error && (
            <div className="py-20 text-center">
              <p className="text-lg text-red-600">{error}</p>
              <button 
                onClick={fetchCheckInData}
                className="px-5 py-2 mt-4 font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                Try Again
              </button>
            </div>
          )}

          {qrCode && user && (
            <div className="flex flex-col items-center">
              <img 
                src={user.photo_url || `https://ui-avatars.com/api/?name=${user.username}&background=0d9488&color=fff&size=80`} 
                alt="User"
                className="w-20 h-20 rounded-full"
              />
              <p className="mt-3 text-2xl font-bold text-neutral-900">
                {user.username}
              </p>
              <p className="text-sm text-teal-600">
                {user.subscription?.plan?.name || 'No Plan Active'}
              </p>
              
              <div className="my-8 text-center">
                <p className="text-6xl font-extrabold tracking-widest text-neutral-900">
                  {qrCode.slice(0, 3)}-{qrCode.slice(3, 6)}
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  (QR code placeholder)
                </p>
              </div>
              
              <div className="w-full pt-4 text-center border-t border-neutral-200">
                <p className="text-lg font-bold text-neutral-900">
                  {user.days_used} / {user.total_days > 900 ? 'Unlimited' : user.total_days}
                </p>
                <p className="text-sm text-neutral-600">Days Used This Month</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
