import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Heart, ThumbsUp, PlusCircle, Search, Sparkles, Filter, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityReport } from '../types';

interface CommunityWatchProps {
  reports: CommunityReport[];
  onUpvoteReport: (reportId: string) => void;
  onAddReport: (newReport: Omit<CommunityReport, 'id' | 'date' | 'upvotes'>) => void;
  currentUserRole?: string;
  onResolveReport?: (reportId: string, status: 'Investigating' | 'Verified Scam' | 'Resolved' | 'Active') => void;
  onDeleteReport?: (reportId: string) => void;
}

export default function CommunityWatch({ 
  reports, 
  onUpvoteReport, 
  onAddReport,
  currentUserRole,
  onResolveReport,
  onDeleteReport
}: CommunityWatchProps) {
  const [filterType, setFilterType] = useState<'All' | 'Water' | 'Power' | 'Scam'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New report form states
  const [reportType, setReportType] = useState<'Water' | 'Power' | 'Scam' | 'General'>('Water');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Scam Database lookup state
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<{ status: 'clean' | 'flagged' | 'unverified', message: string } | null>(null);

  // Community Rent Audit state
  const [votes, setVotes] = useState({ overpriced: 145, fair: 82, cheap: 12 });
  const [userVoted, setUserVoted] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = lookupPhone.replace(/[\s-]/g, '');
    if (!cleanNum) return;

    // Checks
    if (cleanNum.includes('918') || cleanNum.includes('0722000') || cleanNum.includes('0722123')) {
      setLookupResult({
        status: 'flagged',
        message: '⚠️ WARNING: This number has been flagged 8 times for demanding fake Ksh 1,500 viewing fees via M-Pesa in Roysambu and Zimmerman. DO NOT SEND FUNDS.'
      });
    } else if (cleanNum.length >= 10) {
      setLookupResult({
        status: 'clean',
        message: '✓ Verified Representative Line: Registered with clear track record. Safe to transact.'
      });
    } else {
      setLookupResult({
        status: 'unverified',
        message: 'ℹ️ Unverified Line: No scam histories reported, but ensure you never pay viewing fees until you physically inspect the property.'
      });
    }
  };

  const handleVote = (option: 'overpriced' | 'fair' | 'cheap') => {
    if (userVoted) return;
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setUserVoted(option);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !title || !description) return;
    onAddReport({
      type: reportType,
      location,
      title,
      description,
      status: 'Active',
      reportedBy: 'User_Xp'
    });
    setShowAddModal(false);
    // Reset form
    setLocation('');
    setTitle('');
    setDescription('');
  };

  const filteredReports = reports.filter(r => filterType === 'All' || r.type === filterType);

  const totalVotes = votes.overpriced + votes.fair + votes.cheap;
  const overpricedPct = Math.round((votes.overpriced / totalVotes) * 100);
  const fairPct = Math.round((votes.fair / totalVotes) * 100);
  const cheapPct = Math.round((votes.cheap / totalVotes) * 100);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      {/* Intro Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-950 flex items-center justify-center gap-2 font-display">
          <ShieldCheck className="text-emerald-600 w-6 h-6 animate-pulse" /> Community Trust & Safety Board
        </h2>
        <p className="text-sm text-slate-600">
          The ultimate protective dashboard for real estate transparency in Kenya. Report alerts, verify contacts, and audit local rent rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Scam Registry & Community Audits (Columns 1-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Scam Phone Database */}
          <div className="clay-card p-6 text-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="text-rose-600 w-4 h-4" /> Representative Verification
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter an representative's phone number to check registration records or identify flagged fraud reports.
            </p>

            <form onSubmit={handleLookup} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="e.g. 0722 XXX 918"
                  className="w-full clay-input py-2.5 pl-9 pr-3 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full clay-btn bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs cursor-pointer border border-slate-200"
              >
                Verify Phone Record
              </button>
            </form>

            {lookupResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed font-semibold ${
                  lookupResult.status === 'flagged' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                  lookupResult.status === 'clean' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                  'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {lookupResult.message}
              </motion.div>
            )}
          </div>

          {/* Community Rent Audit */}
          <div className="clay-card p-6 text-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="text-amber-500 w-4 h-4" /> Rent Pricing Audit
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Current Poll: **"Is Ksh 15,000 rent for a 1-bedroom in Roysambu fair?"**
            </p>

            <div className="space-y-3.5 text-xs">
              {/* Option Overpriced */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Overpriced / Exploded</span>
                  <span className="text-slate-500">{overpricedPct}% ({votes.overpriced})</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${overpricedPct}%` }}></div>
                </div>
              </div>

              {/* Option Fair */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Fair Market Rate</span>
                  <span className="text-slate-500">{fairPct}% ({votes.fair})</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${fairPct}%` }}></div>
                </div>
              </div>

              {/* Option Cheap */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Extremely Cheap</span>
                  <span className="text-slate-500">{cheapPct}% ({votes.cheap})</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${cheapPct}%` }}></div>
                </div>
              </div>

              {!userVoted ? (
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <button onClick={() => handleVote('overpriced')} className="bg-white hover:bg-slate-50 text-[10px] py-1.5 font-bold rounded-lg border border-slate-200 shadow-sm cursor-pointer">
                    Overpriced
                  </button>
                  <button onClick={() => handleVote('fair')} className="bg-white hover:bg-slate-50 text-[10px] py-1.5 font-bold rounded-lg border border-slate-200 shadow-sm cursor-pointer">
                    Fair
                  </button>
                  <button onClick={() => handleVote('cheap')} className="bg-white hover:bg-slate-50 text-[10px] py-1.5 font-bold rounded-lg border border-slate-200 shadow-sm cursor-pointer">
                    Cheap
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-center text-emerald-700 font-bold pt-2">
                  ✓ Your community audit vote has been registered!
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Live Warning Feed & Reports (Columns 5-12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-800 flex-1 shadow-lg">
            
            {/* Header controls inside report tab */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3.5 mb-4">
              
              {/* Type select */}
              <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                {(['All', 'Water', 'Power', 'Scam'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterType === type 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-end cursor-pointer shadow-md shadow-rose-600/10"
              >
                <PlusCircle className="w-4 h-4" /> Report New Alert
              </button>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl relative overflow-hidden shadow-sm">
                  
                  {/* Visual Status Tag left block */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    report.type === 'Scam' ? 'bg-rose-500' :
                    report.type === 'Water' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></div>

                  <div className="flex justify-between items-start gap-4 pl-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          report.type === 'Scam' ? 'bg-rose-100 text-rose-800' :
                          report.type === 'Water' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {report.type} ALERT
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{report.date}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-lg">
                          @{report.location}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2.5 mb-1">{report.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3.5">{report.description}</p>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <span>Reported by: <span className="text-slate-600">@{report.reportedBy}</span></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Status: 
                          <span className={`font-bold ${
                            report.status === 'Verified Scam' ? 'text-rose-600' :
                            report.status === 'Active' ? 'text-blue-600' : 'text-slate-500'
                          }`}>
                            {report.status}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Upvote button */}
                    <button
                      onClick={() => onUpvoteReport(report.id)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 hover:border-emerald-300 p-2 rounded-xl flex flex-col items-center min-w-12 text-slate-500 hover:text-emerald-700 transition-all self-center shadow-sm cursor-pointer"
                    >
                      <ThumbsUp className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold mt-1">{report.upvotes}</span>
                    </button>
                  </div>

                  {/* Admin actions block */}
                  {currentUserRole === 'admin' && (
                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Ecosystem Control:</span>
                      <button
                        onClick={() => onResolveReport?.(report.id, 'Verified Scam')}
                        className="bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        ⚠️ Flag Verified Scam
                      </button>
                      <button
                        onClick={() => onResolveReport?.(report.id, 'Resolved')}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        ✓ Mark Resolved
                      </button>
                      <button
                        onClick={() => onResolveReport?.(report.id, 'Investigating')}
                        className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        ⚡ Investigate
                      </button>
                      <button
                        onClick={() => onDeleteReport?.(report.id)}
                        className="ml-auto bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border border-slate-200 transition-colors"
                      >
                        Delete Alert
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Add Alert Modal Form */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full text-slate-800 shadow-2xl"
            >
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Publish Safety/Utility Alert</h3>
              <p className="text-xs text-slate-500 mb-4">
                Share water outages, electrical blackouts, or flagged scammers to notify your community in real-time.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Alert Category</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full clay-input py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-semibold"
                  >
                    <option value="Water">Water Outage / Rationing</option>
                    <option value="Power">Electrical / Power Cut</option>
                    <option value="Scam">Scam / Unverified Agent Alert</option>
                    <option value="General">General Neighborhood Safety</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Estate Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Roysambu Area 2 / Syokimau"
                    className="w-full clay-input py-2.5 px-3.5 text-xs focus:outline-none text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Alert Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken water pipe leaking near bypass"
                    className="w-full clay-input py-2.5 px-3.5 text-xs focus:outline-none text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Detailed Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details, affected roads, or phone numbers involved..."
                    className="w-full clay-input p-3 text-xs focus:outline-none h-24 resize-none text-slate-800"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Publish Alert
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
