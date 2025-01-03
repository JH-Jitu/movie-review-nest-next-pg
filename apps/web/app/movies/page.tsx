"use client";

import React from "react";
import { useTitles } from "@/hooks/api/use-titles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Movie {
  id: string;
  primaryTitle: string;
  releaseDate: string;
  plot: string;
  posterUrl?: string;
  // Add other relevant fields as needed
}

const MoviesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <Card
        key={index}
        className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
      >
        <CardHeader>
          <Skeleton className="h-48 w-full rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const AllMoviesPage = () => {
  const { data: movies, isLoading, error } = useTitles();
  console.log({ movies });
  if (isLoading) return <MoviesSkeleton />;
  if (error)
    return <div className="text-destructive">Error loading movies</div>;
  if (!movies || movies.length === 0) return <div>No movies found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {movies?.data?.map((movie: Movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 h-full flex flex-col">
              <CardHeader className="flex-grow">
                <Image
                  src={movie.posterUrl || "/placeholder.png"}
                  alt={movie.primaryTitle}
                  className="h-full w-full object-cover"
                  width={300}
                  height={450}
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <h2 className="text-lg font-semibold">{movie.primaryTitle}</h2>
                <p className="text-sm text-muted-foreground">
                  {movie.releaseDate}
                </p>
                <p className="text-sm">
                  {movie.plot.length > 100
                    ? `${movie.plot.substring(0, 100)}...`
                    : movie.plot}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesPage;
