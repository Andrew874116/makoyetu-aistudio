export type PropertyType = 'rent' | 'sale' | 'land' | 'commercial' | 'hostel';

export interface PropertyHost {
  name: string;
  avatar: string;
  isVerified: boolean;
  phone: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  description: string;
  isVerified: boolean;
  rating: number;
  latitude: number;
  longitude: number;
  amenities: string[];
  host: PropertyHost;
  views: number;
  likes: number;
  featured?: boolean;
  promoted?: boolean;
}

export interface Reel {
  id: string;
  propertyId: string;
  title: string;
  videoUrl: string;
  likes: number;
  views: number;
  commentCount: number;
  isLiked?: boolean;
  propertyTitle: string;
  propertyPrice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface CommunityReport {
  id: string;
  type: 'Water' | 'Power' | 'Scam' | 'General';
  location: string;
  title: string;
  description: string;
  upvotes: number;
  reportedBy: string;
  date: string;
  status: 'Investigating' | 'Verified Scam' | 'Resolved' | 'Active';
}

export interface UserQuest {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  completed: boolean;
  icon: string;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned: string;
}
