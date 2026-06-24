import React, { useState } from 'react';
import { Map, Layers, Navigation, Info, Compass, Sparkles, Check, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Property } from '../types';

interface PropertyMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

interface EstateZone {
  name: string;
  x: number; // percentage
  y: number;
  waterStatus: string;
  powerStatus: string;
  medianPrice: string;
}

export default function PropertyMap({ properties, onSelectProperty }: PropertyMapProps) {
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [selectedEstate, setSelectedEstate] = useState<EstateZone | null>(null);
  const [pinnedCoordinates, setPinnedCoordinates] = useState<{ x: number, y: number } | null>(null);
  
  // Land Acreage Calculator points
  const [calcPoints, setCalcPoints] = useState<{ x: number, y: number }[]>([]);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);

  // Nairobi Estates positions
  const estates: EstateZone[] = [
    { name: 'Westlands', x: 25, y: 35, waterStatus: 'Reliable (95%)', powerStatus: 'Backup required (80%)', medianPrice: 'Ksh 45,000' },
    { name: 'Kilimani', x: 28, y: 55, waterStatus: 'Borehole backed (90%)', powerStatus: 'Reliable (90%)', medianPrice: 'Ksh 35,000' },
    { name: 'Kileleshwa', x: 20, y: 48, waterStatus: 'Continuous (92%)', powerStatus: 'Reliable (85%)', medianPrice: 'Ksh 40,000' },
    { name: 'Roysambu', x: 65, y: 22, waterStatus: 'Rationed (65%)', powerStatus: 'Reliable (92%)', medianPrice: 'Ksh 15,000' },
    { name: 'Zimmerman', x: 70, y: 15, waterStatus: 'Rationed (60%)', powerStatus: 'Rationed (75%)', medianPrice: 'Ksh 9,000' },
    { name: 'Juja Farm', x: 88, y: 30, waterStatus: 'Borehole active (85%)', powerStatus: 'Power lines active (80%)', medianPrice: 'Ksh 1.8M (Plot)' },
  ];

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    // If in land calculator mode, append to polygon points
    if (calcPoints.length < 5) {
      const newPoints = [...calcPoints, { x, y }];
      setCalcPoints(newPoints);
      if (newPoints.length >= 3) {
        // Shoelace formula simulation for grid area in acres
        let simulatedAcreage = (newPoints.length * 0.12).toFixed(2);
        setCalculatedArea(parseFloat(simulatedAcreage));
      }
    } else {
      // Pin coordinates for new property listing
      setPinnedCoordinates({ x, y });
    }
  };

  const clearCalculator = () => {
    setCalcPoints([]);
    setCalculatedArea(null);
  };

  // Get matching properties for selected estate
  const getPropertiesForEstate = (estateName: string) => {
    return properties.filter(p => p.location.toLowerCase().includes(estateName.toLowerCase()));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-950 flex items-center justify-center gap-2 font-display">
          <Map className="text-emerald-600 w-6 h-6 animate-pulse" /> Interactive Property Ecosystem Map
        </h2>
        <p className="text-sm text-slate-600">
          Geospatial analysis of Nairobi's premier estates. Check water/power utility reliability index and plot acreage outlines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel (Columns 1-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Map Controls */}
          <div className="clay-card p-6 text-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Utility Overlays
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                onClick={() => setMapMode('standard')}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mapMode === 'standard' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15' : 'bg-slate-100 text-slate-600 hover:text-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Vector Plan
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mapMode === 'satellite' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15' : 'bg-slate-100 text-slate-600 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Satellite View
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5 font-semibold">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Renting</span>
                <span className="text-slate-800">Kilimani, Westlands</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Land Plots</span>
                <span className="text-slate-800">Juja Farm, Ngong</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Hostels</span>
                <span className="text-slate-800">Roysambu, USIU</span>
              </div>
            </div>
          </div>

          {/* Interactive Acreage Calculator */}
          <div className="clay-card p-6 text-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> GPS Boundary Walk Planner
            </h3>
            <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
              Tap up to 5 coordinates on the map to define a plot boundary and calculate estimated acreage instantly.
            </p>

            {calcPoints.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 shadow-inner font-semibold">
                  <p className="text-slate-500">Boundary Beacons: <span className="text-emerald-700 font-bold">{calcPoints.length} set</span></p>
                  {calculatedArea !== null && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-bold">Calculated Land Area:</span>
                      <span className="text-lg font-bold text-amber-600">{calculatedArea} Acres</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={clearCalculator}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
                >
                  Reset Beacons
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-semibold">
                Tap on the map grid to place beacon markers
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Vector Map Canvas (Columns 5-12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="relative bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-lg h-[460px] cursor-crosshair">
            
            {/* Satellite Mode Background vs Standard Plan Mode Grid */}
            {mapMode === 'satellite' ? (
              <div className="absolute inset-0 bg-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-20 border border-emerald-500/10 rounded-full animate-pulse pointer-events-none"></div>
                <div className="absolute inset-40 border border-emerald-500/10 rounded-full pointer-events-none"></div>
                {/* Simulated Green Hills / Road Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,200 Q 150,120 300,220 T 600,180 T 900,240" fill="none" stroke="#059669" strokeWidth="15" />
                  <path d="M 100,0 Q 250,180 120,380 T 400,500" fill="none" stroke="#94a3b8" strokeWidth="8" />
                  <path d="M 450,0 Q 400,200 500,320 T 900,400" fill="none" stroke="#94a3b8" strokeWidth="12" />
                </svg>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#f8fafc]">
                {/* Standard Blue-Tech Vector Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-65"></div>
                {/* Roads lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Thika Road */}
                  <line x1="50" y1="0" x2="85" y2="100" stroke="#cbd5e1" strokeWidth="20" />
                  <line x1="50" y1="0" x2="85" y2="100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
                  {/* Ngong Road */}
                  <line x1="0" y1="50" x2="100" y2="65" stroke="#cbd5e1" strokeWidth="16" />
                  {/* Waiyaki Way */}
                  <line x1="10" y1="10" x2="90" y2="30" stroke="#cbd5e1" strokeWidth="24" />
                </svg>
              </div>
            )}

            {/* Click Handler Overlay */}
            <div className="absolute inset-0" onClick={handleMapClick}></div>

            {/* Render Acreage Boundary Polygon Lines */}
            {calcPoints.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polygon
                  points={calcPoints.map(p => `${(p.x / 100) * 800},${(p.y / 100) * 460}`).join(' ')}
                  fill="rgba(16, 185, 129, 0.12)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                />
              </svg>
            )}

            {/* Render Acreage Boundary Points */}
            {calcPoints.map((pt, idx) => (
              <div
                key={idx}
                className="absolute w-3.5 h-3.5 bg-emerald-600 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-md"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] font-bold px-1 py-0.5 rounded text-white whitespace-nowrap shadow-sm">
                  P{idx + 1}
                </span>
              </div>
            ))}

            {/* Nairobi Estate Markers */}
            {estates.map((est, idx) => {
              const active = selectedEstate?.name === est.name;
              return (
                <div
                  key={idx}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-105 transition-all"
                  style={{ left: `${est.x}%`, top: `${est.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent pinning coord triggers
                    setSelectedEstate(est);
                  }}
                >
                  <div className={`relative flex items-center justify-center px-3.5 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap shadow-md ${
                    active 
                      ? 'bg-amber-500 border border-white text-slate-950 scale-105 z-20 shadow-lg shadow-amber-500/25' 
                      : 'bg-white border border-slate-200 text-slate-800 hover:border-emerald-400'
                  }`}>
                    {/* Color-Coded Mini Pin Dot */}
                    <span className={`w-2 h-2 rounded-full mr-1.5 inline-block ${
                      est.name === 'Juja Farm' ? 'bg-green-500' :
                      est.name === 'Westlands' ? 'bg-purple-500' :
                      est.name === 'Roysambu' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></span>
                    {est.name}
                  </div>
                </div>
              );
            })}

            {/* User Pinned Property simulated coordinate */}
            {pinnedCoordinates && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce"
                style={{ left: `${pinnedCoordinates.x}%`, top: `${pinnedCoordinates.y}%` }}
              >
                <div className="bg-rose-600 border-2 border-white text-white py-1.5 px-3 rounded-2xl text-[10px] font-bold flex items-center gap-1 shadow-lg shadow-rose-600/10">
                  <Navigation className="w-3 h-3 text-white fill-white rotate-45" /> Live Pin: {pinnedCoordinates.x}°S, {pinnedCoordinates.y}°E
                </div>
              </div>
            )}

            {/* Compass Rose Icon */}
            <div className="absolute top-4 right-4 bg-white border border-slate-200/80 p-2.5 rounded-2xl flex flex-col items-center justify-center pointer-events-none text-slate-500 shadow-sm">
              <Compass className="w-7 h-7 text-emerald-600" />
              <span className="text-[8px] font-bold mt-1 text-slate-400">NAIROBI V.P.</span>
            </div>

            {/* Interactive instructions bottom overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 pointer-events-none text-center shadow-md">
              🎯 Tap estates for safety alerts or tap grid to measure land acreage
            </div>
          </div>

          {/* Expanded Selected Estate Details Banner */}
          {selectedEstate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-800 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3.5 mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5 font-display">
                    {selectedEstate.name} Estate Profile
                  </h4>
                  <p className="text-xs text-slate-500">Official housing utility stats & safety indicators</p>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Median Estate Rent:</span>
                  <span className="text-lg font-bold text-emerald-600">{selectedEstate.medianPrice}/mo</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-semibold">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">💧 Water Reliability</span>
                  <span className="text-xs text-slate-700">{selectedEstate.waterStatus}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">⚡ KPLC Blackout Score</span>
                  <span className="text-xs text-slate-700">{selectedEstate.powerStatus}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">📋 Matching Verified Listings</span>
                  <span className="text-xs text-amber-600">
                    {getPropertiesForEstate(selectedEstate.name).length} Homes Available
                  </span>
                </div>
              </div>

              {getPropertiesForEstate(selectedEstate.name).length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-3">View verified listings in {selectedEstate.name}:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getPropertiesForEstate(selectedEstate.name).map((prop) => (
                      <div
                        key={prop.id}
                        onClick={() => onSelectProperty(prop)}
                        className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl cursor-pointer transition-colors"
                      >
                        <img className="w-11 h-11 object-cover rounded-xl shadow-sm" src={prop.image} alt={prop.title} />
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{prop.title}</p>
                          <span className="text-[10px] text-emerald-700 font-bold">Ksh {prop.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
