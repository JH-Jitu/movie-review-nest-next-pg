"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function ReviewActions({ review }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.fullUser);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${review.id}/like`, {
        method: review.isLiked ? "DELETE" : "POST",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  return (
    <div className="flex gap-4 w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          user ? likeMutation.mutate() : toast.error("Please sign in")
        }
      >
        <Heart
          className={`mr-2 h-4 w-4 ${review.isLiked ? "fill-red-500 text-red-500" : ""}`}
        />
        {review.likes?.length || 0}
      </Button>
      <Button variant="ghost" size="sm">
        <MessageCircle className="mr-2 h-4 w-4" />
        {review.comments?.length || 0}
      </Button>
      <Button variant="ghost" size="sm">
        <Repeat2 className="mr-2 h-4 w-4" />
        {review.reposts?.length || 0}
      </Button>
      <Button variant="ghost" size="sm">
        <Share2 className="mr-2 h-4 w-4" />
        {review.shares?.length || 0}
      </Button>
    </div>
  );
}
