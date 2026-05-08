"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaType, WatchStatus, WatchlistItem } from "@/types/watchlist";
import { Film, Tv, Star } from "lucide-react";

interface AddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: {
    title: string;
    type: MediaType;
    status: WatchStatus;
    rating?: number;
    notes?: string;
    year?: string;
  }) => void;
  editItem?: WatchlistItem | null;
}

const statusOptions: { value: WatchStatus; label: string }[] = [
  { value: "want_to_watch", label: "Want to Watch" },
  { value: "watching", label: "Currently Watching" },
  { value: "watched", label: "Watched" },
];

export function AddEditDialog({
  open,
  onOpenChange,
  onSave,
  editItem,
}: AddEditDialogProps) {
  const [title, setTitle] = useState(editItem?.title || "");
  const [type, setType] = useState<MediaType>(editItem?.type || "movie");
  const [status, setStatus] = useState<WatchStatus>(
    editItem?.status || "want_to_watch"
  );
  const [rating, setRating] = useState<number>(editItem?.rating || 0);
  const [notes, setNotes] = useState(editItem?.notes || "");
  const [year, setYear] = useState(editItem?.year || "");

  // Reset form when dialog opens/closes or editItem changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTitle(editItem?.title || "");
      setType(editItem?.type || "movie");
      setStatus(editItem?.status || "want_to_watch");
      setRating(editItem?.rating || 0);
      setNotes(editItem?.notes || "");
      setYear(editItem?.year || "");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      type,
      status,
      rating: rating > 0 ? rating : undefined,
      notes: notes.trim() || undefined,
      year: year.trim() || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Item" : "Add to Watchlist"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movie or show title"
              required
            />
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year (optional)</Label>
            <Input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2024"
              maxLength={4}
            />
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "movie" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setType("movie")}
              >
                <Film className="w-4 h-4 mr-2" />
                Movie
              </Button>
              <Button
                type="button"
                variant={type === "show" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setType("show")}
              >
                <Tv className="w-4 h-4 mr-2" />
                TV Show
              </Button>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating (optional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? 0 : star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {editItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
