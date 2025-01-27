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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepost: (comment: string, visibility: string) => void;
  review: any;
}

export function RepostModal({
  isOpen,
  onClose,
  onRepost,
  review,
}: RepostModalProps) {
  const [comment, setComment] = React.useState("");
  const [visibility, setVisibility] = React.useState("PUBLIC");

  const handleRepost = () => {
    onRepost(comment, visibility);
    setComment("");
    setVisibility("PUBLIC");
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
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="FRIENDS">Friends Only</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
            </SelectContent>
          </Select>
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
