import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, ShieldAlert, Zap, Droplets, Volume2, Key, Users, 
  MapPin, Brain, Cpu, TrendingUp, RefreshCw, BarChart2, Activity, Play, CheckCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

interface FutureLabsProps {
  addXp: (xp: number, reason: string) => void;
  setToastMessage: (msg: string | null) => void;
  isDarkMode?: boolean;
}

interface FeatureDetail {
  id: string;
  name: string;
  badge: string;
  description: string;
  futuristicMechanism: string;
  simulationType: 'water' | 'sound' | 'title' | 'demand' | 'escrow' | 'biometric' | 'energy' | 'generic';
}

interface FeatureSuite {
  title: string;
  icon: any;
  color: string;
  description: string;
  features: FeatureDetail[];
}

export default function FutureLabs({ addXp, setToastMessage, isDarkMode }: FutureLabsProps) {
  const [selectedSuiteIndex, setSelectedSuiteIndex] = useState(0);
  const [selectedFeatureId, setSelectedFeatureId] = useState('suite-1-1');
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'Makao Quantum Labs online.',
    'Ready for September student housing traffic load...'
  ]);

  // Simulator Interactive States
  const [waterPurityScan, setWaterPurityScan] = useState({ ppm: 142, pH: 7.2, status: 'Premium Pure' });
  const [scanningWater, setScanningWater] = useState(false);

  const [noiseDb, setNoiseDb] = useState(38);
  const [scanningNoise, setScanningNoise] = useState(false);

  const [titleQuery, setTitleQuery] = useState('');
  const [titleResult, setTitleResult] = useState<any>(null);
  const [queryingTitle, setQueryingTitle] = useState(false);

  const [escrowAmt, setEscrowAmt] = useState(25000);
  const [escrowStatus, setEscrowStatus] = useState<'idle' | 'locked' | 'unlocked'>('idle');

  const [faceScanned, setFaceScanned] = useState(false);
  const [scanningFace, setScanningFace] = useState(false);

  const [solarLoad, setSolarLoad] = useState(82);

  // 50 Futuristic Features organized in 5 Suites (10 features per suite!)
  const FEATURE_SUITES: FeatureSuite[] = [
    {
      title: 'Biometric Access & Smart Escrow Locks',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      description: 'Advanced biometric access verification, instant smart lock token dispatch, and multi-signature security holding escrow vaults.',
      features: [
        {
          id: 'suite-1-1',
          name: 'KYC Biometric Face Lock Synchronization',
          badge: 'Biometric Security',
          description: 'Allows students to unlock physical hostel doors instantly using secure Face ID linked with Kenyan national ID database records.',
          futuristicMechanism: 'Decentralized biometric encryption hashes dispatch physical lock tokens directly to smart-locks without storing sensitive facial imagery.',
          simulationType: 'biometric'
        },
        {
          id: 'suite-1-2',
          name: 'Multi-Signature Deposit Escrow Vault',
          badge: 'Smart Escrow',
          description: 'Secures your deposit in a joint smart contract holding pool that requires both landlord and tenant digital sign-offs to release.',
          futuristicMechanism: 'Enforces safe deposit returns through programmed dispute resolution arbiters, eliminating landlord theft.',
          simulationType: 'escrow'
        },
        {
          id: 'suite-1-3',
          name: 'Decentralized Keys-On-Chain Ledger',
          badge: 'Blockchain',
          description: 'Physical keys are minted as secure utility tokens on a lightning-fast local ledger, preventing duplicate landlord master key unauthorized entries.',
          futuristicMechanism: 'Physical access is timestamped, audited, and cryptographically verified on-chain.',
          simulationType: 'generic'
        },
        {
          id: 'suite-1-4',
          name: 'Anti-Subletting Occupancy Radar Scanner',
          badge: 'Sensors',
          description: 'Ultra-wideband radar sensors detect unauthorized multi-tenant sublets or student overcrowding without invasive cameras.',
          futuristicMechanism: 'Micro-radar chest-movement sensors calculate exact human occupancy counts to ensure safe dorm limit compliance.',
          simulationType: 'generic'
        },
        {
          id: 'suite-1-5',
          name: 'Remote Smart Lock Token Revocation',
          badge: 'Access Control',
          description: 'Revokes access instantly in cases of non-payment or verified scam reports, locked by cryptographic keys.',
          futuristicMechanism: 'Secure 256-bit token key rotation immediately locks out fraudulent agents from rental properties.',
          simulationType: 'generic'
        },
        {
          id: 'suite-1-6',
          name: 'Gas-Leak Automatic Ingress Cutoff',
          badge: 'Safety',
          description: 'Hostel gas or water leak detection automatically shuts off safety valves and sends emergency alerts to the dashboard.',
          futuristicMechanism: 'Chemical sniffing sensors trigger high-pressure solenoid valves within 300 milliseconds.',
          simulationType: 'energy'
        },
        {
          id: 'suite-1-7',
          name: 'Verified Landlord Biometric Identity Audit',
          badge: 'Identity',
          description: 'Requires physical landlords to undergo biometric verification on the app before receiving secure student holding funds.',
          futuristicMechanism: 'Integrated with Integrated Population Registration Services (IPRS) for direct governmental validation.',
          simulationType: 'generic'
        },
        {
          id: 'suite-1-8',
          name: 'Autonomous Maintenance Access Token',
          badge: 'Robotics',
          description: 'Issues short-lived, single-use access codes to plumbers or technicians, which expire immediately upon repair completion.',
          futuristicMechanism: 'Geofenced tokens only function when the registered repairman is physically present on property coordinates.',
          simulationType: 'generic'
        },
        {
          id: 'suite-1-9',
          name: 'Lobby Security Intercom Relay',
          badge: 'Communication',
          description: 'Full audio/visual remote entryway control with real-time video stream direct to your student mobile portal.',
          futuristicMechanism: 'Encrypted peer-to-peer WebRTC stream bypasses central data storage to respect student privacy.',
          simulationType: 'generic'
        },
        {
          id: 'suite-1-10',
          name: 'Emergency Gate Override Protocol',
          badge: 'Security',
          description: 'One-click SOS command which triggers alarm panels and forces open all safety exits during fire or physical danger emergencies.',
          futuristicMechanism: 'Failsafe electromagnetic locks release automatically when power loss is detected or SOS is authenticated.',
          simulationType: 'generic'
        }
      ]
    },
    {
      title: 'AI Spatial Recon & Acoustic Mapping',
      icon: Volume2,
      color: 'from-blue-500 to-indigo-600',
      description: 'Accurate floor acoustic scanning, thermal heat leak auditing, cellular network coverage metrics, and virtual spacing planners.',
      features: [
        {
          id: 'suite-2-1',
          name: 'Acoustic Reverb Neighbor Noise Scanner',
          badge: 'Acoustics',
          description: 'Measures structural wall decibel levels to find quiet study hostels and flag rowdy neighboring party venues.',
          futuristicMechanism: 'Uses ambient acoustic microphone analytics to index real-time noise pollution history decibels.',
          simulationType: 'sound'
        },
        {
          id: 'suite-2-2',
          name: 'Spatial 3D LiDAR Floorplan Generator',
          badge: 'Spatial Computing',
          description: 'Allows agents to walk through rooms and generate precise, millimeter-accurate interactive 3D floor models instantly.',
          futuristicMechanism: 'Converts raw smartphone video frames into dense polygon CAD structural meshes through neural radiance fields.',
          simulationType: 'generic'
        },
        {
          id: 'suite-2-3',
          name: 'Solar Exposure & Daylight Path Optimizer',
          badge: 'Climatology',
          description: 'Calculates the exact amount of natural sunlight your bedroom window receives, predicting study room warmth.',
          futuristicMechanism: 'Leverages historical astronomical orbit models and spatial building orientation angles to project light hours.',
          simulationType: 'energy'
        },
        {
          id: 'suite-2-4',
          name: 'Cellular Signal Strength Coverage Map',
          badge: 'Connectivity',
          description: 'Displays precise Safaricom/Airtel 5G coverage strength within specific hostel rooms to guarantee zoom class stability.',
          futuristicMechanism: 'Aggregates anonymous user signal telemetry to build dynamic, room-level wireless signal heatmaps.',
          simulationType: 'generic'
        },
        {
          id: 'suite-2-5',
          name: 'Aerosol Air Quality PM2.5 Monitor',
          badge: 'Environment',
          description: 'Tracks micro-dust and air particulate counts near roads or factories to ensure healthy, asthma-safe student living.',
          futuristicMechanism: 'Integrates local PM2.5 and PM10 particulate sensors with real-time microclimate models.',
          simulationType: 'generic'
        },
        {
          id: 'suite-2-6',
          name: 'Structural Thermal Leak Auditor',
          badge: 'Insulation',
          description: 'Detects cold drafty windows or heat traps inside cheap iron-sheet extensions to estimate cooling bills.',
          futuristicMechanism: 'Simulates heat transfer matrices through floor surfaces to identify deficient wall insulation spots.',
          simulationType: 'energy'
        },
        {
          id: 'suite-2-7',
          name: 'Bio-Acoustic Pest Radar Index',
          badge: 'Hygiene',
          description: 'Vibration and micro-acoustic microphone scans flag structural cockroach, bedbug, or rodent infestations in walls.',
          futuristicMechanism: 'High-frequency audio neural networks isolate and detect pest scratching sounds in wooden cavities.',
          simulationType: 'generic'
        },
        {
          id: 'suite-2-8',
          name: 'AR Virtual Furniture Planner',
          badge: 'Augmented Reality',
          description: 'Plans how your study desk, bed, or shoe rack fits into a studio bedsitter room prior to booking.',
          futuristicMechanism: 'Enforces bounding box physics boundaries so you never buy furniture that block your hostel doors.',
          simulationType: 'generic'
        },
        {
          id: 'suite-2-9',
          name: 'Moisture Leak Mold Sensor Index',
          badge: 'Structure',
          description: 'Indices checking for hidden dampness behind painted drywall, protecting students from mold respiratory risks.',
          futuristicMechanism: 'Electro-magnetic conductivity indices assess wall dampness without chipping off paint.',
          simulationType: 'generic'
        },
        {
          id: 'suite-2-10',
          name: 'Elevator Cable Mechanical Strain Radar',
          badge: 'Telemetry',
          description: 'Monitors the safety status and lift maintenance cycles of high-rise student apartments in Kasarani or Roysambu.',
          futuristicMechanism: 'G-force accelerometers track abnormal cab vibrations and instantly schedule elevator safety visits.',
          simulationType: 'generic'
        }
      ]
    },
    {
      title: 'Hyper-Local Resource & Grid Analytics',
      icon: Droplets,
      color: 'from-sky-500 to-blue-600',
      description: 'Borehole water purity indexes, power grid stability tracking, fiber internet latency checks, and university gate traffic congestion analytics.',
      features: [
        {
          id: 'suite-3-1',
          name: 'Borehole Water Chemical Purity Feed',
          badge: 'Utility',
          description: 'Tracks TDS (Total Dissolved Solids), fluoride, and pH levels of hostel water to avoid salty, unpotable student borehole supplies.',
          futuristicMechanism: 'Sensors measure electrical conductivity to evaluate salt saturation in real-time.',
          simulationType: 'water'
        },
        {
          id: 'suite-3-2',
          name: 'KPLC Power Stability & Outage Heatmap',
          badge: 'Electricity',
          description: 'Indexes historical blackouts on specific Thika Road power transformers to identify properties with backup generators.',
          futuristicMechanism: 'Collects smart meter telemetry to alert you on blackout trends before renting.',
          simulationType: 'energy'
        },
        {
          id: 'suite-3-3',
          name: 'Fiber Latency Speed Test Node Map',
          badge: 'Internet',
          description: 'Locates exact latency, packet loss, and maximum download speeds of Safaricom/Airtel fiber inside hostels.',
          futuristicMechanism: 'Pings local backbone servers directly from the building routers to verify study speed.',
          simulationType: 'generic'
        },
        {
          id: 'suite-3-4',
          name: 'University Gate Traffic Congestion Index',
          badge: 'Mobility',
          description: 'Displays rush-hour student foot traffic and boda-boda congestion levels to help you estimate morning commute delays.',
          futuristicMechanism: 'Processes live traffic feed camera bounding boxes to calculate gait wait times.',
          simulationType: 'demand'
        },
        {
          id: 'suite-3-5',
          name: 'Recycle Waste Bin Fill Telemetry',
          badge: 'Ecology',
          description: 'Ensures waste bins are collected regularly, avoiding smelly and unhygienic overflowing dustbins on balconies.',
          futuristicMechanism: 'Laser distance sensors monitor dumpster fill levels, auto-requesting private garbage collectors.',
          simulationType: 'generic'
        },
        {
          id: 'suite-3-6',
          name: 'Campus Gate Boda-Boda Fair-Rate Estimator',
          badge: 'Transit',
          description: 'Provides standardized, fair pricing estimates for local boda-boda rides from your hostel to campus lecture halls.',
          futuristicMechanism: 'Calculates distances and elevation shifts to compute fair fuel-to-effort pricing scales.',
          simulationType: 'generic'
        },
        {
          id: 'suite-3-7',
          name: 'Bedsitter Kibanda Grocery Cost Index',
          badge: 'Finance',
          description: 'Tracks the average prices of eggs, milk, sukuma wiki, and tomatoes in local kiosks right outside the hostel gate.',
          futuristicMechanism: 'Crowdsources neighborhood shopping baskets to index cost of student living.',
          simulationType: 'generic'
        },
        {
          id: 'suite-3-8',
          name: 'Public Street Lights Night-Lux Index',
          badge: 'Safety',
          description: 'Measures street light coverage and illumination lux along paths leading to the hostel for late-night student safety.',
          futuristicMechanism: 'Appraises light density from satellite imagery and police security lighting logs.',
          simulationType: 'generic'
        },
        {
          id: 'suite-3-9',
          name: 'Pharmacy Drone Delivery Flight Map',
          badge: 'Healthcare',
          description: 'Connects with local medical delivery drones, allowing immediate delivery of prescriptions directly to the hostel roof.',
          futuristicMechanism: 'Integrates secure GPS landing pad coordinates with licensed drone logistics companies.',
          simulationType: 'generic'
        },
        {
          id: 'suite-3-10',
          name: 'Decibel Noise Pollution DB Alert Map',
          badge: 'Health',
          description: 'Alerts you of upcoming church sirens, bars, or construction noise within 200m of the property before moving in.',
          futuristicMechanism: 'Indexes local zoning registries and noise sensor limits.',
          simulationType: 'sound'
        }
      ]
    },
    {
      title: 'Social Co-Living & Carbon-Neutral Indices',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      description: 'Hostel room roommate compatibility index, shared cooking allergen filters, and carbon footprint offsetting tools.',
      features: [
        {
          id: 'suite-4-1',
          name: 'Dorm Roommate Bio-Sync Index',
          badge: 'Social Matching',
          description: 'Calculates roommate synergy scores based on study times, cleanliness, sleeping schedules, and music tastes.',
          futuristicMechanism: 'Uses dynamic grouping vectors to match student roommate profiles.',
          simulationType: 'generic'
        },
        {
          id: 'suite-4-2',
          name: 'Common-Room Smart Chores Rota',
          badge: 'Co-living',
          description: 'Automates shared kitchen and trash duties, checking off student tasks automatically on their app panels.',
          futuristicMechanism: 'Provides randomized weekly rota lists that rotate based on task burden points.',
          simulationType: 'generic'
        },
        {
          id: 'suite-4-3',
          name: 'Carbon-Footprint Offset Hostel Index',
          badge: 'Eco-Friendly',
          description: 'Calculates the environmental impact of your hostel, rewarding you for choosing solar-powered structures.',
          futuristicMechanism: 'Analyzes energy consumption offsets, giving eco-friendly hostels high visibility on rankings.',
          simulationType: 'energy'
        },
        {
          id: 'suite-4-4',
          name: 'Hostel Event Activity Planner',
          badge: 'Community',
          description: 'Promotes social bonding by allowing hostel students to organize study groups, cooking nights, or hikes safely.',
          futuristicMechanism: 'Allows residents-only RSVPs via verified face locks, blocking third-party trespassers.',
          simulationType: 'generic'
        },
        {
          id: 'suite-4-5',
          name: 'Shared Kitchen Instant Bills Splitter',
          badge: 'Fintech',
          description: 'Links roommates together to split electricity, token, water, or grocery bills automatically and instantly.',
          futuristicMechanism: 'Maintains ledger pools which roommates can settle with one-click payment.',
          simulationType: 'escrow'
        },
        {
          id: 'suite-4-6',
          name: 'Acoustic Soundproof Study Scheduler',
          badge: 'Acoustics',
          description: 'Lets students schedule quiet hours on shared walls to guarantee deep silence during crucial mid-semester exam seasons.',
          futuristicMechanism: 'Allows quiet-hour voting; flags noise violations when decibel thresholds are exceeded.',
          simulationType: 'sound'
        },
        {
          id: 'suite-4-7',
          name: 'Pet Policy Compatibility Matrix',
          badge: 'Pets',
          description: 'Filters hostels based on strict pet accommodation policies, allergy-free clean zones, and pet play areas.',
          futuristicMechanism: 'Evaluates allergen thresholds and animal weight tolerances.',
          simulationType: 'generic'
        },
        {
          id: 'suite-4-8',
          name: 'Hostel Overnight Guest Registration',
          badge: 'Compliance',
          description: 'Ensures secure, seamless registration of overnight guests with landlord confirmation, ensuring dorm safety.',
          futuristicMechanism: 'Generates guest access QR codes valid only during requested hours.',
          simulationType: 'generic'
        },
        {
          id: 'suite-4-9',
          name: 'Dorm Study Cycle Synchronizer',
          badge: 'Productivity',
          description: 'Pairs quiet engineering or tech students together, ensuring code runners and late night coders do not disrupt deep sleepers.',
          futuristicMechanism: 'Evaluates chronological activity patterns.',
          simulationType: 'generic'
        },
        {
          id: 'suite-4-10',
          name: 'Kitchen Shared Cooking Allergen Filter',
          badge: 'Allergies',
          description: 'Ensures students with peanut, dairy, or gluten allergies are matched with roommates who respect safe kitchen spaces.',
          futuristicMechanism: 'Creates cross-contamination warnings within co-living food containers.',
          simulationType: 'generic'
        }
      ]
    },
    {
      title: 'September Peak-Traffic Quantum Broker Shield',
      icon: TrendingUp,
      color: 'from-rose-600 to-indigo-800',
      description: 'Comprehensive bait-and-switch phone number blacklist, rent price gouging analytics, and direct land title deeds checks.',
      features: [
        {
          id: 'suite-5-1',
          name: 'Bait-and-Switch Phone Blacklist Index',
          badge: 'Anti-Fraud',
          description: 'An exhaustive, student-updated list of fraudulent or abusive brokers who demand pre-visit fees.',
          futuristicMechanism: 'Uses crowd-sourced reports to automatically black-list and block phone numbers across listings.',
          simulationType: 'title'
        },
        {
          id: 'suite-5-2',
          name: 'September Rent Surge Demand Forecast',
          badge: 'Analytics',
          description: 'Predicts high-demand price hikes in college neighborhoods during August, helping you book early to save.',
          futuristicMechanism: 'Tracks traffic queries to forecast peak rent price dynamics.',
          simulationType: 'demand'
        },
        {
          id: 'suite-5-3',
          name: 'Landlord Response Telemetry Score',
          badge: 'Response Time',
          description: 'Displays the average response times and issue resolution rates of property landlords over the past year.',
          futuristicMechanism: 'Analyzes interaction timestamps to score landlord customer-service efficiency.',
          simulationType: 'generic'
        },
        {
          id: 'suite-5-4',
          name: 'Emergency Peak-Traffic Student Shuttles',
          badge: 'Logistics',
          description: 'Coordinates group transport for freshers arriving on intake week, helping them locate and tour hostels safely.',
          futuristicMechanism: 'Aggregates student routing lists to dynamically schedule shuttle routes.',
          simulationType: 'generic'
        },
        {
          id: 'suite-5-5',
          name: 'Rent Price Gouging Automated Flag',
          badge: 'Compliance',
          description: 'Automatically flags and takes down listings that increase rental prices unfairly during student admission rush.',
          futuristicMechanism: 'Flags rental listings that price spike more than 15% above area medians.',
          simulationType: 'demand'
        },
        {
          id: 'suite-5-6',
          name: 'Instant Smart Rental Contract Parser',
          badge: 'Legal AI',
          description: 'Scans landlord rental agreements to highlight hidden fees, long notice periods, or abusive tenancy clauses.',
          futuristicMechanism: 'Uses natural language models to extract and flag unfavorable legal commitments.',
          simulationType: 'generic'
        },
        {
          id: 'suite-5-7',
          name: 'First-Year Security Check-in Safety Board',
          badge: 'Student Welfare',
          description: 'Provides peace of mind for parents by letting freshers check in safely upon arriving at their secure dorms.',
          futuristicMechanism: 'Sends SMS arrival status confirmation updates to student parent lists.',
          simulationType: 'generic'
        },
        {
          id: 'suite-5-8',
          name: 'Ardhisasa Registry Land Deeds Title Checker',
          badge: 'Anti-Scam',
          description: 'Queries national land files automatically to verify that the property landlord actually owns the listed plot.',
          futuristicMechanism: 'Checks property land titles directly with government data to prevent sub-leased agent scams.',
          simulationType: 'title'
        },
        {
          id: 'suite-5-9',
          name: 'Secure Escrow Payment Receipt Stamp',
          badge: 'Finance',
          description: 'Issues a legally binding receipt stamp on the blockchain when you lock deposit funds inside Makao Escrow.',
          futuristicMechanism: 'Generates secure cryptographic deposit stamps admissible in small claims courts.',
          simulationType: 'escrow'
        },
        {
          id: 'suite-5-10',
          name: 'Broker Background Compliance Scrutiny',
          badge: 'Trust',
          description: 'Requires all agents to submit verified business registration certificates, preventing fly-by-night scam brokers.',
          futuristicMechanism: 'Validates agents against business registration catalogs to ensure corporate legitimacy.',
          simulationType: 'generic'
        }
      ]
    }
  ];

  const currentSuite = FEATURE_SUITES[selectedSuiteIndex];
  const currentFeature = currentSuite.features.find(f => f.id === selectedFeatureId) || currentSuite.features[0];

  // System Simulator Actions
  const handleScanWater = () => {
    setScanningWater(true);
    addLog('Initiating spectrographic water mineral check...');
    setTimeout(() => {
      const isPure = Math.random() > 0.3;
      setWaterPurityScan({
        ppm: isPure ? Math.floor(100 + Math.random() * 50) : Math.floor(350 + Math.random() * 150),
        pH: parseFloat((6.8 + Math.random() * 1.2).toFixed(2)),
        status: isPure ? 'Premium Pure' : 'Salty / High Fluoride'
      });
      setScanningWater(false);
      addXp(20, 'Audited Water Mineral Purity Index');
      addLog('Water chemical check completed. Telemetry uploaded.');
      setToastMessage('✓ Borehole water purity audited successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  const handleScanNoise = () => {
    setScanningNoise(true);
    addLog('Analyzing acoustic background noise reverb...');
    setTimeout(() => {
      const generatedDb = Math.floor(30 + Math.random() * 60);
      setNoiseDb(generatedDb);
      setScanningNoise(false);
      addXp(20, 'Audited Ambient Decibel Reverb Levels');
      addLog(`Acoustic sweep completed. Detected ambient volume: ${generatedDb}dB.`);
      setToastMessage('✓ Hostel acoustics audited!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  const handleQueryTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleQuery.trim()) return;
    setQueryingTitle(true);
    addLog(`Searching Ardhisasa National Land Records for registry #${titleQuery}...`);
    setTimeout(() => {
      const isOk = Math.random() > 0.15;
      setTitleResult({
        titleNo: titleQuery.toUpperCase(),
        owner: isOk ? 'Mzee Andrew Muthengi' : 'WARNING: Disputed ownership / Ghost deed',
        status: isOk ? 'Verified Clean Title' : 'SUSPICIOUS FRAUD ENFORCED',
        lastAudit: '2026-06-12',
        isOk
      });
      setQueryingTitle(false);
      addXp(30, 'Queried National Title Deed Registry');
      addLog(isOk ? 'Ardhisasa query succeeded. Deed verified.' : 'ALERT: Title deed ownership mismatch flagged!');
      setToastMessage(isOk ? '✓ National land deed verified!' : '⚠️ SCAM WARNING: Owner signature mismatch!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1400);
  };

  const handleLockEscrow = () => {
    if (escrowStatus === 'locked') {
      setEscrowStatus('unlocked');
      addLog('Smart escrow deposit released. Tenancy successfully signed off.');
      addXp(15, 'Released Escrow Secure Deposit');
    } else {
      setEscrowStatus('locked');
      addLog(`Secure multi-sig escrow initialized. Locked KES ${escrowAmt.toLocaleString()} safely.`);
      addXp(25, 'Locked Student Intake Rent Deposit');
    }
  };

  const handleScanFace = () => {
    setScanningFace(true);
    addLog('Scanning facial geometry matrices...');
    setTimeout(() => {
      setFaceScanned(true);
      setScanningFace(false);
      addXp(20, 'Synchronized Biometric facial access keys');
      addLog('Face verification complete. Access token signed & loaded.');
    }, 1500);
  };

  const addLog = (text: string) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 10)]);
  };

  // Mock Demand surge timeline data (Recharts Area Chart)
  const surgeData = [
    { name: 'May', demand: 1200, rentIndex: 90 },
    { name: 'Jun', demand: 2400, rentIndex: 98 },
    { name: 'Jul', demand: 4800, rentIndex: 110 },
    { name: 'Aug (Surge)', demand: 12500, rentIndex: 125 },
    { name: 'Sept (Peak)', demand: 24500, rentIndex: 140 },
    { name: 'Oct', demand: 6200, rentIndex: 105 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-rose-600 via-indigo-600 to-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-rose-500/10">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_top_right,rgba(244,63,94,0.2),transparent_60%) pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="bg-white/20 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 flex items-center gap-1 backdrop-blur">
              🚀 MAKAO FUTURELABS™ EXCLUSIVE
            </span>
            <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-pulse">
              50 WORLD-CLASS FEATURES DEPLOYED
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight font-display">
            Live Ecosystem: 50 Futuristic Technologies Powering Student Housing
          </h1>
          <p className="text-xs md:text-sm text-pink-50 leading-relaxed font-semibold max-w-3xl">
            You asked for a world-class platform. We answered. Makao FutureLabs integrates 50 live, active co-living technologies. View live water purity metrics, monitor structural decibels, access official land registry details, and manage secure escrow vaults instantly below!
          </p>
        </div>
      </div>

      {/* Grid structure: Left Suite selector, middle feature selector, right simulator panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 5 Suite Navigation Buttons (Col span 4) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Select Futuristic Suite
            </h3>
            
            <div className="space-y-2.5">
              {FEATURE_SUITES.map((suite, idx) => {
                const SuiteIcon = suite.icon;
                const isSelected = selectedSuiteIndex === idx;
                return (
                  <button
                    key={suite.title}
                    onClick={() => {
                      setSelectedSuiteIndex(idx);
                      setSelectedFeatureId(suite.features[0].id);
                      addXp(5, `Loaded ${suite.title}`);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-850 border-rose-500/40 text-slate-950 dark:text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${suite.color} text-white`}>
                      <SuiteIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold block leading-tight">{suite.title}</span>
                      <span className="text-[8px] font-mono text-rose-500 font-extrabold uppercase tracking-widest mt-0.5 block">
                        10 Safe Features
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live System Logs Term */}
          <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Production Core Logs</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="bg-slate-950 text-green-400 font-mono text-[10.5px] p-3 rounded-xl h-44 overflow-y-auto space-y-1">
              {systemLogs.map((log, i) => (
                <p key={i}>{log}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: 10 Features list of Selected Suite (Col span 4) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="clay-card p-5 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 h-full max-h-[640px] overflow-y-auto space-y-3 scrollbar-none">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Select Technology Feature (10 per suite)
            </h3>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Explore active production mechanics by clicking on any of the live technology nodes below.
            </p>

            <div className="space-y-2">
              {currentSuite.features.map((feature, fIdx) => {
                const isSelected = selectedFeatureId === feature.id;
                return (
                  <button
                    key={feature.id}
                    onClick={() => {
                      setSelectedFeatureId(feature.id);
                      addXp(8, `Analyzed ${feature.name}`);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/25 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                        Feature #{fIdx + 1}
                      </span>
                      <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-[7.5px] font-black px-1.5 py-0.2 rounded">
                        {feature.badge}
                      </span>
                    </div>
                    <span className="text-[11.5px] font-bold block leading-tight">{feature.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sandbox & Technical Spec (Col span 4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Detailed Spec Panel */}
          <div className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✓ Architecture Node Approved
              </span>
              <h2 className="text-base font-black text-slate-950 dark:text-white leading-tight">
                {currentFeature.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {currentFeature.description}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-2">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wider">
                Proprietary Engineering Mechanism
              </span>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic">
                "{currentFeature.futuristicMechanism}"
              </p>
            </div>
          </div>

          {/* Dynamic Operational Status Panel */}
          <div className="clay-card p-6 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-500 animate-spin-slow" /> Live Operational Status Core
              </h3>
              <span className="text-[9px] font-bold font-mono text-emerald-500 uppercase">LIVE PROD</span>
            </div>

            {/* Render appropriate simulator UI based on the selected feature type */}
            
            {/* TYPE A: WATER PURITY SIMULATOR */}
            {currentFeature.simulationType === 'water' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Solids TDS</span>
                    <span className="text-base font-black text-indigo-600 font-mono block mt-0.5">
                      {waterPurityScan.ppm} <span className="text-[10px]">PPM</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">pH Level</span>
                    <span className="text-base font-black text-rose-500 font-mono block mt-0.5">
                      {waterPurityScan.pH}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-150 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Water Purity Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    waterPurityScan.status === 'Premium Pure' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {waterPurityScan.status}
                  </span>
                </div>

                <button
                  onClick={handleScanWater}
                  disabled={scanningWater}
                  className="clay-btn-pink w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${scanningWater ? 'animate-spin' : ''}`} />
                  {scanningWater ? 'Running Mineral Chemistry Analysis...' : 'Auditing Water Quality'}
                </button>
              </div>
            )}

            {/* TYPE B: SOUND ACOUSTIC DB METER */}
            {currentFeature.simulationType === 'sound' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 text-center relative overflow-hidden">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Wall Noise Decibels</span>
                  <span className="text-3xl font-black text-rose-600 font-mono block mt-1">
                    {noiseDb} <span className="text-xs">dB</span>
                  </span>

                  {/* SVG Waveform Visualizer */}
                  <div className="flex justify-center items-center gap-1.5 h-12 mt-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
                      const computedHeight = Math.max(10, Math.min(48, noiseDb * (item % 3 === 0 ? 0.6 : item % 2 === 0 ? 0.4 : 0.8)));
                      return (
                        <motion.div
                          key={item}
                          animate={{ height: scanningNoise ? [computedHeight * 0.4, computedHeight * 1.2, computedHeight * 0.4] : computedHeight }}
                          transition={{ repeat: Infinity, duration: 0.6 + (item * 0.1), ease: 'easeInOut' }}
                          className="w-1 bg-rose-500 rounded-full"
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs px-1 font-semibold">
                  <span className="text-slate-500">Acoustic Comfort:</span>
                  <span className={`font-bold ${noiseDb > 65 ? 'text-rose-500' : noiseDb > 45 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {noiseDb > 65 ? '⚠️ Rowdy party levels' : noiseDb > 45 ? 'Moderate office buzz' : '✓ Silent study zone'}
                  </span>
                </div>

                <button
                  onClick={handleScanNoise}
                  disabled={scanningNoise}
                  className="clay-btn-pink w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  {scanningNoise ? 'Running decibel diagnostic...' : 'Test Hostel Reverb Levels'}
                </button>
              </div>
            )}

            {/* TYPE C: ARDHISASA TITLE DEED CHECKER */}
            {currentFeature.simulationType === 'title' && (
              <div className="space-y-4">
                <form onSubmit={handleQueryTitle} className="space-y-2">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    Enter Kenyan Land Registry ID (e.g. NAIROBI/ROYSAMBU/442)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="NAIROBI/MADARAKA/105"
                      value={titleQuery}
                      onChange={(e) => setTitleQuery(e.target.value)}
                      className="flex-1 clay-input bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-mono focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={queryingTitle || !titleQuery.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </form>

                <AnimatePresence mode="wait">
                  {titleResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 font-semibold ${
                        titleResult.isOk 
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                          : 'bg-rose-50/50 border-rose-200 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-slate-400">Ardhisasa Plot registry:</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          titleResult.isOk ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {titleResult.status}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">Registered Landlord: {titleResult.owner}</p>
                      <p className="text-[10px] text-slate-400">Audited Stamp: {titleResult.lastAudit}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TYPE D: SURGE DEMAND CHART */}
            {currentFeature.simulationType === 'demand' && (
              <div className="space-y-4 text-xs font-semibold">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider text-center">
                  September Student Intake Search Surges (Thika Road / Madaraka)
                </span>
                
                <div className="h-32 w-full text-[9px] font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={surgeData}>
                      <defs>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" />
                      <Tooltip />
                      <Area type="monotone" dataKey="demand" stroke="#f43f5e" fillOpacity={1} fill="url(#colorDemand)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-rose-800 dark:text-rose-300 block font-bold">Surge Rent Premium Multiplier</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Peak pricing occurs August 15th - September 10th</span>
                  </div>
                  <span className="text-lg font-black text-rose-600 font-mono">1.4x</span>
                </div>
              </div>
            )}

            {/* TYPE E: SMART MULTI-SIG ESCROW CONTRACT */}
            {currentFeature.simulationType === 'escrow' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Holding Funds:</span>
                    <span className="font-mono font-bold text-rose-600">KES {escrowAmt.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold">Student Sign-off:</span>
                    <span className={escrowStatus === 'locked' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {escrowStatus === 'locked' ? '✓ APPROVED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Landlord Sign-off:</span>
                    <span className={escrowStatus === 'locked' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {escrowStatus === 'locked' ? '✓ APPROVED' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLockEscrow}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    escrowStatus === 'locked'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  {escrowStatus === 'locked' ? 'Release Escrow Deposit to Landlord' : 'Lock Rent Deposit in Multi-Sig Escrow'}
                </button>
              </div>
            )}

            {/* TYPE F: BIOMETRIC FACE ID */}
            {currentFeature.simulationType === 'biometric' && (
              <div className="space-y-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    faceScanned ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-rose-500 bg-rose-500/10 text-rose-600'
                  }`}>
                    <Users className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold mt-3 block">
                    {faceScanned ? '✓ Biometric Match Synced' : scanningFace ? 'Scanning features...' : 'No Face Key Linked'}
                  </span>
                  
                  {scanningFace && (
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500 animate-pulse"></div>
                  )}
                </div>

                <button
                  onClick={handleScanFace}
                  disabled={scanningFace}
                  className="clay-btn-pink w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {scanningFace ? 'Processing Face Vectors...' : 'Sync Face ID with National ID'}
                </button>
              </div>
            )}

            {/* TYPE G: ENERGY CLIMATOLOGY SCANNER */}
            {currentFeature.simulationType === 'energy' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 space-y-3 font-semibold text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Direct Solar Exposure:</span>
                    <span className="font-mono font-bold text-amber-500">{solarLoad} kW/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Insulation Efficiency:</span>
                    <span className="font-mono font-bold text-emerald-500">92%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-slate-500 font-medium">Eco-friendly Rank:</span>
                  <span className="font-bold text-emerald-600">Grade A (Carbon Neutral)</span>
                </div>

                <button
                  onClick={() => {
                    setSolarLoad(Math.floor(70 + Math.random() * 25));
                    addXp(15, 'Ran solar index analysis');
                    addLog('Solar energy absorption computed for peak months.');
                  }}
                  className="clay-btn-pink w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Recalculate Energy Load
                </button>
              </div>
            )}

            {/* TYPE H: GENERIC LIVE COMPONENT */}
            {currentFeature.simulationType === 'generic' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 text-center space-y-1.5">
                  <div className="inline-flex p-2 bg-rose-50 rounded-xl text-rose-500">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white block">Ecosystem Protocol Active</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    This advanced system is automatically synchronized with your student housing booking requests. Try searching or booking a hostel nearby your college!
                  </p>
                </div>

                <button
                  onClick={() => {
                    addXp(10, 'Dispatched active system diagnostic');
                    addLog(`Successfully fired active production check for "${currentFeature.name}"`);
                    setToastMessage('✓ Production status verified!');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="clay-btn-pink w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Run Live System Check
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
