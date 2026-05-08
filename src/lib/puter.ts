// Puter.js service for cloud storage operations
// Uses Puter's Key-Value store for persistent data storage

import type { WatchlistItem } from "@/types/watchlist";

const WATCHLIST_KEY = "watchlist_items";

// Puter.js type declarations for TypeScript
declare global {
  interface Window {
    puter: {
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<void>;
      };
      auth: {
        signIn: () => Promise<{ username: string }>;
        signOut: () => Promise<void>;
        isSignedIn: () => boolean;
        getUser: () => Promise<{ username: string } | null>;
      };
    };
  }
}

// Check if Puter is available and initialized
export function isPuterAvailable(): boolean {
  return typeof window !== "undefined" && window.puter !== undefined;
}

// Get all watchlist items from Puter KV store
export async function getWatchlistItems(): Promise<WatchlistItem[]> {
  if (!isPuterAvailable()) {
    console.warn("Puter not available, using empty list");
    return [];
  }

  try {
    const data = await window.puter.kv.get(WATCHLIST_KEY);
    if (!data) return [];
    return JSON.parse(data) as WatchlistItem[];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
}

// Save all watchlist items to Puter KV store
export async function saveWatchlistItems(items: WatchlistItem[]): Promise<void> {
  if (!isPuterAvailable()) {
    console.warn("Puter not available, cannot save");
    return;
  }

  try {
    await window.puter.kv.set(WATCHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving watchlist:", error);
    throw error;
  }
}

// Add a new item to the watchlist
export async function addWatchlistItem(
  item: Omit<WatchlistItem, "id" | "createdAt" | "updatedAt">
): Promise<WatchlistItem> {
  const items = await getWatchlistItems();
  const newItem: WatchlistItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  items.push(newItem);
  await saveWatchlistItems(items);
  return newItem;
}

// Update an existing watchlist item
export async function updateWatchlistItem(
  id: string,
  updates: Partial<Omit<WatchlistItem, "id" | "createdAt">>
): Promise<WatchlistItem | null> {
  const items = await getWatchlistItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: Date.now(),
  };
  await saveWatchlistItems(items);
  return items[index];
}

// Delete a watchlist item
export async function deleteWatchlistItem(id: string): Promise<boolean> {
  const items = await getWatchlistItems();
  const filteredItems = items.filter((item) => item.id !== id);
  if (filteredItems.length === items.length) return false;

  await saveWatchlistItems(filteredItems);
  return true;
}

// Authentication helpers
export async function signIn(): Promise<{ username: string } | null> {
  if (!isPuterAvailable()) return null;

  try {
    return await window.puter.auth.signIn();
  } catch (error) {
    console.error("Sign in error:", error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  if (!isPuterAvailable()) return;

  try {
    await window.puter.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

export function isSignedIn(): boolean {
  if (!isPuterAvailable()) return false;
  return window.puter.auth.isSignedIn();
}

export async function getUser(): Promise<{ username: string } | null> {
  if (!isPuterAvailable()) return null;

  try {
    return await window.puter.auth.getUser();
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
