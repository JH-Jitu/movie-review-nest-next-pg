"use client";

import React, { useState } from "react";
import { useTitleDetails } from "@/hooks/api/use-titles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Globe,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) return <MovieSkeleton />;
  if (error) return <div className="text-destructive">Error loading movie</div>;
  if (!movie) return null;

  const images = [movie?.posterUrl, ...(movie?.screenshots || [])];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden">
        <Image
          src={movie?.backdropUrl || movie?.posterUrl}
          alt="backdrop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-32 container mx-auto px-4"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Poster and Images */}
          <div className="lg:w-1/3">
            <div className="relative group">
              <motion.div
                className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl"
                layoutId={`movie-poster-${movie?.id}`}
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={movie?.primaryTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white"
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) => (prev - 1 + images.length) % images.length
                        )
                      }
                      disabled={images.length <= 1}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white"
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) => (prev + 1) % images.length
                        )
                      }
                      disabled={images.length <= 1}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button
                className="flex-1 gap-2"
                onClick={() => setShowTrailer(true)}
              >
                <Play className="h-4 w-4" />
                Watch Trailer
              </Button>
            </div>
          </div>

          {/* Right Column - Movie Details */}
          <div className="lg:w-2/3 space-y-8">
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {movie?.primaryTitle}
              </h1>

              <div className="flex flex-wrap gap-4 text-white/80 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{movie?.imdbRating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{movie?.runtime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{movie?.releaseDate}</span>
                </div>
              </div>

              <p className="text-lg text-white/80 leading-relaxed">
                {movie?.plot}
              </p>
            </div>

            {/* Genres */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie?.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Production & Certification */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Production</h2>
                <div className="space-y-2">
                  {movie?.production.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center gap-2 text-white/80"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{prod.name}</span>
                      <span className="text-white/60">({prod.country})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Certification
                </h2>
                <div className="space-y-2">
                  {movie?.certification.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center gap-2 text-white/80"
                    >
                      <Award className="h-4 w-4" />
                      <span>{cert.type}</span>
                      <span className="text-white/60">({cert.country})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trailer Dialog */}
      <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${movie?.trailerUrl}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 text-white"
              onClick={() => setShowTrailer(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoviePage;
