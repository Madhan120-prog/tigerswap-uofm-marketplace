// ============================================================
// TigerSwap — Supabase DB Types (Epic 4)
// ============================================================

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

export interface Profile {
  id: string;
  name: string;
  items_listed: number;
  items_given: number;
  created_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  display_order: number;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  price: number | null;
  category: string;
  condition: Condition;
  created_at: string;
  // Joined fields
  seller?: Profile;
  images?: ListingImage[];
  // Convenience: first image url
  cover_image?: string | null;
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
