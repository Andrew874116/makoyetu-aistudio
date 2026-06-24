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
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Shared type imports
import { Property, Reel, CommunityReport, UserQuest, UserBadge, PropertyType, ChatMessage } from './types';

// Shared data imports
import { 
  INITIAL_PROPERTIES, 
  INITIAL_REELS, 
  INITIAL_REPORTS, 
  INITIAL_QUESTS, 
  INITIAL_BADGES 
} from './data';

// Component imports
import Navigation from './components/Navigation';
import ReelsFeed from './components/ReelsFeed';
import PropertyMap from './components/PropertyMap';
import AiTools from './components/AiTools';
import CommunityWatch from './components/CommunityWatch';
import ChatSimulator from './components/ChatSimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('listings');

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
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userXp={userXp}
        userLevel={userLevel}
        badges={badges}
        quests={quests}
        onSpinSuccess={handleSpinSuccess}
      />

      {/* Floating dynamic toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold py-2.5 px-4 rounded-xl shadow-xl shadow-emerald-950/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
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
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full">
                  🇰🇪 VERIFIED PROPERTY NETWORK
                </span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                  Find Scam-free Housing, Hostels, and Land in Kenya
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Join Kenya's first housing platform featuring short-video walkthrough reels, GPS acreage calculation, and automated tenant protection ledgers. No fake viewing fees!
                </p>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => { setActiveTab('ai'); handleUnlockQuest('q-2'); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Budget Planner
                  </button>
                  <button 
                    onClick={() => setShowAddListing(true)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> List Your Property
                  </button>
                </div>
              </div>
              {/* Abstract decorative graphic */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.15),transparent) pointer-events-none hidden lg:block"></div>
            </div>

            {/* Global Search Filters Dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              
              {/* Keyword Search */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">Estate or Area</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search e.g. Kilimani, USIU road..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Property Category Type select */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">Category</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 text-slate-300"
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
              <div className="md:col-span-3 space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                  <span>Max Budget (Ksh)</span>
                  <span className="text-emerald-400 font-mono">Ksh {filterMaxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="2000000"
                  step="5000"
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Bedrooms Filter */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">Bedrooms</label>
                <select
                  value={filterBedrooms}
                  onChange={(e) => setFilterBedrooms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 text-slate-300"
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
                  className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white py-2 rounded-xl text-xs transition-colors"
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
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => {
                    setSelectedProperty(prop);
                    addXp(10, "Viewed property catalog details");
                  }}
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                      src={prop.image} 
                      alt={prop.title} 
                    />
                    
                    {/* Trust badges overlaid */}
                    {prop.isVerified && (
                      <span className="absolute top-3 left-3 bg-emerald-600/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                        ✓ VERIFIED NO SCAMS
                      </span>
                    )}

                    {prop.featured && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        ⭐ FEATURED
                      </span>
                    )}

                    {/* Price tag */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/95 text-emerald-400 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-800">
                      Ksh {prop.price.toLocaleString()}{prop.type === 'rent' || prop.type === 'hostel' ? '/mo' : ''}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono uppercase font-semibold">
                        <span>{prop.location}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{prop.type}</span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-white tracking-tight leading-snug mt-1.5 line-clamp-1">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {prop.description}
                      </p>
                    </div>

                    {/* Specs / Icons row */}
                    {prop.type !== 'land' && (
                      <div className="flex gap-4 border-t border-slate-850 pt-3 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-500" /> {prop.bedrooms === 0 ? 'Bedsitter' : `${prop.bedrooms} Bed`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-500" /> {prop.bathrooms} Bath
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Views & CTA row */}
                  <div className="bg-slate-950/60 border-t border-slate-850 px-4.5 py-3 flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-600" /> {prop.views} views
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      Inspect Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </motion.div>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
                <h4 className="font-bold text-white text-sm">No Matching Properties Found</h4>
                <p className="text-xs text-slate-500 mt-1">Adjust your budget or keywords (try "Kilimani" or "Juja Farm").</p>
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

      </main>

      {/* PROPERTY DETAIL FULL DIALOG */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden my-8"
            >
              {/* Image Grid Hero */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-950 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title} 
                />
                
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white rounded-full backdrop-blur transition-colors"
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
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2.5 py-1 rounded">
                      {selectedProperty.location}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-2.5">
                      {selectedProperty.title}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedProperty.description}
                  </p>

                  <div className="border-t border-slate-800/80 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Amenities Include:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-slate-950 border border-slate-850 text-slate-300 text-xs px-3.5 py-1.5 rounded-xl font-mono">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Agent Contact column */}
                <div className="md:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block mb-1">TOTAL BOOKING COST</span>
                    <p className="text-2xl font-bold font-mono text-emerald-400">
                      Ksh {selectedProperty.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">Held securely in M-Pesa Escrow wallet</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                    <div className="flex items-center space-x-3">
                      <img className="w-8 h-8 rounded-full" src={selectedProperty.host.avatar} alt="Agent Profile" />
                      <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-1">
                          {selectedProperty.host.name}
                          {selectedProperty.host.isVerified && <span className="text-emerald-400">✓</span>}
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
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl my-8"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white">List Your Property (Scam-free Platform)</h3>
                <button onClick={() => setShowAddListing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Property Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Elegant Bedsitter"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Kenyan Location / Estate</label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
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
                    <label className="text-slate-400 block mb-1">Category type</label>
                    <select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="rent">To Rent</option>
                      <option value="sale">For Sale</option>
                      <option value="land">Agricultural Land / Plot</option>
                      <option value="hostel">Student Hostel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Price (Ksh)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {newPropType !== 'land' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Bedrooms</label>
                      <select
                        value={newBedrooms}
                        onChange={(e) => setNewBedrooms(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="0">Bedsitter / Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Bathrooms</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newBathrooms}
                        onChange={(e) => setNewBathrooms(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-slate-400 block mb-1">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter specific notes about borehole water, backup generators, security fences..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 h-20 font-sans resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddListing(false)}
                    className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/50 rounded-3xl p-8 max-w-sm w-full text-center text-white shadow-2xl relative overflow-hidden"
            >
              {/* Decorative light */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>

              <Award className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold mb-1 text-white">🎉 REPUTATION LEVEL UP!</h3>
              <p className="text-xs text-slate-400 mb-4">You have advanced your landlord-tenant score on the Makao Network!</p>
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 mb-6">
                <span className="text-[10px] text-slate-500 font-mono block">NEW REPUTATION LEVEL</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">{userLevel}</span>
              </div>

              <button
                onClick={() => setShowLevelUp(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-8 rounded-xl text-xs"
              >
                Awesome! Continue Exploring
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
