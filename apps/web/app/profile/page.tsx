// app/(main)/profile/page.tsx

"use client";

import React, { useState } from "react";
import { getAvatarUrl, useUser } from "@/hooks/api/use-user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Link as LinkIcon,
  Mail,
  CalendarDays,
  CheckIcon,
  Star,
  Users,
  FileText,
  List,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChangePasswordModal,
  EditProfileModal,
} from "@/components/Profile/edit-profile-modal";

const ProfileSkeleton = () => (
  <div className="container mx-auto p-4 space-y-6">
    <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
      <CardHeader className="relative pb-20">
        <Skeleton className="h-32 w-full rounded-md" />
      </CardHeader>
      <CardContent className="backdrop-blur-sm">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  </div>
);

const StatsCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-5 w-5" />
    <span className="font-semibold">{value}</span>
    <span className="text-muted-foreground">{label}</span>
  </div>
);

const ProfilePage = () => {
  const [copied, setCopied] = useState("");
  const { data: userResponse, isLoading, error } = useUser();
  const user = userResponse?.data;

  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return <div className="text-destructive">Error loading profile</div>;
  if (!user) return null;

  // const handleCopy = (text: string, type: string) => {
  //   navigator?.clipboard?.writeText(text || "Nothing");
  //   setCopied(type);
  //   setTimeout(() => setCopied(""), 2000);
  // };
  // onClick={() => handleCopy(user?.email || "Nothing", "email")}

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" /> */}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-32 container mx-auto px-4"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Avatar and Stats */}
          <div className="lg:w-1/3">
            <div className="relative aspect-square rounded-lg overflow-hidden backdrop-blur-md bg-white/5 border shadow-lg border-none">
              <Avatar className="w-full h-full p-6">
                <AvatarImage
                  src={getAvatarUrl(user.avatar) || user?.avatar || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="text-6xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <EditProfileModal user={user} />
              <ChangePasswordModal />
            </div>
          </div>

          {/* Right Column - User Details */}
          <div className="lg:w-2/3 space-y-8">
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {user.name}
              </motion.h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <StatsCard
                  icon={Users}
                  label="Followers"
                  value={user._count.followers}
                />
                <StatsCard
                  icon={Users}
                  label="Following"
                  value={user._count.following}
                />
                <StatsCard
                  icon={FileText}
                  label="Reviews"
                  value={user._count.reviews}
                />
                <StatsCard
                  icon={Star}
                  label="Ratings"
                  value={user._count.ratings}
                />
                <StatsCard
                  icon={List}
                  label="Lists"
                  value={user._count.lists}
                />
              </div>

              {user.bio && (
                <p className="text-lg leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="space-y-2">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
