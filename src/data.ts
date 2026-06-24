import { Property, Reel, CommunityReport, UserQuest, UserBadge } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern Cozy 1-Bedroom Apartment',
    location: 'Kilimani, Nairobi',
    price: 32000,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Beautifully furnished 1-bedroom apartment situated in the heart of Kilimani. Includes state-of-the-art backup generator, continuous borehole water supply, 24/7 security with electric fencing, and smart intercom systems. Perfect for young professionals or couples working in Nairobi CBD or Westlands.',
    isVerified: true,
    rating: 4.8,
    latitude: -1.2901,
    longitude: 36.7822,
    amenities: ['High-speed Wifi', 'Backup Generator', 'Borehole Water', 'Gym', '24/7 Security', 'Elevator'],
    host: {
      name: 'Andrew Muthengi (Agent)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      phone: '+254 712 345678'
    },
    views: 1240,
    likes: 85,
    featured: true
  },
  {
    id: 'prop-2',
    title: 'High-yield 1/4 Acre Red Soil Plot',
    location: 'Juja Farm, Kiambu',
    price: 1850000,
    type: 'land',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'Prime prime 1/4 acre parcel in Juja Farm. Highly fertile red volcanic soil perfect for immediate residential development or agricultural cash crop ventures like Hass Avocados. Features clear perimeter beacons, immediate access to electricity lines and fresh water, and ready freehold Title Deed at ArdhiSasa for verification.',
    isVerified: true,
    rating: 4.9,
    latitude: -1.1012,
    longitude: 37.0142,
    amenities: ['Freehold Title', 'Fenced Beacons', 'Red Soil', 'Water Supply', 'Electricity Connection'],
    host: {
      name: 'Kimani Properties Ltd',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      phone: '+254 722 999111'
    },
    views: 3105,
    likes: 240,
    promoted: true
  },
  {
    id: 'prop-3',
    title: 'Serene Executive 4-Bedroom Villa',
    location: 'Kileleshwa, Nairobi',
    price: 120000,
    type: 'rent',
    bedrooms: 4,
    bathrooms: 4.5,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-luxurious 4-bedroom townhouse inside a private gated community in Kileleshwa. Boasts executive finishes, private mature garden, spacious attic study room, detached staff quarters (DSQ), CCTV surveillance, and individual water storage tanks. Rent is inclusive of service charge.',
    isVerified: true,
    rating: 4.7,
    latitude: -1.2789,
    longitude: 36.7891,
    amenities: ['DSQ', 'Private Garden', 'CCTV', 'Borehole', 'Electric Fence', 'Solar Water Heating'],
    host: {
      name: 'Andrew Muthengi (Agent)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      phone: '+254 712 345678'
    },
    views: 890,
    likes: 42,
    featured: true
  },
  {
    id: 'prop-4',
    title: 'Elite Student Hostel (Private En-suite)',
    location: 'Roysambu (USIU Road), Nairobi',
    price: 14500,
    type: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    description: 'Safe and premium student accommodation located 2 minutes walk from USIU and Pan Africa Christian University. Includes pre-paid high-speed Wi-Fi token system, tight biometric entry system, dedicated study tables, common cooking & entertainment lounges, and reliable water and security personnel.',
    isVerified: true,
    rating: 4.6,
    latitude: -1.2185,
    longitude: 36.8831,
    amenities: ['Biometric Access', 'Free High-speed Wi-Fi', 'Study Room', 'Borehole', 'Token Electricity'],
    host: {
      name: 'USIU Premium Hostels',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      phone: '+254 733 444555'
    },
    views: 2410,
    likes: 180
  },
  {
    id: 'prop-5',
    title: 'Commercial Office Space - 1500 Sqft',
    location: 'Westlands (Mombasa Road / CBD Link), Nairobi',
    price: 135000,
    type: 'commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Modern open-plan commercial office space located on the 4th floor of an ultra-modern building in Westlands. Comes ready with optical fiber connection, double-glazed soundproof windows, 3 reserved parking bays, central air conditioning, and passenger/service elevators.',
    isVerified: true,
    rating: 4.5,
    latitude: -1.2682,
    longitude: 36.8065,
    amenities: ['Reserved Parking', 'Fiber Internet', 'Elevators', 'AC', 'Meeting Lounge', 'Kitchenette'],
    host: {
      name: 'Westlands Commercial Hub',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      isVerified: false,
      phone: '+254 700 123456'
    },
    views: 450,
    likes: 22
  },
  {
    id: 'prop-6',
    title: 'Affordable Modern Bedsitter',
    location: 'Zimmerman, Nairobi',
    price: 8500,
    type: 'rent',
    bedrooms: 0,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'Extremely cost-effective bedsitter featuring clean tiled floors, individual electricity tokens, hot shower setup, and internal kitchen counter. High water pressure with 24/7 borehole access. Clean security gate and quiet neighborhood ideal for students or starting individuals.',
    isVerified: false,
    rating: 4.2,
    latitude: -1.2112,
    longitude: 36.8923,
    amenities: ['Token Electricity', 'Hot Shower', 'Water Tank', 'Security Gate'],
    host: {
      name: 'Mama Ngina Properties',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      phone: '+254 711 222333'
    },
    views: 1805,
    likes: 95
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    propertyId: 'prop-1',
    title: 'Touring this modern 1-bedroom in Kilimani, Nairobi! Beautiful backup gen and high pressure water! 😍',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-4817-large.mp4',
    likes: 342,
    views: 4210,
    commentCount: 45,
    propertyTitle: 'Modern Cozy 1-Bedroom Apartment',
    propertyPrice: 'Ksh 32,000/mo'
  },
  {
    id: 'reel-2',
    propertyId: 'prop-3',
    title: 'Full walkthrough of the executive 4-bedroom villa with mature garden in Kileleshwa! Pure luxury! ✨',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-in-luxurious-house-42037-large.mp4',
    likes: 895,
    views: 12530,
    commentCount: 112,
    propertyTitle: 'Serene Executive 4-Bedroom Villa',
    propertyPrice: 'Ksh 120,000/mo'
  },
  {
    id: 'reel-3',
    propertyId: 'prop-4',
    title: 'Looking for a hostel near USIU? Check out this fully-equipped student en-suite. Private & cozy! 🎓📚',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-home-office-with-cozy-lighting-40552-large.mp4',
    likes: 195,
    views: 2900,
    commentCount: 28,
    propertyTitle: 'Elite Student Hostel (Private En-suite)',
    propertyPrice: 'Ksh 14,500/mo'
  }
];

export const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-1',
    type: 'Scam',
    location: 'Roysambu Bypass',
    title: 'Fake Landlord demanding viewing fees via M-Pesa',
    description: 'Beware of a listing claiming to be behind Naivas Roysambu. The agent using phone number 0722-XXX-918 demands a Ksh 1,500 "booking/viewing fee" via M-Pesa STK push. Once paid, they switch off their phone. Verified fraud!',
    upvotes: 42,
    reportedBy: 'Kariuki_W',
    date: '2026-06-23',
    status: 'Verified Scam'
  },
  {
    id: 'rep-2',
    type: 'Water',
    location: 'Kilimani Area 3',
    title: 'Severe water rationing this week',
    description: 'Nairobi Water Company has cut municipal supply for the next 4 days due to repair works on the pipe near Ngong road. Ensure your buildings borehole or reservoir pumps are running.',
    upvotes: 18,
    reportedBy: 'Nelly_M',
    date: '2026-06-24',
    status: 'Active'
  },
  {
    id: 'rep-3',
    type: 'Power',
    location: 'Juja Road / Ngara',
    title: 'Transformer blown, blackouts expected',
    description: 'KPLC transformer blew yesterday near the roundabout. Kenya Power team is currently on-site but full replacement might take up to 24 hours. Plan for backups.',
    upvotes: 25,
    reportedBy: 'Dennis_Omondi',
    date: '2026-06-24',
    status: 'Investigating'
  }
];

export const INITIAL_QUESTS: UserQuest[] = [
  {
    id: 'q-1',
    name: 'First Property Inquiry',
    description: 'Send a simulated inquiry to any agent in the chat room.',
    xpReward: 100,
    completed: false,
    icon: '💬'
  },
  {
    id: 'q-2',
    name: 'AI Affordability Check',
    description: 'Use the AI salary-based recommender to find matching areas.',
    xpReward: 150,
    completed: false,
    icon: '🤖'
  },
  {
    id: 'q-3',
    name: 'Scam Reporter',
    description: 'File a community trust & safety warning report.',
    xpReward: 200,
    completed: false,
    icon: '🛡️'
  },
  {
    id: 'q-4',
    name: 'Daily Spin Wheel',
    description: 'Spin the Makao Yetu daily wheel to unlock a reward.',
    xpReward: 50,
    completed: false,
    icon: '🎡'
  }
];

export const INITIAL_BADGES: UserBadge[] = [
  {
    id: 'b-1',
    name: 'Rookie Explorer',
    icon: '🧭',
    description: 'Created your Makao Yetu profile and browsed properties.',
    dateEarned: '2026-06-24'
  }
];
