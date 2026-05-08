"use client";

import { useState, useEffect, useCallback } from "react";
import type { WatchlistItem, WatchStatus, MediaType } from "@/types/watchlist";
import {
  getWatchlistItems,
  addWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem,
  signIn as puterSignIn,
  signOut as puterSignOut,
  isSignedIn as puterIsSignedIn,
  getUser,
  isPuterAvailable,
} from "@/lib/puter";

// Custom hook for managing watchlist state with Puter.js
export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [puterReady, setPuterReady] = useState(false);

  // Wait for Puter to be available
  useEffect(() => {
    const checkPuter = () => {
      if (isPuterAvailable()) {
        setPuterReady(true);
        return true;
      }
      return false;
    };

    if (checkPuter()) return;

    // Poll for Puter availability
    const interval = setInterval(() => {
      if (checkPuter()) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setError("Puter.js failed to load. Please refresh the page.");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Load initial data when Puter is ready
  useEffect(() => {
    if (!puterReady) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const signedIn = puterIsSignedIn();
        setIsSignedIn(signedIn);

        if (signedIn) {
          const user = await getUser();
          setUsername(user?.username || null);
        }

        const watchlistItems = await getWatchlistItems();
        setItems(watchlistItems);
      } catch (err) {
        setError("Failed to load watchlist data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [puterReady]);

  // Sign in handler
  const signIn = useCallback(async () => {
    setError(null);
    try {
      const user = await puterSignIn();
      if (user) {
        setIsSignedIn(true);
        setUsername(user.username);
        const watchlistItems = await getWatchlistItems();
        setItems(watchlistItems);
      }
    } catch (err) {
      setError("Failed to sign in");
      console.error(err);
    }
  }, []);

  // Sign out handler
  const signOut = useCallback(async () => {
    setError(null);
    try {
      await puterSignOut();
      setIsSignedIn(false);
      setUsername(null);
      setItems([]);
    } catch (err) {
      setError("Failed to sign out");
      console.error(err);
    }
  }, []);

  // Add item handler
  const addItem = useCallback(
    async (item: {
      title: string;
      type: MediaType;
      status: WatchStatus;
      rating?: number;
      notes?: string;
      posterUrl?: string;
      year?: string;
    }) => {
      setError(null);
      try {
        const newItem = await addWatchlistItem(item);
        setItems((prev) => [...prev, newItem]);
        return newItem;
      } catch (err) {
        setError("Failed to add item");
        console.error(err);
        return null;
      }
    },
    []
  );

  // Update item handler
  const updateItem = useCallback(
    async (
      id: string,
      updates: Partial<Omit<WatchlistItem, "id" | "createdAt">>
    ) => {
      setError(null);
      try {
        const updatedItem = await updateWatchlistItem(id, updates);
        if (updatedItem) {
          setItems((prev) =>
            prev.map((item) => (item.id === id ? updatedItem : item))
          );
        }
        return updatedItem;
      } catch (err) {
        setError("Failed to update item");
        console.error(err);
        return null;
      }
    },
    []
  );

  // Delete item handler
  const deleteItem = useCallback(async (id: string) => {
    setError(null);
    try {
      const success = await deleteWatchlistItem(id);
      if (success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
      return success;
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
      return false;
    }
  }, []);

  return {
    items,
    isLoading,
    isSignedIn,
    username,
    error,
    signIn,
    signOut,
    addItem,
    updateItem,
    deleteItem,
  };
}
