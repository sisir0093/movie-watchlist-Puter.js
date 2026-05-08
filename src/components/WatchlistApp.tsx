"use client";

import { useState, useMemo } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistCard } from "@/components/WatchlistCard";
import { AddEditDialog } from "@/components/AddEditDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { WatchlistItem, WatchStatus, MediaType } from "@/types/watchlist";
import {
  Plus,
  Search,
  Film,
  Tv,
  LogIn,
  LogOut,
  User,
  Loader2,
  Clapperboard,
  Clock,
  Eye,
  CheckCircle,
} from "lucide-react";

type FilterType = "all" | MediaType;
type FilterStatus = "all" | WatchStatus;

export function WatchlistApp() {
  const {
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
  } = useWatchlist();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, searchQuery, filterType, filterStatus]);

  // Count items by status
  const statusCounts = useMemo(() => {
    return {
      want_to_watch: items.filter((i) => i.status === "want_to_watch").length,
      watching: items.filter((i) => i.status === "watching").length,
      watched: items.filter((i) => i.status === "watched").length,
    };
  }, [items]);

  const handleAddClick = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditClick = (item: WatchlistItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSave = async (itemData: {
    title: string;
    type: MediaType;
    status: WatchStatus;
    rating?: number;
    notes?: string;
    year?: string;
  }) => {
    if (editingItem) {
      await updateItem(editingItem.id, itemData);
    } else {
      await addItem(itemData);
    }
    setEditingItem(null);
  };

  const handleStatusChange = async (id: string, status: WatchStatus) => {
    await updateItem(id, { status });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Watchlist</h1>
          </div>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={signIn}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Want to Watch</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {statusCounts.want_to_watch}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Watching</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {statusCounts.watching}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Watched</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {statusCounts.watched}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Type filter */}
            <div className="flex gap-1">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "movie" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("movie")}
              >
                <Film className="w-4 h-4 mr-1" />
                Movies
              </Button>
              <Button
                variant={filterType === "show" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("show")}
              >
                <Tv className="w-4 h-4 mr-1" />
                Shows
              </Button>
            </div>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Badge
            variant={filterStatus === "all" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilterStatus("all")}
          >
            All ({items.length})
          </Badge>
          <Badge
            variant={filterStatus === "want_to_watch" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilterStatus("want_to_watch")}
          >
            <Clock className="w-3 h-3 mr-1" />
            Want to Watch ({statusCounts.want_to_watch})
          </Badge>
          <Badge
            variant={filterStatus === "watching" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilterStatus("watching")}
          >
            <Eye className="w-3 h-3 mr-1" />
            Watching ({statusCounts.watching})
          </Badge>
          <Badge
            variant={filterStatus === "watched" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilterStatus("watched")}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Watched ({statusCounts.watched})
          </Badge>
        </div>

        {/* Watchlist items */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clapperboard className="w-16 h-16 text-muted-foreground/30 mb-4" />
            {items.length === 0 ? (
              <>
                <h2 className="text-xl font-medium text-muted-foreground mb-2">
                  Your watchlist is empty
                </h2>
                <p className="text-muted-foreground mb-4">
                  Start adding movies and shows to track what you want to watch
                </p>
                <Button onClick={handleAddClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium text-muted-foreground mb-2">
                  No results found
                </h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onEdit={handleEditClick}
                onDelete={deleteItem}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating add button */}
      <Button
        onClick={handleAddClick}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add/Edit dialog */}
      <AddEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editItem={editingItem}
      />

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Powered by{" "}
          <a
            href="https://developer.puter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Puter
          </a>
        </div>
      </footer>
    </div>
  );
}
