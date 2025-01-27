"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepost: (comment: string) => void;
  review: any;
}

export function RepostModal({
  isOpen,
  onClose,
  onRepost,
  review,
}: RepostModalProps) {
  const [comment, setComment] = React.useState("");

  const handleRepost = () => {
    onRepost(comment);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Repost this review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{review.content}</p>
            <p className="text-sm text-muted-foreground mt-2">
              - {review.user.name}
            </p>
          </div>
          <Textarea
            placeholder="Add your thoughts (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleRepost}>Repost</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
