import React, { useState } from 'react';
import { ShieldCheck, User, Compass, Sparkles, Award, Map, RefreshCw, MessageSquare, ShieldAlert, X, Moon, Sun, GraduationCap, Users, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserBadge, UserQuest, UserProfile } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userXp: number;
  userLevel: number;
  badges: UserBadge[];
  quests: UserQuest[];
  onSpinSuccess: (xpEarned: number) => void;
  currentUser: UserProfile;
  onSwitchProfile: (profile: UserProfile) => void;
  allProfiles: UserProfile[];
  onAddNewProfile: (profile: UserProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  userXp,
  userLevel,
  badges,
  quests,
  onSpinSuccess,
  currentUser,
  onSwitchProfile,
  allProfiles,
  onAddNewProfile,
  isDarkMode,
  onToggleDarkMode
}: NavigationProps) {
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Profile Login & Account switcher states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState<'preset' | 'create'>('preset');

  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState<number>(25);
  const [customRole, setCustomRole] = useState<'tenant' | 'landlord' | 'admin'>('tenant');
  const [customPhone, setCustomPhone] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customNationalId, setCustomNationalId] = useState('');
  const [isKycScanning, setIsKycScanning] = useState(false);
  const [kycProgress, setKycProgress] = useState(0);
  const [kycSuccess, setKycSuccess] = useState(false);

  const handleScanKyc = () => {
    if (!customNationalId) return;
    setIsKycScanning(true);
    setKycProgress(0);
    setKycSuccess(false);
    
    const interval = setInterval(() => {
      setKycProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsKycScanning(false);
          setKycSuccess(true);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customPhone || !customEmail) return;

    const newProfile: UserProfile = {
      name: customName,
      age: customAge,
      role: customRole,
      phone: customPhone,
      email: customEmail,
      isKycVerified: kycSuccess,
      avatar: customRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : customRole === 'landlord'
        ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      nationalId: customNationalId || undefined
    };

    onAddNewProfile(newProfile);
    onSwitchProfile(newProfile);
    setShowProfileModal(false);
    
    // reset form
    setCustomName('');
    setCustomAge(25);
    setCustomPhone('');
    setCustomEmail('');
    setCustomNationalId('');
    setKycSuccess(false);
  };

  const levelName = userLevel >= 4 ? 'Elite Landlord' : userLevel >= 3 ? 'Star Tenant' : userLevel >= 2 ? 'Verified Explorer' : 'Estate Rookie';
  const xpNeeded = userLevel * 200;
  const progressPercent = Math.min(100, Math.floor((userXp / xpNeeded) * 100));

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);
    setTimeout(() => {
      const rewards = [50, 100, 150, 200];
      const selectedXp = rewards[Math.floor(Math.random() * rewards.length)];
      onSpinSuccess(selectedXp);
      setSpinResult(`Success! You received +${selectedXp} Experience points!`);
      setSpinning(false);
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('listings')}>
            <div className="bg-emerald-600 text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold font-display tracking-tight text-slate-900 flex items-center gap-1.5">
                MAKAO YETU <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold">Africa's #1</span>
              </span>
              <p className="text-[9px] text-emerald-600 tracking-wider font-semibold uppercase">The Premium Property Ecosystem</p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden xl:flex space-x-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            {[
              { id: 'listings', label: 'Explore Properties', icon: Compass },
              { id: 'reels', label: 'Property Walkthroughs', icon: Sparkles },
              { id: 'campus', label: 'September Intake Hub', icon: GraduationCap, badge: 'Student' },
              { id: 'futurelabs', label: 'Makao FutureLabs™', icon: Cpu, badge: 'LIVE' },
              { id: 'map', label: 'Interactive Map', icon: Map },
              { id: 'ai', label: 'Property Advisor', icon: Sparkles },
              { id: 'safety', label: 'Trust & Safety', icon: ShieldCheck },
              { id: 'chat', label: 'Secured Chats', icon: MessageSquare },
              ...(currentUser.role === 'admin' ? [{ id: 'admin', label: 'Admin Console', icon: Users, isHighlighted: true }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? tab.isHighlighted 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md'
                        : tab.badge === 'Student'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                        : 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute -top-2 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full uppercase tracking-wider scale-90 animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Profile & XP Status */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleDarkMode}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Toggle Cyberpunk Dark Mode / Claymorphic Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </motion.button>

            {/* Spin Wheel Shortcut */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowSpinModal(true)}
              className="relative p-2 bg-amber-500/10 text-amber-700 border border-amber-500/30 rounded-xl flex items-center gap-1.5 text-xs hover:bg-amber-500/20 font-semibold"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow text-amber-600" />
              <span className="hidden lg:inline">Loyalty Wheel</span>
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] px-1.5 rounded-full font-bold shadow-sm">SPIN</span>
            </motion.button>

            {/* Profile Level Widget with Switcher */}
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              title="Switch user logins, age, or admin accounts"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className={`w-8 h-8 rounded-lg object-cover border ${
                  currentUser.role === 'admin' ? 'border-amber-400 shadow-sm animate-pulse' :
                  currentUser.role === 'landlord' ? 'border-emerald-500' : 'border-slate-300'
                }`}
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-950 flex items-center gap-1">
                  {currentUser.name}
                  <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded-full font-bold ${
                    currentUser.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    currentUser.role === 'landlord' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-sans font-semibold">
                  Lvl {userLevel} • {currentUser.age} Yrs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="xl:hidden flex overflow-x-auto py-2 border-t border-slate-200/80 scrollbar-none gap-1.5 bg-slate-50">
          {[
            { id: 'listings', label: 'Properties', icon: Compass },
            { id: 'reels', label: 'Walkthroughs', icon: Sparkles },
            { id: 'campus', label: 'Campus Hub', icon: GraduationCap },
            { id: 'futurelabs', label: 'FutureLabs', icon: Cpu },
            { id: 'map', label: 'Map', icon: Map },
            { id: 'ai', label: 'Advisor', icon: Sparkles },
            { id: 'safety', label: 'Trust Board', icon: ShieldCheck },
            { id: 'chat', label: 'Chats', icon: MessageSquare },
            ...(currentUser.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: Users }] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Spin Modal */}
      <AnimatePresence>
        {showSpinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Decorative light beam */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"></div>

              <h3 className="text-lg font-bold mb-1 text-slate-900">Makao Yetu Loyalty Wheel</h3>
              <p className="text-xs text-slate-500 mb-6">Spin daily to unlock free experience boosts and raise your profile score!</p>

              <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
                <motion.div
                  animate={spinning ? { rotate: 1800 } : { rotate: 0 }}
                  transition={spinning ? { duration: 2.2, ease: "easeOut" } : { duration: 0.2 }}
                  className="w-full h-full rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner"
                >
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
                    <div className="border-r border-b border-slate-700"></div>
                    <div className="border-l border-b border-slate-700"></div>
                    <div className="border-r border-t border-slate-700"></div>
                    <div className="border-l border-t border-slate-700"></div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Compass className={`w-14 h-14 ${spinning ? 'animate-spin' : 'text-emerald-600'}`} />
                    <span className="text-[9px] text-slate-400 font-bold mt-2">LOYALTY POINT</span>
                  </div>
                </motion.div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-6 bg-rose-500 clip-triangle shadow-md"></div>
              </div>

              {spinResult && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-100 text-emerald-800 py-2.5 px-4 rounded-xl text-xs font-semibold mb-6"
                >
                  {spinResult}
                </motion.div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg transition-colors disabled:opacity-50 text-xs"
                >
                  {spinning ? 'Spinning...' : 'Spin Wheel'}
                </button>
                <button
                  onClick={() => {
                    setShowSpinModal(false);
                    setSpinResult(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-6 rounded-xl font-bold transition-colors text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Login & Role Switcher Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 text-slate-800 shadow-2xl relative overflow-hidden my-8 text-left"
            >
              {/* Top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Makao Yetu Security Registry</h3>
                  <p className="text-[11px] text-slate-500">Log in as a specific role or configure your age & credential preferences.</p>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-slate-100 pb-2.5 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setProfileTab('preset')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    profileTab === 'preset'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Verified Preset Logins
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('create')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    profileTab === 'create'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register Custom Profile
                </button>
              </div>

              {profileTab === 'preset' ? (
                <div className="space-y-3.5 text-xs">
                  <p className="text-xs text-slate-600 font-medium">Select a simulated identity to experience the platform from different perspectives:</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {allProfiles.map((prof) => {
                      const isCurrent = currentUser.name === prof.name && currentUser.role === prof.role;
                      return (
                        <div
                          key={prof.name + prof.role}
                          onClick={() => {
                            onSwitchProfile(prof);
                            setShowProfileModal(false);
                          }}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={prof.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-300" alt={prof.name} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900">{prof.name}</h4>
                                <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded-full font-bold ${
                                  prof.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                                  prof.role === 'landlord' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-slate-200 text-slate-700'
                                }`}>
                                  {prof.role}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                                Age: <span className="font-bold text-slate-700">{prof.age} Yrs</span> • {prof.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {prof.isKycVerified ? (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> KYC OK
                              </span>
                            ) : (
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">Unverified</span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-700 font-bold">● Active</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateProfileSubmit} className="space-y-4 text-xs text-left">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Kelvin Kiptum"
                        className="w-full clay-input py-2.5 px-3 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Age</label>
                      <input
                        type="number"
                        value={customAge}
                        onChange={(e) => setCustomAge(parseInt(e.target.value, 10))}
                        min="1"
                        max="120"
                        className="w-full clay-input py-2.5 px-3 focus:outline-none font-bold"
                        required
                      />
                    </div>
                  </div>

                  {customAge < 18 && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl leading-relaxed text-[11px] font-semibold">
                      ⚠️ Age Verification Warning: Kenyan law requires tenancy contracts to be signed by legal adults (18+). You can browse properties but security deposits are restricted.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Ecosystem Role</label>
                      <select
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value as any)}
                        className="w-full clay-input py-2.5 px-3 focus:outline-none font-bold"
                      >
                        <option value="tenant">Tenant (Looking for House)</option>
                        <option value="landlord">Landlord / Verified Agent</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Kenyan National ID Number</label>
                      <input
                        type="text"
                        value={customNationalId}
                        onChange={(e) => setCustomNationalId(e.target.value)}
                        placeholder="e.g. 38445512"
                        className="w-full clay-input py-2.5 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  {customNationalId && (
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700">Digital KYC ID Verification Scan</span>
                        {kycSuccess ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">✓ Verified Legal Identity</span>
                        ) : (
                          <span className="text-slate-400 font-semibold">Pending Verification Scan</span>
                        )}
                      </div>
                      
                      {isKycScanning ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                            <span>SCANNING CHIP AT ARDHISASA SYSTEM...</span>
                            <span>{kycProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${kycProgress}%` }}></div>
                          </div>
                        </div>
                      ) : kycSuccess ? (
                        <p className="text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Integrated National ID Lookup Complete. Name, Age, and Status certified!
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleScanKyc}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Start M-Pesa Integrated KYC Check
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="e.g. +254 712 999000"
                        className="w-full clay-input py-2.5 px-3 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="e.g. kelvin@gmail.com"
                        className="w-full clay-input py-2.5 px-3 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold cursor-pointer shadow-md shadow-emerald-600/15 transition-all"
                    >
                      Authenticate and Register
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
