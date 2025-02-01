"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  avatar: string | null;
}

interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  createdAt: string;
}

export function FriendRequestList() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: requests, refetch } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/me/friend-requests");
      return data;
    },
  });

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(`/users/friend-requests/${requestId}/accept`);
      toast({
        title: "Friend request accepted!",
        description: "You are now friends.",
      });
      refetch();
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

  const handleRejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(`/users/friend-requests/${requestId}/reject`);
      toast({
        title: "Friend request rejected",
      });
      refetch();
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

  if (!requests?.data?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No friend requests to show
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.data.map((request: FriendRequest) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={request.sender.avatar || undefined} />
              <AvatarFallback>{request.sender.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${request.sender.id}`}
                className="text-sm font-medium hover:underline"
              >
                {request.sender.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                Sent you a friend request
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAcceptRequest(request.id)}
                disabled={isLoading}
                size="sm"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRejectRequest(request.id)}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                Reject
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
