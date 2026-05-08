"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WatchlistItem, WatchStatus } from "@/types/watchlist";
import {
  Film,
  Tv,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";

interface WatchlistCardProps {
  item: WatchlistItem;
  onEdit: (item: WatchlistItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: WatchStatus) => void;
}

const statusConfig: Record<
  WatchStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  want_to_watch: {
    label: "Want to Watch",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: <Clock className="w-3 h-3" />,
  },
  watching: {
    label: "Watching",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: <Eye className="w-3 h-3" />,
  },
  watched: {
    label: "Watched",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: <CheckCircle className="w-3 h-3" />,
  },
};

export function WatchlistCard({
  item,
  onEdit,
  onDelete,
  onStatusChange,
}: WatchlistCardProps) {
  const status = statusConfig[item.status];

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left side: Icon and content */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Type icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              {item.type === "movie" ? (
                <Film className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Tv className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-foreground truncate">
                  {item.title}
                </h3>
                {item.year && (
                  <span className="text-sm text-muted-foreground">
                    ({item.year})
                  </span>
                )}
              </div>

              {/* Rating */}
              {item.rating && (
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= item.rating!
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.notes}
                </p>
              )}

              {/* Status badge */}
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={`${status.color} text-xs font-medium`}
                >
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-8 w-8 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            >
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStatusChange(item.id, "want_to_watch")}
                disabled={item.status === "want_to_watch"}
              >
                <Clock className="w-4 h-4 mr-2" />
                Want to Watch
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(item.id, "watching")}
                disabled={item.status === "watching"}
              >
                <Eye className="w-4 h-4 mr-2" />
                Watching
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(item.id, "watched")}
                disabled={item.status === "watched"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Watched
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
