"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  Star,
  Eye,
  EyeOff,
  Users,
  Trash2,
  Repeat2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReviewActions } from "./review-actions";
import { useAuthStore } from "@/stores/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReviewCardProps } from "@/types/review";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { Review } from "@/types/review";

export function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const user = useAuthStore((state) => state.fullUser);
  const isOwnReview = user?.id === parseInt(review.userId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isRepost = review.type === "repost";

  const renderVisibilityIcon = () => {
    if (!review?.visibility) return null;

    switch (review.visibility) {
      case "PUBLIC":
        return (
          <div title="Public">
            <Eye className="w-4 h-4 text-green-500" />
          </div>
        );
      case "FRIENDS":
        return (
          <div title="Friends Only">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
        );
      case "PRIVATE":
        return (
          <div title="Private">
            <EyeOff className="w-4 h-4 text-red-500" />
          </div>
        );
      default:
        return null;
    }
  };

  if (!review?.id || !review?.user) return null;

  return (
    <Card className="overflow-hidden backdrop-blur-md dark:bg-white/5 dark:drop-shadow-[0_4px_8px_rgba(255, 255, 255, 0.014)] bg-[#00000005] drop-shadow-lg border-none">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={review.user?.avatar || undefined} />
              <AvatarFallback>{review.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              {review.user?.id && (
                <Link href={`/profile/${review.user.id}`}>
                  <span className="font-semibold hover:underline">
                    {review.user?.name}
                  </span>
                </Link>
              )}
              <div className="flex items-center space-x-1">
                {review.createdAt && (
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt))} ago
                  </p>
                )}
                {renderVisibilityIcon()}
              </div>
            </div>
          </div>
          {isOwnReview && (
            <AlertDialog onOpenChange={() => setIsDropdownOpen(false)}>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger
                  className="h-8 w-8 flex 
                  items-center justify-center"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your review.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete?.(review.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isRepost && (
          <div className="flex items-center gap-2 mb-3 text-muted-foreground">
            <Repeat2 className="w-4 h-4" />
            <span>{review.repostedBy.name} reposted</span>
            <span className="text-sm">
              {formatDistanceToNow(new Date(review.repostDate))} ago
            </span>
          </div>
        )}

        {review.title && (
          <Link href={`/movie/${review.title.id}`}>
            <div className="flex items-center space-x-3">
              {review.title.posterPath && (
                <Image
                  src={review.title.posterPath}
                  alt={review.title.title}
                  width={50}
                  height={75}
                  className="rounded-md"
                />
              )}
              <div>
                <h3 className="font-semibold hover:underline">
                  {review.title?.primaryTitle}
                </h3>
                {review.rating && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review?.rating / 2
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        )}
      </CardHeader>

      {review.content && (
        <CardContent>
          <div
            className={isRepost ? "ml-4" : ""}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: review.content }}
          />
        </CardContent>
      )}

      <CardFooter className="border-t pt-4">
        <ReviewActions review={review} />
      </CardFooter>
    </Card>
  );
}
