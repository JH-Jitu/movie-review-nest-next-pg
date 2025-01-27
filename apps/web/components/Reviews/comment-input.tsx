"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

interface CommentInputProps {
  user: any;
  onSubmit: (content: string) => void;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

export function CommentInput({
  user,
  onSubmit,
  placeholder = "Write a comment...",
  buttonText = "Comment",
  autoFocus = false,
}: CommentInputProps) {
  const [content, setContent] = React.useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8">
        {user?.avatar && (
          <Image
            src={user?.avatar || "/placeholder-avatar.jpg"}
            alt={user?.name || "User"}
            width={32}
            height={32}
            className="object-cover"
          />
        )}
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px]"
          autoFocus={autoFocus}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
