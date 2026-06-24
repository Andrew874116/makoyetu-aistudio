import React, { useState } from 'react';
import { ShieldCheck, User, Compass, Sparkles, Award, Map, RefreshCw, MessageSquare, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserBadge, UserQuest } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userXp: number;
  userLevel: number;
  badges: UserBadge[];
  quests: UserQuest[];
  onSpinSuccess: (xpEarned: number) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  userXp,
  userLevel,
  badges,
  quests,
  onSpinSuccess
}: NavigationProps) {
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const levelName = userLevel >= 4 ? 'Penthouse Legend' : userLevel >= 3 ? 'Duplex Master' : userLevel >= 2 ? 'Apartment Ranger' : 'Bedsitter Rookie';
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
      setSpinResult(`Jackpot! You won +${selectedXp} XP!`);
      setSpinning(false);
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('listings')}>
            <div className="bg-emerald-600 text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5">
                MAKAO YETU <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded font-mono font-normal">AI V1.0</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase font-mono">Kenyan Property OS</p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'listings', label: 'Explore Homes', icon: Compass },
              { id: 'reels', label: 'Video Reels', icon: Sparkles },
              { id: 'map', label: 'Interactive Map', icon: Map },
              { id: 'ai', label: 'AI Advisory Hub', icon: Sparkles },
              { id: 'safety', label: 'Trust & Safety', icon: ShieldCheck },
              { id: 'chat', label: 'Chats', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Profile & XP Status */}
          <div className="flex items-center space-x-4">
            {/* Spin Wheel Shortcut */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSpinModal(true)}
              className="relative p-2 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 text-xs hover:bg-emerald-900/40"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow text-emerald-400" />
              <span className="hidden lg:inline font-medium">Daily Spin</span>
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] px-1.5 rounded-full font-bold">SPIN</span>
            </motion.button>

            {/* Profile Level Widget */}
            <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-white">{levelName}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Lvl {userLevel} • {userXp}/{xpNeeded} XP
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow shadow-emerald-500/20">
                  {userLevel}
                </div>
                {/* Micro progress ring overlay */}
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none gap-1 bg-slate-900">
          {[
            { id: 'listings', label: 'Explore', icon: Compass },
            { id: 'reels', label: 'Reels', icon: Sparkles },
            { id: 'map', label: 'Map', icon: Map },
            { id: 'ai', label: 'AI Advisors', icon: Sparkles },
            { id: 'safety', label: 'Safety', icon: ShieldCheck },
            { id: 'chat', label: 'Chats', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Decorative light beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>

              <h3 className="text-xl font-bold mb-1 text-white">🎰 Makao Yetu Daily Spin</h3>
              <p className="text-xs text-slate-400 mb-6">Spin the wheel once a day to unlock free XP and level up your reputation passport!</p>

              <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <motion.div
                  animate={spinning ? { rotate: 1800 } : { rotate: 0 }}
                  transition={spinning ? { duration: 2.2, ease: "easeOut" } : { duration: 0.2 }}
                  className="w-full h-full rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden shadow-xl shadow-emerald-950/30"
                >
                  {/* Wheel lines & values */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none">
                    <div className="border-r border-b border-slate-700"></div>
                    <div className="border-l border-b border-slate-700"></div>
                    <div className="border-r border-t border-slate-700"></div>
                    <div className="border-l border-t border-slate-700"></div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Compass className={`w-16 h-16 ${spinning ? 'animate-spin' : 'text-emerald-500'}`} />
                    <span className="text-[10px] text-slate-500 font-mono mt-2">MULTIPLIER</span>
                  </div>
                </motion.div>
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-6 bg-red-500 clip-triangle shadow-lg"></div>
              </div>

              {spinResult && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 py-2.5 px-4 rounded-xl text-sm font-mono font-semibold mb-6"
                >
                  {spinResult}
                </motion.div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="bg-emerald-600 text-white font-semibold py-2.5 px-8 rounded-xl shadow-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  {spinning ? 'Spinning...' : 'Spin Wheel'}
                </button>
                <button
                  onClick={() => {
                    setShowSpinModal(false);
                    setSpinResult(null);
                  }}
                  className="bg-slate-800 text-slate-300 hover:text-white py-2.5 px-6 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
