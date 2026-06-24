import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Users, LayoutList, Building, BadgePercent, Lock, Settings, RefreshCw, Star, Trash, CheckCircle, Ban, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Property, CommunityReport, UserProfile } from '../types';

interface AdminConsoleProps {
  properties: Property[];
  onToggleVerifyProperty: (id: string) => void;
  onToggleFeaturedProperty: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  reports: CommunityReport[];
  onResolveReport: (id: string, status: 'Investigating' | 'Verified Scam' | 'Resolved' | 'Active') => void;
  onDeleteReport: (id: string) => void;
  allProfiles: UserProfile[];
  onToggleBanUser: (name: string) => void;
  onToggleVerifyUser: (name: string) => void;
}

export default function AdminConsole({
  properties,
  onToggleVerifyProperty,
  onToggleFeaturedProperty,
  onDeleteProperty,
  reports,
  onResolveReport,
  onDeleteReport,
  allProfiles,
  onToggleBanUser,
  onToggleVerifyUser
}: AdminConsoleProps) {
  const [adminTab, setAdminTab] = useState<'users' | 'properties' | 'safety' | 'telemetry'>('telemetry');

  // Simulated Admin Telemetry stats
  const totalEscrowLocked = properties.reduce((acc, current) => {
    return acc + (current.price * 2); // simulate deposit pool (2 months)
  }, 350000);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Top Banner Control Tower */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-rose-500/15">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_top_right,rgba(244,63,94,0.15),transparent_60%) pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-500/30 flex items-center gap-1 w-max">
              🛡️ SYSTEM CONTROL TOWER (ADMIN ONLY)
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight font-display mt-2.5">
              Ecosystem Control & Traffic Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Audit the verified property ledger, manage student roommate matchmaking cycles, toggle estate agent credentials, and investigate reported scam activities.
            </p>
          </div>
          <div className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-4 py-2.5 rounded-2xl text-xs font-mono">
            <span>Server status: </span>
            <span className="font-bold text-emerald-400">ONLINE (100% SECURE)</span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
        {[
          { id: 'telemetry', label: 'Ecosystem Telemetry', icon: TrendingUp },
          { id: 'users', label: 'All Users & Agents', icon: Users },
          { id: 'properties', label: 'Property Ledger Moderation', icon: Building },
          { id: 'safety', label: 'Scam Protection Incidents', icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        
        {/* PANEL A: TELEMETRY AND METRICS OVERVIEW */}
        {adminTab === 'telemetry' && (
          <motion.div
            key="telemetry"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {/* Stat 1 */}
            <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Safe Escrow Locked</span>
                <h3 className="text-xl md:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  KES {totalEscrowLocked.toLocaleString()}
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 font-semibold">
                Simulated deposit holding pool in active contracts.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Registered Students (September intake)</span>
                <h3 className="text-xl md:text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                  2,840 Students
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 font-semibold">
                Actively searching roommates or hostels.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Listed Properties</span>
                <h3 className="text-xl md:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  {properties.length} Active
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 font-semibold">
                {properties.filter(p => p.isVerified).length} currently verified.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Flagged Incidents Handled</span>
                <h3 className="text-xl md:text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                  {reports.length} Incidents
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 font-semibold">
                Active community protection reports.
              </p>
            </div>

            {/* Real-time server stream activity logs */}
            <div className="md:col-span-4 clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">Live Integration Logs Feed</h3>
              <div className="bg-slate-950 text-green-400 font-mono text-xs p-4 rounded-2xl h-44 overflow-y-auto space-y-1.5 leading-relaxed">
                <p>[{new Date().toLocaleTimeString()}] INF: Initialized Makao Security Escrow Module...</p>
                <p>[{new Date().toLocaleTimeString()}] OK: Synchronized Kenya National Land Information Management System (Ardhisasa)...</p>
                <p>[{new Date().toLocaleTimeString()}] INF: Automated roommate matching quiz solver optimized for September intake...</p>
                <p>[{new Date().toLocaleTimeString()}] OK: Decrypted verified property ledger. Total properties: {properties.length}.</p>
                <p>[{new Date().toLocaleTimeString()}] WARN: Scanned community reports. Flagged alerts: {reports.filter(r => r.status === 'Active').length} active.</p>
                <p>[{new Date().toLocaleTimeString()}] SUCCESS: Ready for 50,000 concurrent student intake requests!</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL B: USERS AND AGENTS DIRECTORY */}
        {adminTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">Active Users & Ecosystem Agents Ledger</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Suspend accounts, verify agent business cards, or toggle Kyc credentials.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Profile</th>
                    <th className="py-3 px-4">Ecosystem Role</th>
                    <th className="py-3 px-4">Age Preferences</th>
                    <th className="py-3 px-4">National KYC ID</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Moderator Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allProfiles.map(profile => {
                    const isBanned = profile.age === 999; // custom ban flag indicator
                    return (
                      <tr key={profile.name + profile.role} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-3.5 px-4 flex items-center gap-2.5">
                          <img src={profile.avatar} className="w-8 h-8 rounded-lg object-cover" alt={profile.name} />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{profile.name}</span>
                            <span className="text-[10px] text-slate-400 block">{profile.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            profile.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' :
                            profile.role === 'landlord' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {profile.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">{profile.age} Yrs</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                          {profile.nationalId || 'Not Linked'}
                        </td>
                        <td className="py-3.5 px-4">
                          {profile.isKycVerified ? (
                            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              ✓ Verified KYC
                            </span>
                          ) : (
                            <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => onToggleVerifyUser(profile.name)}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
                          >
                            Toggle Verification
                          </button>
                          <button
                            onClick={() => onToggleBanUser(profile.name)}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
                          >
                            Suspend/Activate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PANEL C: PROPERTY LEDGER MODERATION */}
        {adminTab === 'properties' && (
          <motion.div
            key="properties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">Active Verified Property Catalog</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Add HOT DEAL tags, verify security escrow protocols, or delete unvouched properties.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map(prop => (
                <div 
                  key={prop.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={prop.image} className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt={prop.title} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-950 dark:text-white leading-tight">{prop.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">KES {prop.price.toLocaleString()}/mo • {prop.location}</p>
                      
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {prop.isVerified ? (
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold px-1.5 rounded">Verified Security</span>
                        ) : (
                          <span className="text-[8px] bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-bold px-1.5 rounded">Unverified</span>
                        )}
                        {prop.featured && (
                          <span className="text-[8px] bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 font-bold px-1.5 rounded">🔥 HOT DEAL</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 text-[10px] font-bold">
                    <button
                      onClick={() => onToggleVerifyProperty(prop.id)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Verify Check
                    </button>
                    <button
                      onClick={() => onToggleFeaturedProperty(prop.id)}
                      className="text-rose-500 dark:text-pink-400 hover:underline cursor-pointer"
                    >
                      Toggle HOT
                    </button>
                    <button
                      onClick={() => onDeleteProperty(prop.id)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PANEL D: SCAM AND SAFETY PROTECTION */}
        {adminTab === 'safety' && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800"
          >
            <div className="mb-5">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">Community Scam Warn Board Administration</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Resolve, investigate, or delete user warning alerts directly from the security control console.</p>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              {reports.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500">No active incidents reported by the community!</p>
                </div>
              ) : (
                reports.map(report => (
                  <div 
                    key={report.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 px-2 py-0.5 rounded-full text-[8px] uppercase font-black">
                          ⚠️ {report.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-950 dark:text-white">{report.title}</h4>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                          report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          report.status === 'Verified Scam' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 font-sans leading-relaxed">
                        {report.description}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">Location: {report.location} • Upvotes: {report.upvotes}</p>
                    </div>

                    <div className="flex md:flex-col items-end gap-2 border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Update Status:</span>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => onResolveReport(report.id, 'Verified Scam')}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          Scam OK
                        </button>
                        <button
                          onClick={() => onResolveReport(report.id, 'Resolved')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => onDeleteReport(report.id)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
