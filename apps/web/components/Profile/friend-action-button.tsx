"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/config/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserMinus, UserPlus } from "lucide-react";

type FriendStatus = {
  status:
    | "FRIENDS"
    | "NOT_FRIENDS"
    | "REQUEST_SENT"
    | "REQUEST_RECEIVED"
    | "SELF";
  requestId?: string;
};

interface FriendActionButtonProps {
  status: FriendStatus;
  userId: string;
  onStatusChange?: () => void;
}

export function FriendActionButton({
  status,
  userId,
  onStatusChange,
}: FriendActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendRequest = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/users/${userId}/friend-request`);
      toast({
        title: "Friend request sent!",
        description: "They will be notified of your request.",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!status.requestId) return;
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/users/friend-requests/${status.requestId}/accept`
      );
      toast({
        title: "Friend request accepted!",
        description: "You are now friends.",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not accept friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!status.requestId) return;
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/users/friend-requests/${status.requestId}/reject`
      );
      toast({
        title: "Friend request rejected",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not reject friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!status.requestId) return;
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/users/friend-requests/${status.requestId}`);
      toast({
        title: "Friend request cancelled",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not cancel friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/users/friends/${userId}`);
      toast({
        title: "Friend removed",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove friend. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status.status === "SELF") {
    return <div />;
  }

  if (status.status === "NOT_FRIENDS") {
    return (
      <Button
        onClick={handleSendRequest}
        disabled={isLoading}
        variant="secondary"
        size="sm"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Add Friend
      </Button>
    );
  }

  if (status.status === "REQUEST_SENT") {
    return (
      <Button
        onClick={handleCancelRequest}
        disabled={isLoading}
        variant="secondary"
        size="sm"
      >
        Cancel Request
      </Button>
    );
  }

  if (status.status === "REQUEST_RECEIVED") {
    return (
      <div className="flex gap-2">
        <Button onClick={handleAcceptRequest} disabled={isLoading} size="sm">
          Accept
        </Button>
        <Button
          onClick={handleRejectRequest}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Reject
        </Button>
      </div>
    );
  }

  if (status.status === "FRIENDS") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <UserMinus className="w-4 h-4 mr-2" />
            Friends
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleRemoveFriend}>
            Remove Friend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}
