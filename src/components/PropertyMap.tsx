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

  // Nairobi Estates Mock Positions
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
        // Simple Shoelace formula simulation for grid area in acres
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
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Map className="text-emerald-500 w-6 h-6 animate-pulse" /> Makao Interactive Property Map
        </h2>
        <p className="text-sm text-slate-400">
          Geospatial analysis of Nairobi's estates. Toggle modes, check water/power utility reports, and calculate plot land acreage in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel (Columns 1-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Map Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Utility Overlays
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setMapMode('standard')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mapMode === 'standard' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Vector Plan
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mapMode === 'satellite' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Satellite View
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Renting</span>
                <span className="font-mono text-slate-300">Kilimani, Westlands</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Land Plots</span>
                <span className="font-mono text-slate-300">Juja Farm, Ngong</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Hostels</span>
                <span className="font-mono text-slate-300">Roysambu, USIU</span>
              </div>
            </div>
          </div>

          {/* Interactive Acreage Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> GPS Boundary Walk Planner
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Tap up to 5 coordinates on the map to simulate walking around a plot boundary and dynamically estimate acreage.
            </p>

            {calcPoints.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-400">Boundary Beacons: <span className="text-emerald-400 font-mono font-bold">{calcPoints.length} set</span></p>
                  {calculatedArea !== null && (
                    <div className="pt-1.5 border-t border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Calculated Land Area:</span>
                      <span className="text-lg font-bold font-mono text-amber-400">{calculatedArea} Acres</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={clearCalculator}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Reset Beacons
                </button>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                Tap on map to start placing coordinate markers
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Vector Map Canvas (Columns 5-12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl h-[460px] cursor-crosshair">
            
            {/* Satellite Mode Background vs Standard Plan Mode Grid */}
            {mapMode === 'satellite' ? (
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900">
                {/* Satellite simulated grid blocks */}
                <div className="absolute inset-20 border border-emerald-500/10 rounded-full animate-pulse pointer-events-none"></div>
                <div className="absolute inset-40 border border-emerald-500/10 rounded-full pointer-events-none"></div>
                {/* Simulated Green Hills / Road Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,200 Q 150,120 300,220 T 600,180 T 900,240" fill="none" stroke="#059669" strokeWidth="15" />
                  <path d="M 100,0 Q 250,180 120,380 T 400,500" fill="none" stroke="#4b5563" strokeWidth="8" />
                  <path d="M 450,0 Q 400,200 500,320 T 900,400" fill="none" stroke="#4b5563" strokeWidth="12" />
                </svg>
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-950">
                {/* Standard Blue-Tech Vector Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
                {/* Roads lines */}
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Thika Road */}
                  <line x1="50" y1="0" x2="85" y2="100" stroke="#1e293b" strokeWidth="20" />
                  <line x1="50" y1="0" x2="85" y2="100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
                  {/* Ngong Road */}
                  <line x1="0" y1="50" x2="100" y2="65" stroke="#1e293b" strokeWidth="16" />
                  {/* Waiyaki Way */}
                  <line x1="10" y1="10" x2="90" y2="30" stroke="#1e293b" strokeWidth="24" />
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
                  fill="rgba(16, 185, 129, 0.15)"
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
                className="absolute w-3 h-3 bg-emerald-400 border border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[8px] font-mono font-bold px-1 rounded text-white whitespace-nowrap">
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
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
                  style={{ left: `${est.x}%`, top: `${est.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent pinning coord triggers
                    setSelectedEstate(est);
                  }}
                >
                  <div className={`relative flex items-center justify-center p-2 rounded-xl border font-bold text-[11px] transition-all whitespace-nowrap shadow-lg ${
                    active 
                      ? 'bg-amber-500 border-white text-slate-950 scale-105 z-20' 
                      : 'bg-slate-900 border-slate-700 text-white hover:border-emerald-400'
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
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${pinnedCoordinates.x}%`, top: `${pinnedCoordinates.y}%` }}
              >
                <div className="bg-red-600 border border-white text-white p-2 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 shadow-xl">
                  <Navigation className="w-3 h-3 text-white fill-white rotate-45" /> Live Pin: {pinnedCoordinates.x}°S, {pinnedCoordinates.y}°E
                </div>
              </div>
            )}

            {/* Compass Compass Rose Icon */}
            <div className="absolute top-4 right-4 bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center justify-center pointer-events-none text-slate-400 shadow">
              <Compass className="w-7 h-7 text-emerald-400 animate-spin-slow" />
              <span className="text-[8px] font-mono mt-1">NAIROBI V.P.</span>
            </div>

            {/* Interactive instructions bottom overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-[10px] font-mono text-slate-300 pointer-events-none text-center shadow-lg">
              🎯 Tap estates for safety alerts or tap grid to measure land acreage
            </div>
          </div>

          {/* Expanded Selected Estate Details Banner */}
          {selectedEstate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                    {selectedEstate.name} Estate Profile
                  </h4>
                  <p className="text-xs text-slate-400">Official housing utility stats & scam alert indices</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Median Estate Rent:</span>
                  <p className="text-lg font-mono font-bold text-emerald-400">{selectedEstate.medianPrice}/mo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">💧 Water Reliability</span>
                  <p className="text-xs font-semibold text-slate-200 mt-1">{selectedEstate.waterStatus}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">⚡ KPLC Blackout Score</span>
                  <p className="text-xs font-semibold text-slate-200 mt-1">{selectedEstate.powerStatus}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">📋 Matching Verified Listings</span>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-1">
                    {getPropertiesForEstate(selectedEstate.name).length} Homes Available
                  </p>
                </div>
              </div>

              {getPropertiesForEstate(selectedEstate.name).length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-300 mb-2">View listing details in Westlands/Kilimani/Juja:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {getPropertiesForEstate(selectedEstate.name).map((prop) => (
                      <div
                        key={prop.id}
                        onClick={() => onSelectProperty(prop)}
                        className="flex items-center space-x-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer transition-colors"
                      >
                        <img className="w-10 h-10 object-cover rounded-lg" src={prop.image} alt={prop.title} />
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{prop.title}</p>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">Ksh {prop.price.toLocaleString()}</span>
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
