"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { axiosInstance } from "@/config/axios";
import Link from "next/link";
import { RepostModal } from "./repost-modal";
import { CommentInput } from "./comment-input";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export function ReviewActions({ review }) {
  const [isRepostModalOpen, setIsRepostModalOpen] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.fullUser);

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await axiosInstance.post(
        `/reviews/${review.id}/comments`,
        {
          content,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const handleAddComment = (content: string) => {
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }
    commentMutation.mutate(content);
  };

  // Cleanup function for comments
  React.useEffect(() => {
    return () => {
      setShowComments(false);
    };
  }, [review.id]);

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
    mutationFn: async (comment: string) => {
      const { data } = await axiosInstance.post(
        `/reviews/${review.id}/repost`,
        {
          comment,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Reposted successfully");
    },
    onError: () => {
      toast.error("Failed to repost");
    },
  });

  const handleRepost = (comment: string) => {
    repostMutation.mutate(comment);
  };

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
    <div className="space-y-4">
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
          {review._count?.likes || 0}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {review._count?.comments || 0}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => setIsRepostModalOpen(true))}
        >
          <Repeat2
            className={`mr-2 h-4 w-4 ${
              review.isReposted ? "fill-green-500 text-green-500" : ""
            }`}
          />
          {review._count?.reposts || 0}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(shareMutation.mutate)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {review._count?.shares || 0}
        </Button>
      </div>

      <RepostModal
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        onRepost={handleRepost}
        review={review}
      />

      {showComments && (
        <div className="mt-4 space-y-4">
          {user && (
            <CommentInput
              user={user}
              onSubmit={handleAddComment}
              placeholder="Write a comment..."
            />
          )}
          {review?.comments?.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <Image
                  src={comment.user.avatar || "/placeholder-avatar.jpg"}
                  alt={comment.user.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-medium text-sm">{comment.user.name}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <button className="hover:text-primary">Like</button>
                  <button className="hover:text-primary">Reply</button>
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
