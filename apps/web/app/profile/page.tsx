// app/(main)/profile/page.tsx

"use client";

import React from "react";
import { useUser } from "@/hooks/api/use-user";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Link as LinkIcon, Mail, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ProfileSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-48 w-full" />
  </div>
);

const StatsCard = ({ label, value }: { label: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const ProfilePage = () => {
  const { data: userResponse, isLoading, error } = useUser();
  const user = userResponse?.data;

  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return <div className="text-destructive">Error loading profile</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="relative pb-20">
          <div className="absolute inset-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400" />
          <div className="relative z-10 flex items-end space-x-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-white/80">{user.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href={user.website} className="hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Joined{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <StatsCard label="Followers" value={user._count.followers} />
              <StatsCard label="Following" value={user._count.following} />
              <StatsCard label="Reviews" value={user._count.reviews} />
              <StatsCard label="Ratings" value={user._count.ratings} />
              <StatsCard label="Lists" value={user._count.lists} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
