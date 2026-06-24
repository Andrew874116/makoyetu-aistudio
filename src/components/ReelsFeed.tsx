import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Camera, Eye, Sparkles, ExternalLink, Send, ArrowUp, ArrowDown } from 'lucide-react';
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
    setScreenshotSuccess("Capture success! Floor plan outline and property metadata saved to device gallery.");
    setTimeout(() => setScreenshotSuccess(null), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this verified property on Makao Yetu reels: ${activeReel.propertyTitle} (${activeReel.propertyPrice})! View it here!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const submitInquiry = () => {
    onInquireReel(activeReel.propertyId, inquiryText);
    setShowInquirePopup(false);
    alert(`Inquiry sent to ${matchingProperty?.host.name || 'Agent'}! Your chat room has been initialized.`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="text-amber-400 w-6 h-6" /> Makao Walkthrough Reels
        </h2>
        <p className="text-sm text-slate-400">
          Experience real properties with video tours, interactive floor-plan screenshot tools, and instant scam-free verification overlays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Main Reel Video Player Simulator (Columns 1-7) */}
        <div className="md:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden aspect-[9/16] max-h-[640px] flex items-center justify-center">
          
          {/* Simulated Video Feed Player using React Video Player or high-quality styled placeholders with CSS animation */}
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
              <p className="text-slate-400 font-medium">Reel Video Loading...</p>
            </div>
          )}

          {/* Dark Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>

          {/* Verification Watermark */}
          {matchingProperty?.isVerified && (
            <div className="absolute top-4 left-4 bg-emerald-600/90 text-white font-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold backdrop-blur">
              ✓ MAKAO VERIFIED
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
            <p className="text-xs text-slate-300 line-clamp-2">
              {activeReel.title}
            </p>
          </div>

          {/* Navigation Overlay Buttons (Left and Right arrows inside vertical rail) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-3 flex flex-col gap-2">
            <button
              onClick={handlePrevReel}
              className="p-2 bg-black/60 text-white rounded-full border border-slate-700/50 hover:bg-black/90 transition-all"
              title="Previous Walkthrough"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextReel}
              className="p-2 bg-black/60 text-white rounded-full border border-slate-700/50 hover:bg-black/90 transition-all"
              title="Next Walkthrough"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Interaction Buttons */}
          <div className="absolute bottom-5 right-4 flex flex-col items-center space-y-4">
            {/* Liker */}
            <div className="flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 1.3 }}
                onClick={() => onLikeReel(activeReel.id)}
                className={`p-3 rounded-full backdrop-blur border shadow-md transition-all ${
                  activeReel.isLiked
                    ? 'bg-red-500 border-red-400 text-white'
                    : 'bg-black/60 border-slate-700/50 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5" fill={activeReel.isLiked ? "currentColor" : "none"} />
              </motion.button>
              <span className="text-[10px] text-slate-300 font-semibold font-mono mt-1">{activeReel.likes}</span>
            </div>

            {/* Inquirer */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowInquirePopup(true)}
                className="p-3 bg-black/60 border border-slate-700/50 text-slate-300 hover:text-white rounded-full backdrop-blur shadow-md transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-300 font-semibold font-mono mt-1">Inquire</span>
            </div>

            {/* Screenshooter */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleScreenshot}
                className="p-3 bg-black/60 border border-slate-700/50 text-slate-300 hover:text-white rounded-full backdrop-blur shadow-md transition-all"
                title="Capture floor plan blueprint"
              >
                <Camera className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-300 font-semibold font-mono mt-1">Capture</span>
            </div>

            {/* WhatsApp Share */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleShareWhatsApp}
                className="p-3 bg-black/60 border border-slate-700/50 text-emerald-400 hover:text-emerald-300 rounded-full backdrop-blur shadow-md transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-300 font-semibold font-mono mt-1">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Info & Floor Plan Inspector panel (Columns 8-12) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-1.5 text-white">
              <Eye className="w-5 h-5 text-emerald-400" /> Property Overview
            </h3>

            {matchingProperty ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <img
                    className="w-12 h-12 rounded-lg object-cover"
                    src={matchingProperty.image}
                    alt={matchingProperty.title}
                  />
                  <div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded">
                      {matchingProperty.location}
                    </span>
                    <h5 className="text-xs font-bold font-sans text-white mt-1 line-clamp-1">{matchingProperty.title}</h5>
                    <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">Ksh {matchingProperty.price.toLocaleString()}/mo</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-medium">Verified Agent Details:</p>
                  <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={matchingProperty.host.avatar}
                      alt={matchingProperty.host.name}
                    />
                    <div>
                      <h6 className="text-xs font-bold text-white flex items-center gap-1">
                        {matchingProperty.host.name}
                        {matchingProperty.host.isVerified && <span className="text-emerald-400 text-[10px]">✓</span>}
                      </h6>
                      <p className="text-[10px] text-slate-400">{matchingProperty.host.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1.5">Amenities Highlighted in Tour:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingProperty.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded font-mono">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Property metadata unavailable.</p>
            )}
          </div>

          {/* Interactive Captured Blueprint Mock / Blueprint Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex-1 flex flex-col justify-between shadow-lg">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-emerald-400" /> Walkthrough Blueprint Board
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Tap "Capture" on the reel to capture and analyze the real-time layout structure of this verified property.
              </p>

              {screenshotSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border-2 border-dashed border-emerald-500/40 bg-emerald-950/20 p-4 rounded-xl flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-24 h-16 bg-emerald-900/40 rounded border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-mono text-[9px]">
                    FLOOR_PLAN_VERIFIED
                  </div>
                  <span className="text-xs text-emerald-300 font-mono font-medium">Layout captured successfully!</span>
                  <p className="text-[10px] text-slate-400">Blueprint verification code: MY-PLAN-{Math.floor(1000 + Math.random() * 9000)}</p>
                </motion.div>
              ) : (
                <div className="border border-dashed border-slate-800 bg-slate-950/60 p-6 rounded-xl flex flex-col items-center justify-center text-center text-slate-500">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="text-xs">No blueprint captured yet</span>
                  <p className="text-[10px] text-slate-600 mt-1">Use camera button to generate structure</p>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-3 text-center">
              <span className="text-xs text-slate-400">Currently viewing: </span>
              <span className="text-xs font-bold font-mono text-emerald-400">REEL {currentReelIndex + 1} OF {reels.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Dialog Modal */}
      <AnimatePresence>
        {showInquirePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-2">Inquire about {activeReel.propertyTitle}</h3>
              <p className="text-xs text-slate-400 mb-4">
                This inquiry will automatically set up a real-time secure messaging room with the listing agent: **{matchingProperty?.host.name}**.
              </p>

              <textarea
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 mb-4 h-24 font-sans resize-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowInquirePopup(false)}
                  className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={submitInquiry}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
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
