import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Bed, 
  Bath, 
  Eye, 
  ThumbsUp, 
  Sparkles, 
  PlusCircle, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck, 
  Info, 
  X, 
  ArrowRight,
  TrendingUp,
  Award,
  Instagram,
  Phone,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Shared type imports
import { Property, Reel, CommunityReport, UserQuest, UserBadge, PropertyType, ChatMessage, UserProfile } from './types';

// Shared data imports
import { 
  INITIAL_PROPERTIES, 
  INITIAL_REELS, 
  INITIAL_REPORTS, 
  INITIAL_QUESTS, 
  INITIAL_BADGES,
  PRESET_PROFILES
} from './data';

// Component imports
import Navigation from './components/Navigation';
import ReelsFeed from './components/ReelsFeed';
import PropertyMap from './components/PropertyMap';
import AiTools from './components/AiTools';
import CommunityWatch from './components/CommunityWatch';
import ChatSimulator from './components/ChatSimulator';
import CampusHub from './components/CampusHub';
import AdminConsole from './components/AdminConsole';
import CompareModal from './components/CompareModal';
import FutureLabs from './components/FutureLabs';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const getHistoricalData = (basePrice: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const factors = [0.92, 0.94, 0.93, 0.96, 0.98, 1.0];
  return months.map((month, idx) => ({
    name: month,
    value: Math.round(basePrice * factors[idx]),
  }));
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('listings');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('makao_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('makao_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // User Profile States
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('makao_all_profiles');
    return saved ? JSON.parse(saved) : PRESET_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('makao_current_user');
    return saved ? JSON.parse(saved) : PRESET_PROFILES[0]; // Jane Wambui (Tenant) is default explorer
  });

  // Persistence States
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('makao_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('makao_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [reports, setReports] = useState<CommunityReport[]>(() => {
    const saved = localStorage.getItem('makao_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [quests, setQuests] = useState<UserQuest[]>(() => {
    const saved = localStorage.getItem('makao_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [badges, setBadges] = useState<UserBadge[]>(() => {
    const saved = localStorage.getItem('makao_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [userXp, setUserXp] = useState<number>(() => {
    const saved = localStorage.getItem('makao_xp');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [userLevel, setUserLevel] = useState<number>(() => {
    const saved = localStorage.getItem('makao_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('makao_messages');
    return saved ? JSON.parse(saved) : [
      { id: '1', sender: 'agent', text: 'Habari! Welcome to Makao Secured Chat. I am Andrew, a verified agent. No viewing fees are needed! Which of my verified properties in Kilimani or Kileleshwa would you like to discuss?', timestamp: '2:30 PM' }
    ];
  });

  // active listing detail dialog
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // new listing modal
  const [showAddListing, setShowAddListing] = useState(false);

  // Search/Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<PropertyType | 'all'>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(2000000);
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');

  // form states for creating property
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Kilimani, Nairobi');
  const [newPrice, setNewPrice] = useState('');
  const [newPropType, setNewPropType] = useState<PropertyType>('rent');
  const [newBedrooms, setNewBedrooms] = useState('1');
  const [newBathrooms, setNewBathrooms] = useState('1');
  const [newDescription, setNewDescription] = useState('');
  const [newAmenities, setNewAmenities] = useState<string[]>(['Wifi', 'Borehole Water', 'Backup Generator']);

  // Level Up Toast state
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize state to localStorage
  useEffect(() => {
    localStorage.setItem('makao_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('makao_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('makao_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('makao_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('makao_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('makao_xp', userXp.toString());
    localStorage.setItem('makao_level', userLevel.toString());
  }, [userXp, userLevel]);

  useEffect(() => {
    localStorage.setItem('makao_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('makao_all_profiles', JSON.stringify(allProfiles));
  }, [allProfiles]);

  useEffect(() => {
    localStorage.setItem('makao_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Handle XP increments and checks for levels
  const addXp = (amount: number, rewardSource: string) => {
    const nextXp = userXp + amount;
    const xpNeeded = userLevel * 200;
    
    setToastMessage(`+${amount} XP: ${rewardSource}`);
    setTimeout(() => setToastMessage(null), 3000);

    if (nextXp >= xpNeeded) {
      setUserLevel(prev => prev + 1);
      setUserXp(nextXp - xpNeeded);
      setShowLevelUp(true);

      // Award dynamic badge
      const newBadge: UserBadge = {
        id: `badge-${Date.now()}`,
        name: userLevel === 1 ? 'Neighborhood Ranger' : 'Real Estate Tycoon',
        icon: userLevel === 1 ? '🛡️' : '👑',
        description: `Unlocked by reaching User Reputation Level ${userLevel + 1}!`,
        dateEarned: new Date().toISOString().split('T')[0]
      };
      setBadges(prev => [...prev, newBadge]);
    } else {
      setUserXp(nextXp);
    }
  };

  // Triggering Quest complete
  const handleUnlockQuest = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        addXp(q.xpReward, `Completed Quest: "${q.name}"`);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  // Submitting property
  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const added: Property = {
      id: `prop-${Date.now()}`,
      title: newTitle,
      location: newLocation,
      price: parseFloat(newPrice),
      type: newPropType,
      bedrooms: newPropType === 'land' ? undefined : parseInt(newBedrooms, 10),
      bathrooms: newPropType === 'land' ? undefined : parseFloat(newBathrooms),
      image: newPropType === 'land' 
        ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      description: newDescription || 'Excellent verified residential structure in a highly safe, water-secure estate.',
      isVerified: true, // Auto-verified for showcase purposes
      rating: 4.5,
      latitude: -1.29 + (Math.random() - 0.5) * 0.1,
      longitude: 36.78 + (Math.random() - 0.5) * 0.1,
      amenities: newAmenities,
      host: {
        name: 'Andrew Muthengi (Agent)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
        phone: '+254 712 345678'
      },
      views: 120,
      likes: 8
    };

    setProperties(prev => [added, ...prev]);
    setShowAddListing(false);
    addXp(150, "Listed new verified property");

    // Clear Form
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
  };

  // Upvoting safety reports
  const handleUpvoteReport = (reportId: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        addXp(10, "Upvoted neighborhood warning alert");
        return { ...r, upvotes: r.upvotes + 1 };
      }
      return r;
    }));
  };

  // Adding safety report
  const handleAddReport = (newReport: Omit<CommunityReport, 'id' | 'date' | 'upvotes'>) => {
    const report: CommunityReport = {
      ...newReport,
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      upvotes: 1
    };
    setReports(prev => [report, ...prev]);
    addXp(100, `Reported Alert: "${report.title}"`);
    handleUnlockQuest('q-3');
  };

  // Resolving community warning alerts (Admin only)
  const handleResolveReport = (reportId: string, status: 'Investigating' | 'Verified Scam' | 'Resolved' | 'Active') => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status };
      }
      return r;
    }));
    addXp(150, `Admin updated status to "${status}"`);
  };

  // Deleting community warning alerts (Admin only)
  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    addXp(100, "Admin deleted flagged alert");
  };

  // Property Moderation Actions (Admin only)
  const handleToggleVerifyProperty = (propId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        const nextState = !p.isVerified;
        addXp(50, `Admin toggled Property Verification for "${p.title}"`);
        return { ...p, isVerified: nextState };
      }
      return p;
    }));
  };

  const handleToggleFeaturedProperty = (propId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        const nextState = !p.featured;
        addXp(60, `Admin toggled Featured HOT DEAL tag for "${p.title}"`);
        return { ...p, featured: nextState };
      }
      return p;
    }));
  };

  const handleDeleteProperty = (propId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propId));
    addXp(120, "Admin moderated and deleted unapproved listing");
  };

  // User & Agent Profile Moderation (Admin only)
  const handleToggleBanUser = (profileName: string) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.name === profileName) {
        const isCurrentlyBanned = p.age === 999;
        const nextAge = isCurrentlyBanned ? 24 : 999; // 999 serves as ban placeholder
        addXp(80, `Admin updated Suspend/Active status for user ${p.name}`);
        return { ...p, age: nextAge };
      }
      return p;
    }));
  };

  const handleToggleVerifyUser = (profileName: string) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.name === profileName) {
        const nextVerify = !p.isKycVerified;
        addXp(80, `Admin updated KYC compliance verified state for ${p.name}`);
        return { ...p, isKycVerified: nextVerify };
      }
      return p;
    }));
  };

  // Chat message send
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulated responsive agent reply after 2.5 seconds
    setTimeout(() => {
      let agentReplyText = "Safi sana! I have received your message. I can schedule a physical tour of the building this Friday at 2:00 PM. No viewing fees are needed, as all our processes are fully verified by Makao Yetu. Does that slot work for you?";
      if (text.toLowerCase().includes('escrow') || text.toLowerCase().includes('m-pesa')) {
        agentReplyText = "Excellent! The deposit is now securely locked in the Makao Yetu Escrow account. Once you verify the keys on Friday, you can release the escrow payment on your ledger. Looking forward to our viewing!";
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: agentReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      addXp(40, "Exchanged secure tenant correspondence");
    }, 2200);
  };

  // Reel Like increment
  const handleLikeReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const nextLiked = !r.isLiked;
        addXp(20, nextLiked ? "Liked a property walkthrough reel" : "Unliked reel");
        return {
          ...r,
          likes: nextLiked ? r.likes + 1 : r.likes - 1,
          isLiked: nextLiked
        };
      }
      return r;
    }));
  };

  // Inquire from Reel walkthrough
  const handleInquireFromReel = (propertyId: string, text: string) => {
    const matched = properties.find(p => p.id === propertyId);
    if (matched) {
      setSelectedProperty(matched);
      handleSendMessage(text);
      setActiveTab('chat');
    }
  };

  // Daily Spin success hook
  const handleSpinSuccess = (xpEarned: number) => {
    addXp(xpEarned, "Jackpot Reward Wheel!");
    handleUnlockQuest('q-4');
  };

  // Filter listings based on criteria
  const filteredListings = properties.filter((prop) => {
    const matchesKeyword = prop.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                           prop.location.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = filterType === 'all' || prop.type === filterType;
    const matchesPrice = prop.price <= filterMaxPrice;
    
    let matchesBeds = true;
    if (filterBedrooms !== 'all') {
      if (filterBedrooms === '0') {
        matchesBeds = prop.bedrooms === 0;
      } else {
        matchesBeds = prop.bedrooms === parseInt(filterBedrooms, 10);
      }
    }

    return matchesKeyword && matchesType && matchesPrice && matchesBeds;
  });

  return (
    <div className="min-h-screen bg-[#faf7f8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-300">
      
      {/* Navigation Header */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userXp={userXp}
        userLevel={userLevel}
        badges={badges}
        quests={quests}
        onSpinSuccess={handleSpinSuccess}
        currentUser={currentUser}
        onSwitchProfile={(prof) => {
          setCurrentUser(prof);
          addXp(30, `Authenticated as ${prof.name} (${prof.role.toUpperCase()})`);
        }}
        allProfiles={allProfiles}
        onAddNewProfile={(newProf) => {
          setAllProfiles(prev => [newProf, ...prev]);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Floating dynamic toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pb-16">
        
        {/* TAB 1: PROPERTIES LISTINGS EXPLORER */}
        {activeTab === 'listings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Custom Brand Banner */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-teal-800 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-rose-500/10 border border-rose-400/20">
              <div className="absolute inset-0 bg-radial-gradient(circle_at_top_right,rgba(255,182,193,0.35),transparent_60%) pointer-events-none"></div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-white font-mono text-[9px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/30 flex items-center gap-1">
                    🇰🇪 VERIFIED PROPERTY NETWORK
                  </span>
                  <span className="text-pink-100 font-mono text-[9px] font-bold uppercase tracking-widest bg-rose-500/80 px-3 py-1 rounded-full border border-rose-400/30 animate-pulse flex items-center gap-1 shadow-sm">
                    🔥 HOT ECOSYSTEM
                  </span>
                </div>
                <h1 className="text-2xl md:text-3.5xl font-bold tracking-tight text-white leading-tight font-display drop-shadow-sm">
                  Find Scam-free Housing, Hostels, and Land in Kenya
                </h1>
                <p className="text-xs md:text-sm text-pink-50 leading-relaxed font-semibold">
                  Welcome to Africa's #1 verified property ecosystem. Experience direct walkthrough video reels, GPS acreage calculation, and secure tenant deposit escrow accounts. No fake viewing fees!
                </p>
                <div className="flex flex-wrap gap-3 pt-2 font-bold">
                  <button 
                    onClick={() => { setActiveTab('ai'); handleUnlockQuest('q-2'); }}
                    className="clay-btn-pink text-white py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-bounce" /> AI Budget Planner
                  </button>
                  <button 
                    onClick={() => setShowAddListing(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 backdrop-blur transition-all cursor-pointer font-bold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> List Your Property
                  </button>
                </div>
              </div>
              {/* Abstract decorative graphic */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient(ellipse_at_bottom_right,rgba(244,63,94,0.35),transparent) pointer-events-none hidden lg:block"></div>
            </div>

            {/* Global Search Filters Dashboard */}
            <div className="clay-card p-6 text-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              {/* Keyword Search */}
              <div className="md:col-span-4 space-y-1.5 font-bold">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Estate or Area</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search e.g. Kilimani, Zimmerman, Juja..."
                    className="w-full clay-input py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Property Category Type select */}
              <div className="md:col-span-2 space-y-1.5 font-bold">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Category</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full clay-input py-2.5 px-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Properties</option>
                  <option value="rent">To Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="land">Agricultural/Plots</option>
                  <option value="hostel">Student Hostels</option>
                  <option value="commercial">Commercial Hubs</option>
                </select>
              </div>

              {/* Max Rent Slider */}
              <div className="md:col-span-3 space-y-1.5 font-bold">
                <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  <span>Max Budget (Ksh)</span>
                  <span className="text-emerald-700">Ksh {filterMaxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="2000000"
                  step="5000"
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Bedrooms Filter */}
              <div className="md:col-span-2 space-y-1.5 font-bold">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Bedrooms</label>
                <select
                  value={filterBedrooms}
                  onChange={(e) => setFilterBedrooms(e.target.value)}
                  className="w-full clay-input py-2.5 px-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Bedrooms</option>
                  <option value="0">Bedsitter / Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="4">4 Bedrooms</option>
                </select>
              </div>

              {/* Reset filter button */}
              <div className="md:col-span-1">
                <button
                  onClick={() => {
                    setSearchKeyword('');
                    setFilterType('all');
                    setFilterMaxPrice(2000000);
                    setFilterBedrooms('all');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((prop) => (
                <motion.div
                  key={prop.id}
                  whileHover={{ y: -5 }}
                  className={`${prop.featured ? 'hot-deal-card' : 'clay-card'} p-0 overflow-hidden text-slate-800 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                  onClick={() => {
                    setSelectedProperty(prop);
                    addXp(10, "Viewed property catalog details");
                  }}
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                      src={prop.image} 
                      alt={prop.title} 
                    />
                    
                    {/* Trust badges overlaid */}
                    {prop.isVerified && (
                      <span className="absolute top-3 left-3 bg-emerald-600/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur shadow-sm">
                        ✓ VERIFIED NO SCAMS
                      </span>
                    )}

                    {prop.featured && (
                      <span className="absolute top-3 right-3 bg-rose-500 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 shadow">
                        🔥 HOT DEAL
                      </span>
                    )}

                    {/* Price tag */}
                    <div className="absolute bottom-3 right-3 bg-white/95 text-emerald-800 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      Ksh {prop.price.toLocaleString()}{prop.type === 'rent' || prop.type === 'hostel' ? '/mo' : ''}
                    </div>

                    {/* Compare Button overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isCompared = compareIds.includes(prop.id);
                        if (isCompared) {
                          setCompareIds(prev => prev.filter(id => id !== prop.id));
                        } else {
                          if (compareIds.length >= 3) {
                            setToastMessage("You can compare up to 3 listings side-by-side!");
                            setTimeout(() => setToastMessage(null), 3000);
                          } else {
                            setCompareIds(prev => [...prev, prop.id]);
                            addXp(15, "Selected listing for comparison");
                          }
                        }
                      }}
                      className={`absolute bottom-3 left-3 px-2.5 py-1.5 rounded-xl border font-bold text-[9px] uppercase tracking-wide flex items-center gap-1 transition-all cursor-pointer ${
                        compareIds.includes(prop.id)
                          ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                          : 'bg-white/95 hover:bg-white text-slate-700 border-slate-200 shadow-xs'
                      }`}
                      title="Select to compare up to 3 properties side-by-side"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${compareIds.includes(prop.id) ? 'bg-white animate-ping' : 'bg-rose-500'}`}></span>
                      {compareIds.includes(prop.id) ? 'Comparing ✓' : 'Compare'}
                    </button>
                  </div>

                  {/* Description Box */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono uppercase font-bold">
                        <span>{prop.location}</span>
                        <span>•</span>
                        <span className="text-emerald-700">{prop.type}</span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-snug mt-1.5 line-clamp-1 font-display">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-semibold leading-relaxed">
                        {prop.description}
                      </p>

                      {/* 6-Month Location Rent/Valuation Trend Mini-Chart */}
                      <div className="mt-3 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8.5px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            📈 6-Month {prop.type === 'rent' || prop.type === 'hostel' ? 'Rent' : 'Valuation'} Trend
                          </span>
                          <span className="text-[8.5px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            +4.8% YoY
                          </span>
                        </div>
                        <div className="h-8 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getHistoricalData(prop.price)} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                              <defs>
                                <linearGradient id={`colorTrend-${prop.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="value" stroke="#e11d48" strokeWidth={1.5} fillOpacity={1} fill={`url(#colorTrend-${prop.id})`} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Specs / Icons row */}
                    {prop.type !== 'land' && (
                      <div className="flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.bedrooms === 0 ? 'Bedsitter' : `${prop.bedrooms} Bed`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.bathrooms} Bath
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Views & CTA row */}
                  <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" /> {prop.views} views
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      Inspect Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </motion.div>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="clay-card p-12 text-center text-slate-600">
                <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-bounce" />
                <h4 className="font-bold text-slate-800 text-sm">No Matching Properties Found</h4>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Adjust your budget or keywords (try "Kilimani" or "Juja Farm").</p>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: VIDEO REELS walkthrough */}
        {activeTab === 'reels' && (
          <ReelsFeed 
            reels={reels} 
            properties={properties} 
            onLikeReel={handleLikeReel}
            onInquireReel={handleInquireFromReel}
          />
        )}

        {/* TAB 3: INTERACTIVE COORDINATE MAP */}
        {activeTab === 'map' && (
          <PropertyMap 
            properties={properties} 
            onSelectProperty={(prop) => {
              setSelectedProperty(prop);
              setActiveTab('listings');
            }}
          />
        )}

        {/* TAB 4: ADVANCED AI ADVISORY HUB */}
        {activeTab === 'ai' && (
          <AiTools />
        )}

        {/* TAB 5: TRUST & COMMUNITY PROTECTION alerts */}
        {activeTab === 'safety' && (
          <CommunityWatch 
            reports={reports} 
            onUpvoteReport={handleUpvoteReport}
            onAddReport={handleAddReport}
            currentUserRole={currentUser.role}
            onResolveReport={handleResolveReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {/* TAB 6: CHATS ROOM SIMULATOR */}
        {activeTab === 'chat' && (
          <ChatSimulator 
            messages={messages} 
            onSendMessage={handleSendMessage}
            activeProperty={selectedProperty}
            onUnlockQuest={handleUnlockQuest}
          />
        )}

        {/* TAB 7: SEPTEMBER CAMPUS INTAKE HUB */}
        {activeTab === 'campus' && (
          <CampusHub 
            properties={properties} 
            onInquire={(propertyTitle) => {
              const matched = properties.find(p => p.title === propertyTitle);
              if (matched) {
                setSelectedProperty(matched);
                handleSendMessage(`Hi, I am joining university in September and would love to book a safe tour for ${propertyTitle}!`);
                setActiveTab('chat');
              }
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 7.5: MAKAO FUTURELABS */}
        {activeTab === 'futurelabs' && (
          <FutureLabs 
            addXp={addXp}
            setToastMessage={setToastMessage}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 8: ADMIN CONSOLE */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <AdminConsole 
            properties={properties}
            onToggleVerifyProperty={handleToggleVerifyProperty}
            onToggleFeaturedProperty={handleToggleFeaturedProperty}
            onDeleteProperty={handleDeleteProperty}
            reports={reports}
            onResolveReport={handleResolveReport}
            onDeleteReport={handleDeleteReport}
            allProfiles={allProfiles}
            onToggleBanUser={handleToggleBanUser}
            onToggleVerifyUser={handleToggleVerifyUser}
          />
        )}

      </main>

      {/* FOOTER SYSTEM */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Column 1: Brand & Creator Info */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-600 rounded-xl text-white font-mono text-xs font-black">MY</span>
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white font-display">
                  Makao Yetu <span className="text-rose-500 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">STUDENT SAFE</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-sm">
                Built with precision to safeguard Kenyan university students and households against renting deposit scams. Verified borehole water indexes, power backups, and automated roommate matching matrices.
              </p>
              <div className="pt-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">Master Craftsman</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  💡 Designed & Developed by <span className="text-rose-600 dark:text-rose-400 font-mono font-black">andy_corruption</span>
                </span>
              </div>
            </div>

            {/* Column 2: Creator Direct Contacts */}
            <div className="md:col-span-4 space-y-3 md:border-l md:border-slate-100 dark:md:border-slate-900 md:pl-8">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Direct Developer Inquiries
              </h4>
              <div className="space-y-2 text-xs font-semibold">
                {/* Phone */}
                <a 
                  href="tel:0768356417" 
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-500 group-hover:text-rose-500 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">0768356417</span>
                </a>

                {/* Email */}
                <a 
                  href="mailto:andrewmuthengi80@gmail.com" 
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-500 group-hover:text-rose-500 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">andrewmuthengi80@gmail.com</span>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/andy_corruption" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-500 group-hover:text-rose-500 transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">@andy_corruption</span>
                </a>
              </div>
            </div>

            {/* Column 3: Trust Certifications */}
            <div className="md:col-span-3 space-y-3.5 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                <span>100% Anti-Scam Shielded</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Integrated Ardhisasa land information registries ensure title checking, preventing ghost rental scams.
              </p>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                <span>Intake Goal:</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono">SEPTEMBER BUSTLE 🚀</span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright protection strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10.5px] font-bold text-slate-400 dark:text-slate-500">
            <p className="flex items-center gap-1 flex-wrap text-center sm:text-left">
              <span>© {new Date().getFullYear()} Makao Yetu. All Rights Reserved. Protected under Kenyan Land Code & Computer Misuse and Cybercrimes Act.</span>
            </p>
            <div className="flex gap-4 font-mono text-[9px] tracking-wide">
              <span className="text-emerald-600 dark:text-emerald-400">● SECURITY PASSPORT VERIFIED</span>
              <span className="text-rose-600 dark:text-rose-400">● 50,000+ CO-LIVING SEATS READY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PROPERTY DETAIL FULL DIALOG */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full text-slate-800 shadow-2xl overflow-hidden my-8"
            >
              {/* Image Grid Hero */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-100 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title} 
                />
                
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full shadow-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {selectedProperty.isVerified && (
                  <span className="absolute bottom-4 left-4 bg-emerald-600 text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ✓ Verified Security Passport
                  </span>
                )}
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Description columns */}
                <div className="md:col-span-8 space-y-5">
                  <div>
                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono px-2.5 py-1 rounded-full font-bold">
                      {selectedProperty.location}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-2.5 font-display">
                      {selectedProperty.title}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedProperty.description}
                  </p>

                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Amenities Include:</h4>
                    <div className="flex flex-wrap gap-2 font-bold">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3.5 py-1.5 rounded-xl">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Agent Contact column */}
                <div className="md:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">TOTAL BOOKING COST</span>
                    <p className="text-2xl font-bold text-emerald-700 font-display">
                      Ksh {selectedProperty.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Held securely in M-Pesa Escrow wallet</p>
                  </div>

                  <div className="bg-white border border-slate-200 p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center space-x-3">
                      <img className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500" src={selectedProperty.host.avatar} alt="Agent Profile" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-950 flex items-center gap-1">
                          {selectedProperty.host.name}
                          {selectedProperty.host.isVerified && <span className="text-emerald-700 font-bold">✓</span>}
                        </h5>
                        <p className="text-[10px] text-slate-500">{selectedProperty.host.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProperty(null);
                      setActiveTab('chat');
                      handleUnlockQuest('q-1');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Verified Agent
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW LISTING FORM MODAL */}
      <AnimatePresence>
        {showAddListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full text-slate-800 shadow-2xl my-8"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 font-display">List Your Property (Verified Account)</h3>
                <button onClick={() => setShowAddListing(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProperty} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Property Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Elegant Bedsitter"
                      className="w-full clay-input py-2 px-3 text-slate-800 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Kenyan Location / Estate</label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full clay-input py-2 px-3 text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Kilimani, Nairobi">Kilimani, Nairobi</option>
                      <option value="Kileleshwa, Nairobi">Kileleshwa, Nairobi</option>
                      <option value="Roysambu, Nairobi">Roysambu, Nairobi</option>
                      <option value="Zimmerman, Nairobi">Zimmerman, Nairobi</option>
                      <option value="Juja Farm, Kiambu">Juja Farm, Kiambu</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Category type</label>
                    <select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value as any)}
                      className="w-full clay-input py-2 px-3 text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="rent">To Rent</option>
                      <option value="sale">For Sale</option>
                      <option value="land">Agricultural Land / Plot</option>
                      <option value="hostel">Student Hostel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Price (Ksh)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full clay-input py-2 px-3 text-slate-800 focus:outline-none font-bold"
                      required
                    />
                  </div>
                </div>

                {newPropType !== 'land' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-500 block mb-1">Bedrooms</label>
                      <select
                        value={newBedrooms}
                        onChange={(e) => setNewBedrooms(e.target.value)}
                        className="w-full clay-input py-2 px-3 text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="0">Bedsitter / Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Bathrooms</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newBathrooms}
                        onChange={(e) => setNewBathrooms(e.target.value)}
                        className="w-full clay-input py-2 px-3 text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-slate-500 block mb-1">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g. secure, close to road, constant borehole water"
                    className="w-full clay-input p-3 text-slate-800 focus:outline-none h-20 font-sans resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3.5 border-t border-slate-100 font-bold">
                  <button
                    type="button"
                    onClick={() => setShowAddListing(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    Submit Verified Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEVEL UP SYSTEM MODAL */}
      <AnimatePresence>
        {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm w-full text-center text-slate-800 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative light progress line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>

              <Award className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-bold mb-1 text-slate-900 font-display">🎉 REPUTATION LEVEL UP!</h3>
              <p className="text-xs text-slate-500 mb-4 font-semibold">You have advanced your community standing score on the Makao Yetu network!</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 font-bold shadow-inner">
                <span className="text-[10px] text-slate-400 block mb-0.5">NEW REPUTATION LEVEL</span>
                <span className="text-2xl font-bold text-amber-600">{userLevel}</span>
              </div>

              <button
                onClick={() => setShowLevelUp(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Awesome! Continue Exploring
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING COMPARE BAR */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2.5 overflow-x-auto">
              {compareIds.map(id => {
                const matched = properties.find(p => p.id === id);
                if (!matched) return null;
                return (
                  <div key={id} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                    <img src={matched.image} className="w-full h-full object-cover" alt={matched.title} />
                    <button
                      onClick={() => setCompareIds(prev => prev.filter(item => item !== id))}
                      className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full scale-75 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {compareIds.length < 3 && (
                <div className="w-10 h-10 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs shrink-0 font-bold" title="Add up to 3 properties to compare">
                  + {3 - compareIds.length}
                </div>
              )}
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold text-slate-400 block uppercase leading-tight">Selected to compare</span>
                <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">{compareIds.length} listing{compareIds.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setCompareIds([])}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl cursor-pointer transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-wide px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Compare Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED PROPERTY COMPARISON DIALOG */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        properties={properties.filter(p => compareIds.includes(p.id))}
        onInquire={(propertyTitle) => {
          const matched = properties.find(p => p.title === propertyTitle);
          if (matched) {
            setSelectedProperty(matched);
            handleSendMessage(`Hi, I would love to make an inquiry and get details about the specifications of "${propertyTitle}"!`);
            setActiveTab('chat');
          }
        }}
      />

    </div>
  );
}
