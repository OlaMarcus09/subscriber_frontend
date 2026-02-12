import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { User, CreditCard, Settings, LogOut, Mail, Phone, MapPin, Edit2, Save, X, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  
  const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'https://workspace-africa-backend.vercel.app';

  // Helper to fetch user
  const fetchProfile = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }
        const response = await axios.get(`${API_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setEditForm(response.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleLogout = () => {
    localStorage.clear();
    // Redirect to the Login Page or Gateway
    Router.push('/');
  };

  const handleSave = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        // Send PATCH request to update user
        await axios.patch(`${API_URL}/api/users/me/`, editForm, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUser(editForm); // Update local UI
        setIsEditing(false);
        alert("Profile Updated!");
    } catch (err) {
        console.error("Update failed", err);
        alert("Failed to save changes.");
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Tab Button Component
  const TabButton = ({ id, label, icon: Icon }) => (
    <button onClick={() => setActiveTab(id)} className={`flex-1 py-3 flex items-center justify-center space-x-2 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-colors ${activeTab === id ? 'border-[var(--color-accent)] text-[var(--text-main)] bg-[var(--bg-input)]' : 'border-transparent text-[var(--text-muted)]'}`}>
        <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{label}</span>
    </button>
  );

  // Info Row Component
  const InfoRow = ({ label, name, value, icon: Icon, isEditable }) => (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border-color)] last:border-0">
        <div className="flex items-center text-[var(--text-muted)] min-w-[120px]">
            {Icon && <Icon className="w-4 h-4 mr-3 opacity-70" />}
            <span className="text-xs font-mono uppercase">{label}</span>
        </div>
        {isEditable ? (
             <input name={name} value={value || ''} onChange={handleInputChange} className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-3 py-1 text-sm font-mono text-right w-full max-w-[200px] focus:border-[var(--color-accent)] focus:outline-none" />
        ) : (
             <span className="text-sm text-[var(--text-main)] font-mono text-right">{value || 'Not Set'}</span>
        )}
    </div>
  );

  if (!user) return <div className="p-8 text-center font-mono text-[var(--text-muted)]">LOADING_PROFILE...</div>;

  return (
    <AppLayout activePage="profile">
      <Head><title>Profile | Workspace OS</title></Head>

      {/* Header */}
      <div className="flex items-center space-x-4 mb-8 bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden shadow-sm">
         <div className="w-16 h-16 bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-mono text-[var(--text-main)] rounded-full">
            {user.username?.[0]?.toUpperCase()}
         </div>
         <div>
            <h1 className="text-xl font-bold text-[var(--text-main)] font-mono uppercase">{user.username}</h1>
            <div className="flex items-center mt-1 space-x-2">
                <span className="text-[9px] font-mono bg-[var(--color-accent)] text-white px-1.5 py-0.5">PLAN</span>
                <span className="text-[var(--text-muted)] font-mono text-xs">{user.subscription?.plan?.name || 'FREE_TIER'}</span>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-[var(--border-color)]">
        <TabButton id="details" label="My Details" icon={User} />
        <TabButton id="membership" label="Membership" icon={CreditCard} />
        <TabButton id="settings" label="Settings" icon={Settings} />
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 min-h-[400px] shadow-sm">
        
        {/* DETAILS TAB */}
        {activeTab === 'details' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[var(--text-main)] font-bold">Personal Information</h2>
                    {isEditing && <span className="text-[10px] font-mono text-[var(--color-accent)] animate-pulse">EDITING_MODE</span>}
                </div>
                <div className="space-y-1">
                    <InfoRow label="Username" name="username" value={editForm.username} icon={User} isEditable={isEditing} />
                    <InfoRow label="Email" name="email" value={editForm.email} icon={Mail} isEditable={false} />
                    <InfoRow label="Phone" name="phone" value={editForm.phone} icon={Phone} isEditable={isEditing} />
                </div>
                <div className="mt-8 flex space-x-3">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-widest border border-[var(--color-accent)] px-4 py-2 hover:bg-[var(--color-accent)] transition-all flex items-center hover:text-white">
                            <Edit2 className="w-3 h-3 mr-2" /> EDIT_PROFILE
                        </button>
                    ) : (
                        <>
                            <button onClick={handleSave} className="text-[10px] font-mono text-white bg-[var(--color-accent)] uppercase tracking-widest border border-[var(--color-accent)] px-4 py-2 hover:opacity-90 transition-all flex items-center">
                                <Save className="w-3 h-3 mr-2" /> SAVE
                            </button>
                            <button onClick={() => { setIsEditing(false); setEditForm(user); }} className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest border border-[var(--border-color)] px-4 py-2 hover:border-[var(--text-main)] transition-all flex items-center">
                                <X className="w-3 h-3 mr-2" /> CANCEL
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}

        {/* MEMBERSHIP TAB */}
        {activeTab === 'membership' && (
            <div className="text-center py-8 animate-fade-in">
                <div className="text-[var(--text-muted)] font-mono text-xs uppercase mb-2">Current Status</div>
                <div className="text-3xl font-bold text-[var(--text-main)] font-mono mb-2">{user.subscription?.plan?.name || 'NO ACTIVE PLAN'}</div>
                <button onClick={() => Router.push('/plans')} className="mt-6 w-full max-w-xs py-3 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold hover:opacity-90 transition-colors uppercase">
                    UPGRADE / RENEW
                </button>
            </div>
        )}

        {/* SETTINGS TAB (ADDED) */}
        {activeTab === 'settings' && (
            <div className="animate-fade-in space-y-6">
                
                {/* System Links */}
                <div>
                    <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase mb-3">System</h3>
                    <div className="space-y-2">
                        <a href="https://workspace-africa-gateway.vercel.app" className="flex items-center justify-between p-3 border border-[var(--border-color)] hover:border-[var(--color-accent)] transition-colors group">
                            <span className="text-sm font-mono">Return to Gateway</span>
                            <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--color-accent)]" />
                        </a>
                    </div>
                </div>

                {/* Account Actions */}
                <div>
                    <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase mb-3">Account</h3>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center p-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase text-xs font-bold font-mono tracking-widest">
                        <LogOut className="w-4 h-4 mr-2" /> Log Out
                    </button>
                </div>
            </div>
        )}

      </div>
    </AppLayout>
  );
}
