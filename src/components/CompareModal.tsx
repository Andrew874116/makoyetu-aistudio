import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Minus, MessageSquare, PhoneCall, ShieldCheck, ShieldAlert, Star, Eye, Heart } from 'lucide-react';
import { Property } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onInquire: (propertyTitle: string) => void;
}

export default function CompareModal({ isOpen, onClose, properties, onInquire }: CompareModalProps) {
  if (!isOpen) return null;

  // Gather all unique amenities across the compared properties for a nice grid matrix
  const allUniqueAmenities = Array.from(
    new Set(properties.flatMap(p => p.amenities || []))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                📊 Property Comparison Board
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                Comparing {properties.length} of {properties.length} selected listings side-by-side
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content (Scrollable table/cards) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:divide-x dark:divide-slate-850">
              
              {/* Feature labels (Left Col on Desktop) */}
              <div className="hidden md:flex flex-col justify-between pr-4 pt-[180px] space-y-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="h-[52px] flex items-center">Price & Rent</div>
                <div className="h-[44px] flex items-center">Location</div>
                <div className="h-[44px] flex items-center">Category</div>
                <div className="h-[44px] flex items-center">Rooms / Specs</div>
                <div className="h-[44px] flex items-center">Scam Verification</div>
                <div className="h-[44px] flex items-center">Popularity</div>
                <div className="h-[52px] flex items-center">Direct Host</div>
              </div>

              {/* Property columns */}
              {properties.map((prop) => (
                <div key={prop.id} className="space-y-6 text-xs font-semibold px-2">
                  
                  {/* Visual Header */}
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800">
                      <img src={prop.image} className="w-full h-full object-cover" alt={prop.title} />
                      {prop.isVerified && (
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded">
                          ✓ SECURE
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-sm tracking-tight" title={prop.title}>
                      {prop.title}
                    </h3>
                  </div>

                  {/* Feature values side-by-side */}
                  <div className="space-y-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 pt-4 md:pt-0">
                    
                    {/* Price */}
                    <div className="h-auto md:h-[52px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Price</span>
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">
                        Ksh {prop.price.toLocaleString()}
                        <span className="text-[10px] font-semibold text-slate-400">
                          {prop.type === 'rent' || prop.type === 'hostel' ? '/mo' : ''}
                        </span>
                      </span>
                    </div>

                    {/* Location */}
                    <div className="h-auto md:h-[44px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Location</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{prop.location}</span>
                    </div>

                    {/* Category type */}
                    <div className="h-auto md:h-[44px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Category</span>
                      <span className="capitalize text-indigo-600 dark:text-indigo-400 font-bold">{prop.type}</span>
                    </div>

                    {/* Bedrooms / Bathrooms */}
                    <div className="h-auto md:h-[44px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Rooms</span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {prop.type === 'land' ? (
                          'Agricultural land'
                        ) : (
                          `${prop.bedrooms === 0 ? 'Bedsitter' : `${prop.bedrooms} Bed`} / ${prop.bathrooms} Bath`
                        )}
                      </span>
                    </div>

                    {/* Security Verification */}
                    <div className="h-auto md:h-[44px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Security</span>
                      {prop.isVerified ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Borehole & Title Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <ShieldAlert className="w-4 h-4" /> Pending Site Survey
                        </span>
                      )}
                    </div>

                    {/* Rating / Views */}
                    <div className="h-auto md:h-[44px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Popularity</span>
                      <div className="flex items-center gap-3 text-slate-500 font-mono">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {prop.rating}
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Eye className="w-3.5 h-3.5" /> {prop.views}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-rose-500">
                          <Heart className="w-3.5 h-3.5 fill-current" /> {prop.likes}
                        </span>
                      </div>
                    </div>

                    {/* Contact Host */}
                    <div className="h-auto md:h-[52px] flex flex-col justify-center">
                      <span className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Host</span>
                      <div className="flex items-center gap-2">
                        <img src={prop.host.avatar} className="w-7 h-7 rounded-full object-cover border" alt={prop.host.name} />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-[10px] leading-tight">{prop.host.name}</span>
                          <a href={`tel:${prop.host.phone}`} className="text-[9.5px] text-slate-400 hover:underline">
                            {prop.host.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Amenity Difference Matrix Grid */}
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                ⚡ Detailed Amenity Difference Grid
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {allUniqueAmenities.map((amenity) => (
                  <div key={amenity} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 text-xs items-center">
                    <span className="font-bold text-slate-600 dark:text-slate-400 pr-2">{amenity}</span>
                    
                    {properties.map((prop) => {
                      const hasAmenity = prop.amenities?.includes(amenity);
                      return (
                        <div key={prop.id + amenity} className="flex items-center md:justify-start">
                          <span className="md:hidden text-[10px] text-slate-400 mr-2 font-semibold">
                            {prop.title}:
                          </span>
                          {hasAmenity ? (
                            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Included
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 dark:bg-slate-900/80 dark:text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-medium flex items-center gap-1">
                              <Minus className="w-3.5 h-3.5" /> N/A
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer CTAs */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3 justify-end items-center">
            <span className="text-[10px] text-slate-500 font-semibold text-center sm:text-left">
              Send an automated tour query to any property landlord instantly.
            </span>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
              {properties.map((prop, idx) => (
                <button
                  key={prop.id + '-btn'}
                  onClick={() => {
                    onInquire(prop.title);
                    onClose();
                  }}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                >
                  Book #{idx + 1}
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
