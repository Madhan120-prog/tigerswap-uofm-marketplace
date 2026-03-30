// ============================================
// TigerSwap — Mock Data & Types
// ============================================

export type ListingType = 'free' | 'sell' | 'trade';
export type ListingStatus = 'available' | 'reserved' | 'completed';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export type Category =
  | 'Textbooks'
  | 'Electronics'
  | 'Furniture'
  | 'Kitchen'
  | 'Clothing'
  | 'Dorm Essentials'
  | 'Sports'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Kitchen',
  'Clothing',
  'Dorm Essentials',
  'Sports',
  'Other',
];

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  price: number | null; // null for free/trade
  category: Category;
  condition: Condition;
  images: string[]; // placeholder URLs
  createdAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    itemsListed: number;
    itemsGiven: number;
  };
}

// Placeholder image generator (colored rectangles via data URIs won't work well,
// so we'll use emoji-based placeholders rendered in the component)
const PLACEHOLDER_IMAGES = [
  '/placeholder/item1.jpg',
  '/placeholder/item2.jpg',
  '/placeholder/item3.jpg',
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Calculus: Early Transcendentals (8th Ed)',
    description:
      'Used for MATH 1920. Minimal highlighting, no torn pages. Cover has some wear but the binding is solid. Includes access code (unused).',
    type: 'sell',
    status: 'available',
    price: 35,
    category: 'Textbooks',
    condition: 'Good',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-24T10:30:00Z',
    seller: {
      id: 'u1',
      name: 'Jordan Mitchell',
      email: 'jmitch@memphis.edu',
      avatar: '',
      itemsListed: 5,
      itemsGiven: 2,
    },
  },
  {
    id: '2',
    title: 'Mini Fridge — Galanz 3.3 cu ft',
    description:
      'Perfect for a dorm room. Works great, just upgrading to a bigger one. Comes with the original ice tray. Pick up near Centennial Place.',
    type: 'sell',
    status: 'available',
    price: 60,
    category: 'Dorm Essentials',
    condition: 'Like New',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-23T14:00:00Z',
    seller: {
      id: 'u2',
      name: 'Aisha Patel',
      email: 'apatel3@memphis.edu',
      avatar: '',
      itemsListed: 3,
      itemsGiven: 1,
    },
  },
  {
    id: '3',
    title: 'IKEA Desk Lamp (White)',
    description:
      'Adjustable LED desk lamp. Great condition — used for one semester. Free to a good home, just come pick it up!',
    type: 'free',
    status: 'available',
    price: null,
    category: 'Furniture',
    condition: 'Good',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-23T09:15:00Z',
    seller: {
      id: 'u3',
      name: 'Marcus Johnson',
      email: 'mj1994@memphis.edu',
      avatar: '',
      itemsListed: 8,
      itemsGiven: 5,
    },
  },
  {
    id: '4',
    title: 'TI-84 Plus CE Graphing Calculator',
    description:
      'Needed for engineering & math courses. Fully functional, comes with USB cable. Selling because I graduated.',
    type: 'sell',
    status: 'available',
    price: 75,
    category: 'Electronics',
    condition: 'Like New',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-22T16:45:00Z',
    seller: {
      id: 'u4',
      name: 'Wei Chen',
      email: 'wchen5@memphis.edu',
      avatar: '',
      itemsListed: 2,
      itemsGiven: 0,
    },
  },
  {
    id: '5',
    title: 'Coffee Maker — Keurig K-Mini',
    description:
      'Single serve coffee maker. Moving out and can\'t take it with me. Works perfectly — trade for a portable Bluetooth speaker or take it free!',
    type: 'trade',
    status: 'available',
    price: null,
    category: 'Kitchen',
    condition: 'Good',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-22T11:20:00Z',
    seller: {
      id: 'u5',
      name: 'Taylor Brooks',
      email: 'tbrooks@memphis.edu',
      avatar: '',
      itemsListed: 4,
      itemsGiven: 3,
    },
  },
  {
    id: '6',
    title: 'UofM Tiger Hoodie (XL)',
    description:
      'Official University of Memphis hoodie. Worn a few times, still in great shape. Go Tigers! 🐯',
    type: 'sell',
    status: 'available',
    price: 20,
    category: 'Clothing',
    condition: 'Like New',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-21T18:30:00Z',
    seller: {
      id: 'u1',
      name: 'Jordan Mitchell',
      email: 'jmitch@memphis.edu',
      avatar: '',
      itemsListed: 5,
      itemsGiven: 2,
    },
  },
  {
    id: '7',
    title: 'Yoga Mat + Resistance Bands Set',
    description:
      'Barely used yoga mat (6mm thick) plus a set of 5 resistance bands. Perfect for dorm workouts. Giving away — just pick up from South Hall!',
    type: 'free',
    status: 'available',
    price: null,
    category: 'Sports',
    condition: 'Like New',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-21T12:00:00Z',
    seller: {
      id: 'u3',
      name: 'Marcus Johnson',
      email: 'mj1994@memphis.edu',
      avatar: '',
      itemsListed: 8,
      itemsGiven: 5,
    },
  },
  {
    id: '8',
    title: '27" Dell Monitor — Full HD',
    description:
      'Dell SE2722H monitor, 1080p. Perfect second screen for coding or studying. No dead pixels. Comes with HDMI cable.',
    type: 'sell',
    status: 'available',
    price: 95,
    category: 'Electronics',
    condition: 'Good',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-20T15:00:00Z',
    seller: {
      id: 'u2',
      name: 'Aisha Patel',
      email: 'apatel3@memphis.edu',
      avatar: '',
      itemsListed: 3,
      itemsGiven: 1,
    },
  },
  {
    id: '9',
    title: 'Microwave — Compact Hamilton Beach',
    description:
      'Small countertop microwave, 700W. Great for dorms. Free — just pick it up before Friday!',
    type: 'free',
    status: 'available',
    price: null,
    category: 'Kitchen',
    condition: 'Fair',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-20T08:45:00Z',
    seller: {
      id: 'u5',
      name: 'Taylor Brooks',
      email: 'tbrooks@memphis.edu',
      avatar: '',
      itemsListed: 4,
      itemsGiven: 3,
    },
  },
  {
    id: '10',
    title: 'Organic Chemistry Textbook + Solutions Manual',
    description:
      'Organic Chemistry by Clayden (2nd Ed) plus the solutions manual. Some highlighting but very legible. Trade for a physics or biology textbook.',
    type: 'trade',
    status: 'available',
    price: null,
    category: 'Textbooks',
    condition: 'Good',
    images: PLACEHOLDER_IMAGES,
    createdAt: '2026-03-19T13:00:00Z',
    seller: {
      id: 'u4',
      name: 'Wei Chen',
      email: 'wchen5@memphis.edu',
      avatar: '',
      itemsListed: 2,
      itemsGiven: 0,
    },
  },
];

export const MOCK_USER = {
  id: 'u1',
  name: 'Jordan Mitchell',
  email: 'jmitch@memphis.edu',
  avatar: '',
  joinedAt: '2026-01-15T00:00:00Z',
  itemsListed: 5,
  itemsGiven: 2,
  itemsSold: 3,
};

export function getListingById(id: string): Listing | undefined {
  return MOCK_LISTINGS.find((l) => l.id === id);
}

export function getListingsByCategory(category: Category): Listing[] {
  return MOCK_LISTINGS.filter((l) => l.category === category);
}

export function getListingsBySeller(sellerId: string): Listing[] {
  return MOCK_LISTINGS.filter((l) => l.seller.id === sellerId);
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
