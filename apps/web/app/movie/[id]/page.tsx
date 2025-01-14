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
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="md:w-1/3">
          <img
            src={movie.posterUrl || "/placeholder.png"}
            alt={movie.primaryTitle}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {movie.primaryTitle}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {movie.releaseDate} | {movie.runtime} min | Rating:{" "}
            {movie.imdbRating}
          </p>
          <p className="text-gray-700 dark:text-gray-400 mt-2">{movie.plot}</p>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Genres:</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre: { id: string; name: string }) => (
                <span
                  key={genre.id}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Production:</h2>
            <div className="flex flex-wrap gap-2">
              {movie.production.map(
                (prod: { id: string; name: string; country: string }) => (
                  <span
                    key={prod.id}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    {prod.name} ({prod.country})
                  </span>
                )
              )}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Certification:</h2>
            <div className="flex flex-wrap gap-2">
              {movie.certification.map(
                (cert: { id: string; type: string; country: string }) => (
                  <span
                    key={cert.id}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    {cert.type} ({cert.country})
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">User Reviews</h2>
        {/* Add user reviews component here */}
      </div>
    </motion.div>
  );
};

export default MoviePage;
