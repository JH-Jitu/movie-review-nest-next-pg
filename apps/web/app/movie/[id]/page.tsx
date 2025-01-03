"use client";

import React from "react";
import { useTitleDetails } from "@/hooks/api/use-titles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const MovieSkeleton = () => (
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

const MoviePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data, isLoading, error } = useTitleDetails(id);
  const movie = data?.data;

  if (isLoading) return <MovieSkeleton />;
  if (error) return <div className="text-destructive">Error loading movie</div>;
  if (!movie) return null;

  return (
    <motion.div className="container mx-auto p-4 space-y-6">
      <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <CardHeader className="relative pb-20">
          <div className="relative z-10 flex items-end justify-between">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20 transition-transform hover:scale-105">
              <AvatarImage
                src={movie.posterUrl || "/placeholder.png"}
                alt={movie.primaryTitle}
              />
              <AvatarFallback>{movie.primaryTitle.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-shadow">
                {movie.primaryTitle}
              </h1>
              <p className="text-gray-800 dark:text-white">
                {movie.releaseDate}
              </p>
              <p className="text-gray-800 dark:text-white">
                Rating: {movie.imdbRating}
              </p>
              <p className="text-gray-800 dark:text-white">
                Runtime: {movie.runtime} min
              </p>
              <p className="text-gray-800 dark:text-white">
                Budget: ${movie.budget}
              </p>
              <p className="text-gray-800 dark:text-white">
                Revenue: ${movie.revenue}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="backdrop-blur-sm">
          <p className="text-muted-foreground leading-relaxed">{movie.plot}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Genres:</span>
              {movie.genres.map((genre: { id: string; name: string }) => (
                <span key={genre.id} className="text-primary">
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span>Certification:</span>
              {movie.certification.map(
                (cert: { id: string; type: string; country: string }) => (
                  <span key={cert.id} className="text-primary">
                    {cert.type} ({cert.country})
                  </span>
                )
              )}
            </div>
            <div className="flex items-center gap-1">
              <span>Production:</span>
              {movie.production.map(
                (prod: { id: string; name: string; country: string }) => (
                  <span key={prod.id} className="text-primary">
                    {prod.name} ({prod.country})
                  </span>
                )
              )}
            </div>
            <div className="flex items-center gap-1">
              <span>Released:</span>
              <span>
                {movie.releaseDate &&
                  formatDistanceToNow(new Date(movie.releaseDate), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoviePage;
