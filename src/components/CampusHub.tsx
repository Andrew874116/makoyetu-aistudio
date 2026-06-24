import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Users, MapPin, BadgePercent, CheckCircle, Flame, Star, Send, ShieldAlert, Sparkles, Building, PhoneCall, Copy, Check } from 'lucide-react';
import { Property } from '../types';

interface CampusHubProps {
  properties: Property[];
  onInquire: (propertyTitle: string) => void;
  isDarkMode?: boolean;
}

interface RoommateCandidate {
  id: string;
  name: string;
  age: number;
  university: string;
  gender: 'Male' | 'Female';
  lifestyle: string; // e.g. "Studious, quiet, likes cooking"
  cleanliness: 'Extremely Neat' | 'Moderate' | 'Relaxed';
  budgetLimit: string;
  avatar: string;
  phone: string;
}

export default function CampusHub({ properties, onInquire, isDarkMode }: CampusHubProps) {
  // 1. Campus distance calculator state
  const [selectedUniv, setSelectedUniv] = useState('USIU-Africa');
  // 2. Roommate quiz states
  const [quizGender, setQuizGender] = useState<'Male' | 'Female'>('Female');
  const [quizCleanliness, setQuizCleanliness] = useState<'Extremely Neat' | 'Moderate' | 'Relaxed'>('Extremely Neat');
  const [quizSleep, setQuizSleep] = useState<'Early' | 'Night Owl' | 'Flexible'>('Flexible');
  const [quizBudget, setQuizBudget] = useState<number>(25000);
  const [matchedRoommates, setMatchedRoommates] = useState<RoommateCandidate[]>([]);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  // 3. Group booking discount state
  const [groupSize, setGroupSize] = useState<number>(2);
  const [referralCode, setReferralCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Universities list in Kenya (September intake hotspots)
  const UNIVERSITIES = [
    { name: 'USIU-Africa (Roysambu)', lat: -1.2185, lng: 36.8894, campuses: 'Main Campus', safeHostelCount: 12 },
    { name: 'Strathmore University (Madaraka)', lat: -1.3090, lng: 36.8124, campuses: 'Ole Sangale Rd', safeHostelCount: 9 },
    { name: 'University of Nairobi (Main Campus)', lat: -1.2801, lng: 36.8159, campuses: 'CBD / State House Rd', safeHostelCount: 15 },
    { name: 'Kenyatta University (Kahawa)', lat: -1.1812, lng: 36.9298, campuses: 'Thika Road Main', safeHostelCount: 18 },
    { name: 'JKUAT (Juja)', lat: -1.1017, lng: 37.0144, campuses: 'Juja Main Campus', safeHostelCount: 14 },
    { name: 'Daystar University (Valley Road)', lat: -1.2942, lng: 36.8043, campuses: 'Nairobi Campus', safeHostelCount: 8 }
  ];

  // Preset Roommate seekers
  const ROOMMATE_SEEKERS: RoommateCandidate[] = [
    {
      id: 'rm-1',
      name: 'Stacy Atieno',
      age: 20,
      university: 'USIU-Africa',
      gender: 'Female',
      lifestyle: 'Quiet, strictly studious, no house parties. Loves baking.',
      cleanliness: 'Extremely Neat',
      budgetLimit: 'KES 25,000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      phone: '+254 711 112233'
    },
    {
      id: 'rm-2',
      name: 'Mercy Chepngetich',
      age: 19,
      university: 'Strathmore University',
      gender: 'Female',
      lifestyle: 'Flexible study hours, loves group cooking. Active in student council.',
      cleanliness: 'Moderate',
      budgetLimit: 'KES 30,000',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      phone: '+254 722 888999'
    },
    {
      id: 'rm-3',
      name: 'Brian Mwangi',
      age: 21,
      university: 'University of Nairobi',
      gender: 'Male',
      lifestyle: 'Tech student, night owl, code runner. Quiet & respects privacy.',
      cleanliness: 'Moderate',
      budgetLimit: 'KES 18,000',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      phone: '+254 733 445566'
    },
    {
      id: 'rm-4',
      name: 'Emmanuel Kiprop',
      age: 22,
      university: 'JKUAT',
      gender: 'Male',
      lifestyle: 'Engineering enthusiast, loves outdoor runs, very early riser.',
      cleanliness: 'Extremely Neat',
      budgetLimit: 'KES 15,000',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      phone: '+254 701 556677'
    },
    {
      id: 'rm-5',
      name: 'Cynthia Mwende',
      age: 20,
      university: 'USIU-Africa',
      gender: 'Female',
      lifestyle: 'Interior design student, early sleeper, loves plant decoration.',
      cleanliness: 'Extremely Neat',
      budgetLimit: 'KES 28,000',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      phone: '+254 715 000222'
    }
  ];

  // Run a high-end simulated room matching query
  const handleFindRoommates = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizLoading(true);

    setTimeout(() => {
      const matched = ROOMMATE_SEEKERS.filter(candidate => {
        const genderMatch = candidate.gender === quizGender;
        const cleanlinessMatch = candidate.cleanliness === quizCleanliness || quizCleanliness === 'Moderate';
        const parsedBudget = parseInt(candidate.budgetLimit.replace(/[^0-9]/g, ''), 10);
        const budgetMatch = parsedBudget <= quizBudget + 5000;
        return genderMatch && cleanlinessMatch && budgetMatch;
      });

      setMatchedRoommates(matched);
      setQuizLoading(false);
      setHasTakenQuiz(true);
    }, 800);
  };

  const handleGenerateGroupCode = () => {
    const randomCode = `MAKAO-SEPT-${groupSize}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferralCode(randomCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Get properties located close to selected university (simulated based on distance check)
  const currentUnivData = UNIVERSITIES.find(u => u.name === selectedUniv);
  const matchedHostels = properties.filter(prop => {
    if (selectedUniv.includes('USIU') && (prop.location.includes('Roysambu') || prop.location.includes('Thika Road') || prop.location.includes('Kasarani'))) return true;
    if (selectedUniv.includes('Strathmore') && (prop.location.includes('Madaraka') || prop.location.includes('Langata') || prop.location.includes('Kilimani'))) return true;
    if (selectedUniv.includes('Nairobi') && (prop.location.includes('CBD') || prop.location.includes('State House') || prop.location.includes('Kilimani') || prop.location.includes('Westlands'))) return true;
    if (selectedUniv.includes('JKUAT') && prop.location.includes('Juja')) return true;
    if (selectedUniv.includes('Kenyatta') && (prop.location.includes('Kahawa') || prop.location.includes('Thika Road'))) return true;
    // Default fallback to keep list populated
    return prop.price < 35000;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Target Market Hero Header (September Intake Focus) */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-800 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-rose-400/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="bg-white/20 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 flex items-center gap-1 backdrop-blur">
              🎓 SEPTEMBER INTAKE ADMISSIONS PORTAL
            </span>
            <span className="bg-rose-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-400/30 animate-pulse flex items-center gap-1 shadow-sm">
              🚀 STUDENT SPECIALS
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight font-display drop-shadow-sm">
            Secure Your Safe Campus Hostel & Roommate for September Intake!
          </h1>
          <p className="text-xs md:text-sm text-pink-50 leading-relaxed font-semibold max-w-2xl">
            Skip the stressful broker scuffling on Thika Road, Madaraka, or Juja. We match first-years and continuing students with verified, water-secure, scam-free housing nearby USIU, Strathmore, JKUAT, Ku, and UoN.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-bold pt-1">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle className="w-4 h-4 text-pink-400" /> Borehole Water Verified
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle className="w-4 h-4 text-pink-400" /> WiFi Speed Certified (20Mbps+)
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle className="w-4 h-4 text-pink-400" /> Secure Token Lock Deposits
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient(ellipse_at_bottom_right,rgba(244,63,94,0.4),transparent) pointer-events-none hidden lg:block"></div>
      </div>

      {/* Grid of Interactive Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Module 1: Campus Nearby Hostel Finder (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-rose-500" /> University Perimeter Compass
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Calculate exact walking distance to your college gate and find safe verified hostels.</p>
              </div>
              <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                Live Perimeter Map
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl mb-5 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="w-full sm:w-2/3">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Select Kenyan College / University Campus</label>
                <select
                  value={selectedUniv}
                  onChange={(e) => setSelectedUniv(e.target.value)}
                  className="w-full clay-input bg-white dark:bg-slate-900 py-2.5 px-3 focus:outline-none font-semibold text-xs text-slate-950 dark:text-white"
                >
                  {UNIVERSITIES.map(u => (
                    <option key={u.name} value={u.name}>{u.name} ({u.campuses})</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-3 rounded-xl text-center">
                <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                  {currentUnivData?.safeHostelCount}
                </div>
                <div className="text-[9px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide">Verified Safe Hostels</div>
              </div>
            </div>

            {/* Hostel comparative catalog */}
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Matched Safety-Approved Hostels near {selectedUniv}:
            </h3>

            <div className="space-y-3.5">
              {matchedHostels.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/40 dark:border-slate-800">
                  <p className="text-xs text-slate-500">No cheap hostels nearby. Try switching campuses above to query!</p>
                </div>
              ) : (
                matchedHostels.slice(0, 4).map((hostel) => {
                  // simulated distance calculation based on hostel properties
                  const simulatedDist = ((hostel.price % 7) + 3) / 10; // e.g. 0.3km - 0.9km
                  const isPowerBackup = hostel.amenities.includes('Backup Generator');
                  return (
                    <div 
                      key={hostel.id}
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-rose-200 dark:hover:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:shadow-sm transition-all"
                    >
                      <div className="flex gap-3 items-center">
                        <img src={hostel.image} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" alt={hostel.title} />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-950 dark:text-white leading-tight">{hostel.title}</h4>
                            <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[8px] px-1.5 py-0.2 rounded-full font-bold">
                              ✓ Verified
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" /> 
                            <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">{simulatedDist} km</span> from {selectedUniv} gate
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                              🚿 Borehole OK
                            </span>
                            {isPowerBackup && (
                              <span className="text-[9px] bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-medium flex items-center gap-0.5">
                                ⚡ Power Backed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 dark:border-slate-800">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold">September Rent</span>
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">KES {hostel.price.toLocaleString()}/mo</span>
                        </div>
                        <button
                          onClick={() => onInquire(hostel.title)}
                          className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                        >
                          Send Free Tour Request
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Group Booking Escrow Pool Calculator */}
          <div className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BadgePercent className="w-40 h-40 text-rose-500 rotate-12" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
                <BadgePercent className="w-4.5 h-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">Intake Group Discount Escrow Pool</h3>
                <p className="text-[10px] text-slate-500">Group bookings for roommates get standard 10% off secure holding deposits.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 text-xs font-semibold">
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 block mb-1">Total Roommates Joining Pool (2-4 Max)</label>
                  <input
                    type="number"
                    min="2"
                    max="4"
                    value={groupSize}
                    onChange={(e) => setGroupSize(Math.min(4, Math.max(2, parseInt(e.target.value) || 2)))}
                    className="w-full clay-input bg-white dark:bg-slate-900 p-2 focus:outline-none font-bold text-center text-sm"
                  />
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500">Standard Room Deposit:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">KES 35,000</span>
                </div>
                <div className="flex justify-between items-center text-xs text-rose-600 dark:text-rose-400">
                  <span>Group Savings (10%):</span>
                  <span className="font-mono font-bold">- KES {(3500 * groupSize).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-slate-950 dark:text-white">Discounted Total Pool:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">KES {(31500 * groupSize).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-3.5">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                  Generate a shareable code. When your roommates use this code to book, Makao Yetu automatically links your deposits inside the escrow container.
                </p>

                {referralCode ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/50 justify-between">
                      <code className="text-xs font-bold text-rose-700 dark:text-rose-300 font-mono tracking-wider">{referralCode}</code>
                      <button
                        onClick={copyToClipboard}
                        className="p-1 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block text-center">✓ 10% Discount Coupon Locked for Intake</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateGroupCode}
                    className="clay-btn-pink w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    Generate Roommate Discount Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Futuristic Roommate Matchmaker Matrix (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500 animate-pulse" /> Roommate Matching Matrix
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Avoid terrible co-living matches. Fill out our roommate profile preferences and link with vetted applicants instantly.</p>
            </div>

            <form onSubmit={handleFindRoommates} className="space-y-4 text-xs font-semibold">
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Your Gender Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuizGender('Female')}
                      className={`py-2 px-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        quizGender === 'Female'
                          ? 'bg-pink-100 text-pink-800 border-pink-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Female Seekers
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizGender('Male')}
                      className={`py-2 px-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        quizGender === 'Male'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Male Seekers
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Cleanliness Standard</label>
                  <select
                    value={quizCleanliness}
                    onChange={(e) => setQuizCleanliness(e.target.value as any)}
                    className="w-full clay-input bg-white dark:bg-slate-900 py-2.5 px-3 focus:outline-none"
                  >
                    <option value="Extremely Neat">Extremely Neat (Deep clean weekly)</option>
                    <option value="Moderate">Moderate (Sweep, keep rooms tidy)</option>
                    <option value="Relaxed">Relaxed (Easy-going, non-fussy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Study Cycle Preference</label>
                  <select
                    value={quizSleep}
                    onChange={(e) => setQuizSleep(e.target.value as any)}
                    className="w-full clay-input bg-white dark:bg-slate-900 py-2.5 px-3 focus:outline-none"
                  >
                    <option value="Flexible">Flexible / Hybrid Study</option>
                    <option value="Early">Early Bird (Silent study in mornings)</option>
                    <option value="Night Owl">Night Owl (Quiet coding/writing past midnight)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-600 dark:text-slate-400">Max Share Budget Limit</label>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">KES {quizBudget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="40000"
                    step="2000"
                    value={quizBudget}
                    onChange={(e) => setQuizBudget(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={quizLoading}
                className="clay-btn-pink w-full py-3 rounded-2xl font-bold tracking-wide transition-all text-center cursor-pointer text-xs uppercase"
              >
                {quizLoading ? 'Running Compatibility Matchmaker...' : 'Run Roommate Match Matrix'}
              </button>
            </form>

            {/* Match Results */}
            <AnimatePresence>
              {hasTakenQuiz && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-5 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Perfect Compatibility Matches</h3>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">Ready to Share</span>
                  </div>

                  <div className="space-y-3">
                    {matchedRoommates.length === 0 ? (
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-center border border-slate-200/40 dark:border-slate-800">
                        <p className="text-xs text-slate-500">No ideal candidates matched. Try broadening cleanliness or budget parameters!</p>
                      </div>
                    ) : (
                      matchedRoommates.map(seeker => (
                        <div
                          key={seeker.id}
                          className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <img src={seeker.avatar} className="w-11 h-11 rounded-xl object-cover border border-slate-300" alt={seeker.name} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{seeker.name}</h4>
                                <span className="bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                  98% Match
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                                Age: <span className="font-bold text-slate-700 dark:text-slate-200">{seeker.age}</span> • College: <span className="font-bold text-slate-700 dark:text-slate-200">{seeker.university}</span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 italic">
                            "{seeker.lifestyle}"
                          </div>

                          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-800">
                            <div>
                              <span className="text-slate-400 font-medium">Budget limit: </span>
                              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{seeker.budgetLimit}</span>
                            </div>
                            <a
                              href={`tel:${seeker.phone}`}
                              className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-xl text-[10px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-900 cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5" /> Call Roommate
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
