"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Friend {
  id: number;
  name: string;
  avatar: string | null;
  bio: string | null;
  _count: {
    friends: number;
  };
}

interface FriendListProps {
  userId: string;
}

export function FriendList({ userId }: FriendListProps) {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users/${userId}/friends`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!friends?.data?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No friends to show
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.data.map((friend: Friend) => (
        <Card key={friend.id} className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={friend.avatar || undefined} />
              <AvatarFallback>{friend.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${friend.id}`}
                className="text-sm font-medium hover:underline"
              >
                {friend.name}
              </Link>
              <p className="text-sm text-muted-foreground truncate">
                {friend._count.friends} friends
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/profile/${friend.id}`}>View Profile</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
