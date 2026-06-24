import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Heart, ThumbsUp, PlusCircle, Search, Sparkles, Filter, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityReport } from '../types';

interface CommunityWatchProps {
  reports: CommunityReport[];
  onUpvoteReport: (reportId: string) => void;
  onAddReport: (newReport: Omit<CommunityReport, 'id' | 'date' | 'upvotes'>) => void;
}

export default function CommunityWatch({ reports, onUpvoteReport, onAddReport }: CommunityWatchProps) {
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

    // Simulated check
    if (cleanNum.includes('918') || cleanNum.includes('0722000') || cleanNum.includes('0722123')) {
      setLookupResult({
        status: 'flagged',
        message: '⚠️ WARNING: This number has been flagged 8 times for demanding fake Ksh 1,500 viewing fees via M-Pesa in Roysambu and Zimmerman. DO NOT SEND FUNDS.'
      });
    } else if (cleanNum.length >= 10) {
      setLookupResult({
        status: 'clean',
        message: '✓ Verified Agent Line: Registered to "Andrew Muthengi (Makao Verified Agent)". Clear track record.'
      });
    } else {
      setLookupResult({
        status: 'unverified',
        message: 'ℹ️ Unverified Line: No scam histories reported, but ensure you never pay viewing fees until you physically inspect the home.'
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
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <ShieldCheck className="text-emerald-500 w-6 h-6 animate-pulse" /> Community Trust & Safety Board
        </h2>
        <p className="text-sm text-slate-400">
          The ultimate defensive wall against real estate scams in Kenya. Report fraudsters, check KPLC transformer statuses, and audit neighborhood utility averages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Scam Registry & Community Audits (Columns 1-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Scam Phone Database */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="text-red-500 w-4 h-4" /> Scam Number Lookup
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter an agent's M-Pesa phone number to verify their track record or view scam reports immediately.
            </p>

            <form onSubmit={handleLookup} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="e.g. 0722 XXX 918"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold py-1.5 rounded-xl text-xs"
              >
                Query Trust DB
              </button>
            </form>

            {lookupResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-xl border text-xs ${
                  lookupResult.status === 'flagged' ? 'bg-red-950/30 border-red-500/30 text-red-300' :
                  lookupResult.status === 'clean' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' :
                  'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {lookupResult.message}
              </motion.div>
            )}
          </div>

          {/* Community Rent Audit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="text-amber-400 w-4 h-4" /> Rent Pricing Audit
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current Poll: **"Is Ksh 15,000 rent for a 1-bedroom in Roysambu fair?"**
            </p>

            <div className="space-y-3 text-xs">
              {/* Option Overpriced */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Overpriced / Exploded</span>
                  <span className="font-mono text-slate-400">{overpricedPct}% ({votes.overpriced})</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${overpricedPct}%` }}></div>
                </div>
              </div>

              {/* Option Fair */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Fair Market Rate</span>
                  <span className="font-mono text-slate-400">{fairPct}% ({votes.fair})</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${fairPct}%` }}></div>
                </div>
              </div>

              {/* Option Cheap */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Extremely Cheap</span>
                  <span className="font-mono text-slate-400">{cheapPct}% ({votes.cheap})</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${cheapPct}%` }}></div>
                </div>
              </div>

              {!userVoted ? (
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <button onClick={() => handleVote('overpriced')} className="bg-slate-950 hover:bg-slate-800 text-[10px] py-1 rounded border border-slate-800">
                    Overpriced
                  </button>
                  <button onClick={() => handleVote('fair')} className="bg-slate-950 hover:bg-slate-800 text-[10px] py-1 rounded border border-slate-800">
                    Fair
                  </button>
                  <button onClick={() => handleVote('cheap')} className="bg-slate-950 hover:bg-slate-800 text-[10px] py-1 rounded border border-slate-800">
                    Cheap
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-center text-emerald-400 font-mono font-medium pt-2">
                  ✓ Your community audit vote has been registered!
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Live Warning Feed & Reports (Columns 5-12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex-1 shadow-xl">
            
            {/* Header controls inside report tab */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3.5 mb-4">
              
              {/* Type select */}
              <div className="flex space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
                {(['All', 'Water', 'Power', 'Scam'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterType === type 
                        ? 'bg-slate-800 text-white font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-end"
              >
                <PlusCircle className="w-4 h-4" /> Report New Alert
              </button>
            </div>

            {/* Reports List */}
            <div className="space-y-3.5">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-slate-950 border border-slate-850 p-4.5 rounded-2xl relative overflow-hidden">
                  
                  {/* Visual Status Tag left block */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    report.type === 'Scam' ? 'bg-red-500' :
                    report.type === 'Water' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></div>

                  <div className="flex justify-between items-start gap-4 pl-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          report.type === 'Scam' ? 'bg-red-500/15 text-red-400' :
                          report.type === 'Water' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {report.type} ALERT
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{report.date}</span>
                        <span className="text-[10px] bg-slate-850 text-slate-300 font-mono px-2 py-0.5 rounded">
                          @{report.location}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-1.5 mb-1">{report.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{report.description}</p>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>Reported by: <span className="text-slate-400 font-medium">@{report.reportedBy}</span></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Status: 
                          <span className={`font-semibold ${
                            report.status === 'Verified Scam' ? 'text-red-400' :
                            report.status === 'Active' ? 'text-blue-400' : 'text-slate-400'
                          }`}>
                            {report.status}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Upvote button */}
                    <button
                      onClick={() => onUpvoteReport(report.id)}
                      className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-2 rounded-xl flex flex-col items-center min-w-12 text-slate-300 hover:text-emerald-400 transition-all self-center"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold mt-1">{report.upvotes}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Add Alert Modal Form */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-2">Publish Trust/Utility Alert</h3>
              <p className="text-xs text-slate-400 mb-4">
                Share water cuts, blackout zones, or scam numbers to alert fellow Kenyans in real-time.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Alert Category</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Water">Water Outage / Rationing</option>
                    <option value="Power">KPLC Transformer / Outage</option>
                    <option value="Scam">Scam Phone / Agent Alert</option>
                    <option value="General">General Safety / Road Issues</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Estate Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Roysambu Area 2 / Syokimau"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Alert Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken water pipe leaking near bypass"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Detailed Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific numbers, affected streets, or scammer details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 h-24 font-sans resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl text-xs font-bold"
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
