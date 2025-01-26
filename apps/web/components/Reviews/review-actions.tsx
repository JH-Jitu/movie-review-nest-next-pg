"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { axiosInstance } from "@/config/axios";
import Link from "next/link";

export function ReviewActions({ review }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.fullUser);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(`/reviews/${review.id}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("Failed to like review");
    },
  });

  const repostMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(`/reviews/${review.id}/repost`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(
        review.isReposted ? "Removed repost" : "Reposted successfully"
      );
    },
    onError: () => {
      toast.error("Failed to repost");
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(`/reviews/${review.id}/share`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // Copy the review URL to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/reviews/${review.id}`
      );
      toast.success("Review link copied to clipboard!");
    },
    onError: () => {
      toast.error("Failed to share review");
    },
  });

  const handleAction = (action: () => void) => {
    if (!user) {
      toast.error("Please sign in");
      return;
    }
    action();
  };

  return (
    <div className="flex gap-4 w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction(likeMutation.mutate)}
      >
        <Heart
          className={`mr-2 h-4 w-4 ${
            review.isLiked ? "fill-red-500 text-red-500" : ""
          }`}
        />
        {review.likes?.length || 0}
      </Button>

      <Link href={`/reviews/${review.id}`}>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          {review.comments?.length || 0}
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction(repostMutation.mutate)}
      >
        <Repeat2
          className={`mr-2 h-4 w-4 ${
            review.isReposted ? "fill-green-500 text-green-500" : ""
          }`}
        />
        {review.reposts?.length || 0}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction(shareMutation.mutate)}
      >
        <Share2 className="mr-2 h-4 w-4" />
        {review.shares?.length || 0}
      </Button>
    </div>
  );
}
