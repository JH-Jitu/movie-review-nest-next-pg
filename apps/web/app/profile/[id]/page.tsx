"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FriendList } from "@/components/Profile/friend-list";
import { FriendRequestList } from "@/components/Profile/friend-request-list";
import { ReviewCard } from "@/components/Reviews/review-card";
import { Review } from "@/types/review";
import { FriendActions } from "@/components/Profile/friend-actions";

// interface Review {
//   id: string;
//   content: string;
//   rating: number;
//   movieId: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
//   user: {
//     id: string;
//     name: string;
//     avatar: string | null;
//   };
//   movie: {
//     id: string;
//     title: string;
//     posterPath: string;
//   };
// }

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = useAuthStore((state) => state.fullUser);
  const [selectedTab, setSelectedTab] = useState("posts");
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", params.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users/${params.id}`);
      return data?.data;
    },
  });

  const { data: friendStatus } = useQuery({
    queryKey: ["friendStatus", params.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/users/${params.id}/friend-status`
      );
      return data;
    },
    enabled: !!user && user.id !== parseInt(params.id),
  });

  const { data: reviews } = useQuery<{ data: Review[] }>({
    queryKey: ["userReviews", params.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users/${params.id}/reviews`);
      return data;
    },
    enabled: selectedTab === "posts",
  });

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      queryClient.invalidateQueries({ queryKey: ["userReviews", params.id] });
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  if (isProfileLoading) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Profile not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
        <div className="absolute -bottom-16 left-8">
          <Avatar className="w-32 h-32 border-4 border-white">
            <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
            <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.bio}</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>{profile._count?.friends || 0} friends</span>
            <span>{profile._count?.reviews || 0} reviews</span>
          </div>
        </div>

        {user && user.id !== parseInt(params.id) && (
          <div>
            {/* <p>Debug: Current user ID: {user.id}</p>
            <p>Debug: Profile ID: {params.id}</p> */}
            <FriendActions userId={params.id} initialStatus={friendStatus} />
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="posts"
        className="mt-8"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          {user?.id === parseInt(params.id) && (
            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
          )}
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="space-y-6">
            {reviews?.data && reviews.data.length > 0 ? (
              reviews?.data?.map((review: Review) => (
                <>
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={() => handleDeleteReview(review.id)}
                  />
                  {/* <div key={review.id}>{review.content}</div> */}
                </>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No posts to show
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <FriendList userId={params.id} />
        </TabsContent>

        {user?.id === parseInt(params.id) && (
          <TabsContent value="requests" className="mt-6">
            <FriendRequestList />
          </TabsContent>
        )}

        <TabsContent value="about" className="mt-6">
          <div className="space-y-4">
            {profile.location && (
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-muted-foreground">{profile.location}</p>
              </div>
            )}
            {profile.website && (
              <div>
                <h3 className="font-medium">Website</h3>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
            <div>
              <h3 className="font-medium">Joined</h3>
              <p className="text-muted-foreground">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
