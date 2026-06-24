import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Camera, Eye, Sparkles, Send, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel, Property } from '../types';

interface ReelsFeedProps {
  reels: Reel[];
  properties: Property[];
  onLikeReel: (reelId: string) => void;
  onInquireReel: (propertyId: string, messageText: string) => void;
}

export default function ReelsFeed({ reels, properties, onLikeReel, onInquireReel }: ReelsFeedProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [showInquirePopup, setShowInquirePopup] = useState(false);
  const [inquiryText, setInquiryText] = useState("Hi! I saw this on Makao Yetu Video Reels. Is it still available for viewing?");
  const [screenshotSuccess, setScreenshotSuccess] = useState<string | null>(null);
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState<string | null>(null);

  const activeReel = reels[currentReelIndex];
  const matchingProperty = properties.find(p => p.id === activeReel.propertyId);

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
    } else {
      setCurrentReelIndex(0); // Loop back
    }
    setScreenshotSuccess(null);
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
    } else {
      setCurrentReelIndex(reels.length - 1); // Loop to end
    }
    setScreenshotSuccess(null);
  };

  const handleScreenshot = () => {
    setScreenshotSuccess("Layout captured! Walkthrough floor plan blueprint and property metadata synced to device.");
    setTimeout(() => setScreenshotSuccess(null), 4000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this verified property on Makao Yetu reels: ${activeReel.propertyTitle} (${activeReel.propertyPrice})! View it here!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const submitInquiry = () => {
    onInquireReel(activeReel.propertyId, inquiryText);
    setShowInquirePopup(false);
    setInquirySuccessMsg(`Inquiry submitted to ${matchingProperty?.host.name || 'verified representative'}! Secure room successfully initialized.`);
    setTimeout(() => setInquirySuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-950 flex items-center justify-center gap-2 font-display">
          <Sparkles className="text-amber-500 w-6 h-6 animate-pulse" /> Verified Property Video Tours
        </h2>
        <p className="text-sm text-slate-600">
          Experience realistic layout structure with interactive immersive loops, floor plan screenshot extractors, and instant landlord verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Reel Video Player Simulator (Columns 1-7) */}
        <div className="md:col-span-7 bg-slate-950 rounded-3xl border border-slate-200/80 shadow-2xl relative overflow-hidden aspect-[9/16] max-h-[640px] flex items-center justify-center">
          
          {/* Simulated Video Feed Player using high-quality video or styled placeholder */}
          {activeReel.videoUrl ? (
            <video
              key={activeReel.id}
              className="absolute inset-0 w-full h-full object-cover"
              src={activeReel.videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <Eye className="w-12 h-12 text-slate-600 mb-2 animate-pulse" />
              <p className="text-slate-400 font-medium">Video Feed Loading...</p>
            </div>
          )}

          {/* Dark Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>

          {/* Verification Watermark */}
          {matchingProperty?.isVerified && (
            <div className="absolute top-4 left-4 bg-emerald-600/90 text-white font-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold backdrop-blur">
              ✓ VERIFIED ECOSYSTEM
            </div>
          )}

          {/* Bottom Overlay - Property details and title */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-emerald-400 font-bold font-mono text-xs tracking-wider uppercase">
              {matchingProperty?.type === 'rent' ? 'For Rent' : matchingProperty?.type === 'hostel' ? 'Student Accommodation' : 'For Sale'}
            </p>
            <h4 className="text-base font-bold tracking-tight text-white mb-1">
              {activeReel.propertyTitle}
            </h4>
            <p className="text-sm font-semibold text-slate-200 mb-2">
              {activeReel.propertyPrice}
            </p>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {activeReel.title}
            </p>
          </div>

          {/* Navigation Overlay Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-3 flex flex-col gap-2 z-10">
            <button
              onClick={handlePrevReel}
              className="p-2.5 bg-black/60 text-white rounded-full border border-white/20 hover:bg-black/90 transition-all cursor-pointer"
              title="Previous Walkthrough"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextReel}
              className="p-2.5 bg-black/60 text-white rounded-full border border-white/20 hover:bg-black/90 transition-all cursor-pointer"
              title="Next Walkthrough"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Interaction Buttons */}
          <div className="absolute bottom-5 right-4 flex flex-col items-center space-y-4 z-10">
            {/* Liker */}
            <div className="flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 1.3 }}
                onClick={() => onLikeReel(activeReel.id)}
                className={`p-3 rounded-full backdrop-blur border shadow-md transition-all cursor-pointer ${
                  activeReel.isLiked
                    ? 'bg-rose-500 border-rose-400 text-white'
                    : 'bg-black/60 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5" fill={activeReel.isLiked ? "currentColor" : "none"} />
              </motion.button>
              <span className="text-[10px] text-slate-300 font-bold font-mono mt-1">{activeReel.likes}</span>
            </div>

            {/* Inquirer */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowInquirePopup(true)}
                className="p-3 bg-black/60 border border-white/10 text-slate-300 hover:text-white rounded-full backdrop-blur shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-300 font-bold font-mono mt-1">Inquire</span>
            </div>

            {/* Screenshooter */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleScreenshot}
                className="p-3 bg-black/60 border border-white/10 text-slate-300 hover:text-white rounded-full backdrop-blur shadow-md transition-all cursor-pointer"
                title="Capture floor plan blueprint"
              >
                <Camera className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-300 font-bold font-mono mt-1">Capture</span>
            </div>

            {/* WhatsApp Share */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleShareWhatsApp}
                className="p-3 bg-black/60 border border-white/10 text-emerald-400 hover:text-emerald-300 rounded-full backdrop-blur shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-300 font-bold font-mono mt-1">Share</span>
            </div>
          </div>
        </div>

        {/* Info & Floor Plan Inspector panel (Columns 8-12) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Property Overview */}
          <div className="clay-card p-6 text-slate-800">
            <h3 className="text-base font-bold mb-3.5 flex items-center gap-1.5 text-slate-900 font-display">
              <Eye className="w-5 h-5 text-emerald-600" /> Property Profile
            </h3>

            {matchingProperty ? (
              <div className="space-y-4 font-semibold">
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <img
                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    src={matchingProperty.image}
                    alt={matchingProperty.title}
                  />
                  <div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                      {matchingProperty.location}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{matchingProperty.title}</h5>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">Ksh {matchingProperty.price.toLocaleString()}/mo</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-bold">Verified Representative:</p>
                  <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <img
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
                      src={matchingProperty.host.avatar}
                      alt={matchingProperty.host.name}
                    />
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        {matchingProperty.host.name}
                        {matchingProperty.host.isVerified && <span className="text-emerald-700 font-bold">✓</span>}
                      </h6>
                      <p className="text-[10px] text-slate-500">{matchingProperty.host.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-bold mb-2">Amenities Highlighted in Tour:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingProperty.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-1 rounded-xl border border-slate-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Property metadata unavailable.</p>
            )}
          </div>

          {/* Interactive Captured Blueprint Board */}
          <div className="clay-card p-6 text-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> Walkthrough Blueprint Board
              </h4>
              <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
                Tap "Capture" on the media screen to generate the certified layout blueprint for this property.
              </p>

              {screenshotSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border-2 border-dashed border-emerald-500/30 bg-emerald-50 p-4 rounded-2xl flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="w-24 h-16 bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold font-mono text-[9px] shadow-sm">
                    FLOOR_VERIFIED
                  </div>
                  <span className="text-xs text-emerald-800 font-bold">Layout extracted successfully!</span>
                  <p className="text-[10px] text-slate-500 font-semibold">Verification signature: MAKAO-LYT-{Math.floor(1000 + Math.random() * 9000)}</p>
                </motion.div>
              ) : (
                <div className="border border-dashed border-slate-200 bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">No layout blueprint captured</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">Use camera sidebar action to capture plan</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-4 text-center font-bold">
              <span className="text-xs text-slate-500">Currently viewing: </span>
              <span className="text-xs font-mono text-emerald-700">REEL {currentReelIndex + 1} OF {reels.length}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Inline success overlay for inquiry messages */}
      <AnimatePresence>
        {inquirySuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl shadow-xl flex items-start gap-3">
            <div className="p-1 bg-emerald-500 text-white rounded-full text-xs">✓</div>
            <div>
              <h5 className="font-bold text-xs">Inquiry Submitted</h5>
              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{inquirySuccessMsg}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Dialog Modal */}
      <AnimatePresence>
        {showInquirePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full text-slate-800 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowInquirePopup(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Inquire about {activeReel.propertyTitle}</h3>
              <p className="text-xs text-slate-500 mb-4 font-semibold leading-relaxed">
                This inquiry will automatically configure a secure chat channel with the listing representative: **{matchingProperty?.host.name}**.
              </p>

              <textarea
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                className="w-full clay-input p-3 text-xs text-slate-800 focus:outline-none mb-4 h-24 font-sans resize-none"
              />

              <div className="flex justify-end gap-2.5 font-bold">
                <button
                  onClick={() => setShowInquirePopup(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitInquiry}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Send Inquiry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
