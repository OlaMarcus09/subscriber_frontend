import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { User, CreditCard, Settings, LogOut, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  // State for user data
  const [user, setUser] = useState({ 
    username: 'Loading...', 
    email: '...',
    phone: '...',
    location: '...',
    plan: '...'
  });

  // State to handle editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
     // Simulating fetching user data
     setTimeout(() => {
         const initialData = { 
             username: "Olawale Marcus", 
             email: "olawale@workspace.africa",
             phone: "+234 800 000 0000",
             location: "Lagos, Nigeria",
             plan: "FLEX_PRO"
         };
         setUser(initialData);
         setEditForm(initialData);
     }, 500);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/');
  };

  const handleEditToggle = () => {
    if (!isEditing) {
        // Reset form to current user data when entering edit mode
        setEditForm(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you would send an API request to save the data
    setUser(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`flex-1 py-3 flex items-center justify-center space-x-2 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-colors ${activeTab === id ? 'border-[var(--color-accent)] text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white'}`}
    >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const InfoRow = ({ label, name, value, icon: Icon, isEditable }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
        <div className="flex items-center text-slate-400 min-w-[120px]">
            {Icon && <Icon className="w-4 h-4 mr-3 text-slate-600" />}
            <span className="text-xs font-mono uppercase">{label}</span>
        </div>
        
        {isEditable ? (
             <input 
                name={name}
                value={editForm[name] || ''}
                onChange={handleInputChange}
                className="bg-[#050505] border border-slate-700 text-white px-3 py-1 text-sm font-mono text-right w-full max-w-[200px] focus:border-[var(--color-accent)] focus:outline-none"
             />
        ) : (
             <span className="text-sm text-white font-mono text-right">{value}</span>
        )}
    </div>
  );

  return (
    <AppLayout activePage="profile">
      <Head><title>My Profile | Workspace OS</title></Head>

      {/* --- ID Header --- */}
      <div className="flex items-center space-x-4 mb-8 bg-[#0a0f1c] border border-white/10 p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[var(--color-accent)]/10 to-transparent"></div>

         <div className="w-16 h-16 bg-[#050505] border border-slate-700 flex items-center justify-center text-2xl font-mono text-white rounded-full relative z-10">
            {user.username[0]}
         </div>
         <div className="relative z-10">
            <h1 className="text-xl font-bold text-white font-mono uppercase">{user.username}</h1>
            <div className="flex items-center mt-1 space-x-2">
                <span className="text-[9px] font-mono bg-[var(--color-accent)] text-white px-1.5 py-0.5">MEMBER</span>
                <span className="text-slate-500 font-mono text-xs">{user.plan}</span>
            </div>
         </div>
      </div>

      {/* --- Tabs --- */}
      <div className="flex mb-6 border-b border-white/10">
        <TabButton id="details" label="My Details" icon={User} />
        <TabButton id="membership" label="Membership" icon={CreditCard} />
        <TabButton id="settings" label="Settings" icon={Settings} />
      </div>

      {/* --- Tab Content --- */}
      <div className="bg-[#0a0f1c] border border-white/10 p-6 min-h-[400px]">
        
        {activeTab === 'details' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-bold">Personal Information</h2>
                    {isEditing && (
                        <span className="text-[10px] font-mono text-[var(--color-accent)] animate-pulse">EDITING_MODE_ACTIVE</span>
                    )}
                </div>
                
                <div className="space-y-1">
                    <InfoRow label="Full Name" name="username" value={user.username} icon={User} isEditable={isEditing} />
                    <InfoRow label="Email Address" name="email" value={user.email} icon={Mail} isEditable={isEditing} />
                    <InfoRow label="Phone Number" name="phone" value={user.phone} icon={Phone} isEditable={isEditing} />
                    <InfoRow label="Home Base" name="location" value={user.location} icon={MapPin} isEditable={isEditing} />
                </div>

                <div className="mt-8 flex space-x-3">
                    {!isEditing ? (
                        <button 
                            onClick={handleEditToggle}
                            className="text-[10px] font-mono text-[var(--color-accent)] hover:text-white uppercase tracking-widest border border-[var(--color-accent)] px-4 py-2 hover:bg-[var(--color-accent)] transition-all flex items-center"
                        >
                            <Edit2 className="w-3 h-3 mr-2" /> EDIT_PROFILE
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleSave}
                                className="text-[10px] font-mono text-white bg-[var(--color-accent)] uppercase tracking-widest border border-[var(--color-accent)] px-4 py-2 hover:bg-orange-600 transition-all flex items-center"
                            >
                                <Save className="w-3 h-3 mr-2" /> SAVE_CHANGES
                            </button>
                            <button 
                                onClick={handleEditToggle}
                                className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-widest border border-slate-600 px-4 py-2 hover:border-white transition-all flex items-center"
                            >
                                <X className="w-3 h-3 mr-2" /> CANCEL
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'membership' && (
            <div className="text-center py-8 animate-fade-in">
                <div className="inline-block p-4 border border-dashed border-slate-700 rounded-full mb-4">
                    <CreditCard className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-slate-500 font-mono text-xs uppercase mb-2">Active Plan</div>
                <div className="text-3xl font-bold text-white font-mono mb-2">FLEX_PRO</div>
                <div className="text-[var(--color-accent)] font-mono text-lg mb-8">₦45,000<span className="text-xs text-slate-500">/mo</span></div>
                
                <div className="max-w-xs mx-auto space-y-3 mb-8">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>RENEWAL DATE</span>
                        <span className="text-white">DEC 20, 2025</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>PAYMENT METHOD</span>
                        <span className="text-white">VISA •••• 4242</span>
                    </div>
                </div>

                <button className="w-full max-w-xs py-3 bg-white text-black font-mono text-xs font-bold hover:bg-slate-200 transition-colors uppercase">
                    Manage Subscription
                </button>
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#050505] border border-white/5">
                        <div>
                            <div className="text-white text-sm font-bold">Notifications</div>
                            <div className="text-slate-500 text-xs">Receive email updates</div>
                        </div>
                        <div className="w-10 h-5 bg-[var(--color-accent)] rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#050505] border border-white/5">
                        <div>
                            <div className="text-white text-sm font-bold">Dark Mode</div>
                            <div className="text-slate-500 text-xs">Always active</div>
                        </div>
                        <div className="text-xs font-mono text-slate-600 uppercase">LOCKED</div>
                    </div>
                 </div>

                 <button onClick={handleLogout} className="w-full flex items-center justify-center p-4 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-colors mt-8">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase font-bold">Log Out</span>
                 </button>
            </div>
        )}

      </div>
    </AppLayout>
  );
}
