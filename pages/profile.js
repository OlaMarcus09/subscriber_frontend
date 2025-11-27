import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { User, CreditCard, Settings, LogOut, Mail, Phone, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  useEffect(() => {
     const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) { Router.push('/'); return; }
            
            const response = await axios.get(`${API_URL}/api/users/me/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (err) {
            console.error(err);
        }
     };
     fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/');
  };

  if (!user) return <div className="p-8 text-center font-mono text-[var(--text-muted)]">LOADING_PROFILE...</div>;

  return (
    <AppLayout activePage="profile">
      <Head><title>Profile | Workspace OS</title></Head>

      <div className="flex items-center space-x-4 mb-8 bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden shadow-sm">
         <div className="w-16 h-16 bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-mono text-[var(--text-main)] rounded-full">
            {user.username?.[0]?.toUpperCase()}
         </div>
         <div>
            <h1 className="text-xl font-bold text-[var(--text-main)] font-mono uppercase">{user.username}</h1>
            <div className="flex items-center mt-1 space-x-2">
                <span className="text-[9px] font-mono bg-[var(--color-accent)] text-white px-1.5 py-0.5">MEMBER</span>
                <span className="text-[var(--text-muted)] font-mono text-xs">{user.subscription?.plan?.name || 'NO_PLAN'}</span>
            </div>
         </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 min-h-[400px] shadow-sm">
         <h2 className="text-[var(--text-main)] font-bold mb-4">Personal Information</h2>
         <div className="space-y-2">
            <div className="flex justify-between py-3 border-b border-[var(--border-color)]">
                <span className="text-xs font-mono text-[var(--text-muted)]">FULL NAME</span>
                <span className="text-sm font-mono text-[var(--text-main)]">{user.username}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-color)]">
                <span className="text-xs font-mono text-[var(--text-muted)]">EMAIL</span>
                <span className="text-sm font-mono text-[var(--text-main)]">{user.email}</span>
            </div>
         </div>
         <button onClick={handleLogout} className="mt-8 flex items-center text-red-500 text-xs font-mono uppercase hover:underline">
            <LogOut className="w-4 h-4 mr-2" /> LOG OUT
         </button>
      </div>
    </AppLayout>
  );
}
