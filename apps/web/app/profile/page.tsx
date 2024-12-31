// app/(main)/profile/page.tsx

"use client";

import React, { useState } from "react";
import { getAvatarUrl, useUser } from "@/hooks/api/use-user";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Link as LinkIcon,
  Mail,
  CalendarDays,
  CheckIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import {
  ChangePasswordModal,
  EditProfileModal,
} from "@/components/Profile/edit-profile-modal";
import { Container } from "@/components/static-class";

const ProfileSkeleton = () => (
  <div className={Container}>
    <div className="space-y-4 p-8">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

const StatsCard = ({ label, value }: { label: string; value: number }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group"
  >
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ProfilePage = () => {
  const [copied, setCopied] = useState("");

  const { data: userResponse, isLoading, error } = useUser();
  const user = userResponse?.data;

  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return <div className="text-destructive">Error loading profile</div>;
  if (!user) return null;

  const handleCopy = (text: string, type: string) => {
    navigator?.clipboard?.writeText(text || "Nothing");
    setCopied(type);
    setTimeout(() => setCopied(""), 2000); // Reset after 2 seconds
  };

  return (
    <motion.div className="container mx-auto p-4 space-y-6">
      <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <CardHeader className="relative pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400"
          />
          <div className="relative z-10 flex items-end justify-between">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-end space-x-4"
            >
              <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20 transition-transform hover:scale-105">
                <AvatarImage
                  src={getAvatarUrl(user.avatar) || user?.avatar || undefined}
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-white text-shadow">
                  {user.name}
                </h1>
                <p className="text-white/80">{user.role}</p>
              </div>
            </motion.div>
            <div className="flex gap-2">
              <EditProfileModal user={user} />
              <ChangePasswordModal />
            </div>
          </div>
        </CardHeader>
        <CardContent className="backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {user.bio && (
              <p className="text-muted-foreground leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.location && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </motion.div>
              )}

              {user.website && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1"
                >
                  <div
                    onClick={() =>
                      handleCopy(user?.website || "Nothing", "website")
                    }
                    className="relative"
                  >
                    {copied === "website" ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <LinkIcon className="h-4 w-4 cursor-pointer" />
                    )}
                  </div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={user.website}
                    className="hover:underline hover:text-[#2563eb] transition-colors"
                  >
                    {user.website}
                  </a>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1"
              >
                <div
                  onClick={() => handleCopy(user?.email || "Nothing", "email")}
                  className="relative"
                >
                  {copied === "email" ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <Mail className="h-4 w-4 cursor-pointer" />
                  )}
                </div>
                {user.email}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1"
              >
                <CalendarDays className="h-4 w-4" />
                Joined{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </motion.div>
              {/* Similar motion.div for other info items */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <StatsCard label="Followers" value={user._count.followers} />
              <StatsCard label="Following" value={user._count.following} />
              <StatsCard label="Reviews" value={user._count.reviews} />
              <StatsCard label="Ratings" value={user._count.ratings} />
              <StatsCard label="Lists" value={user._count.lists} />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
