"use client";

import React, { useRef, useCallback } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useIntersection } from "@/hooks/use-intersection";
import { ReviewCard } from "@/components/Reviews/review-card";
import { CreateReviewForm } from "@/components/Reviews/create-review-form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { axiosInstance } from "@/config/axios";

function ReviewsFeedSkeleton() {
  return (
    <div className="space-y-6 container mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function ReviewsFeed() {
  const user = useAuthStore((state) => state.fullUser);
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["reviews"],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axiosInstance.get(
          `/reviews?page=${pageParam}&limit=10`
        );
        return data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.page < lastPage.meta.totalPages) {
          return lastPage.meta.page + 1;
        }
        return undefined;
      },
    });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  React.useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const { data } = await axiosInstance.post("/reviews", reviewData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review posted successfully!");
    },
  });

  if (isLoading) return <ReviewsFeedSkeleton />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {user && (
        <div className="mb-8">
          <CreateReviewForm onSubmit={createReviewMutation.mutate} />
        </div>
      )}

      <div className="space-y-6">
        {data?.pages.map((page) =>
          page?.data?.map((review, index) => {
            if (index === page.data.length - 1) {
              return (
                <div key={index} ref={ref}>
                  <ReviewCard review={review} />
                </div>
              );
            }
            return <ReviewCard key={index} review={review} />;
          })
        )}
      </div>

      {isFetchingNextPage && <ReviewsFeedSkeleton />}
    </div>
  );
}
