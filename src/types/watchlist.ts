// Type definitions for watchlist items

export type MediaType = "movie" | "show";

export type WatchStatus = "want_to_watch" | "watching" | "watched";

export interface WatchlistItem {
  id: string;
  title: string;
  type: MediaType;
  status: WatchStatus;
  rating?: number; // 1-5 stars
  notes?: string;
  posterUrl?: string;
  year?: string;
  createdAt: number;
  updatedAt: number;
}

export interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;
}
