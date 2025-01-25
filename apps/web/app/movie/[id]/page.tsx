"use client";

import React, { useState } from "react";
import { useTitleDetails } from "@/hooks/api/use-titles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
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
  Facebook,
  Twitter,
  LinkIcon,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import CommentSection from "@/components/Comments/comment-section";
import type { Comment as MovieComment, User } from "@/types";

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

  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission
    console.log({ name, email, comment });
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    // Implement your comment creation logic here
  };

  const handleDeleteComment = async (commentId: string) => {
    // Implement your comment deletion logic here
  };

  const handleLikeComment = async (commentId: string) => {
    // Implement your like/unlike logic here
  };

  // Add mock comments data
  const mockComments: MovieComment[] = [
    {
      id: "1",
      content: "Great movie!",
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder-avatar.jpg",
        role: "USER",
      },
      likesCount: 5,
    },
  ];

  // Add mock current user
  const mockCurrentUser: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder-avatar.jpg",
    role: "USER",
  };

  if (isLoading) return <MovieSkeleton />;
  if (error) return <div className="text-destructive">Error loading movie</div>;
  if (!movie) return null;

  const images = [movie?.posterUrl, ...(movie?.screenshots || [])];
  console.log({ images });
  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden">
        {(movie?.backdropUrl || movie?.posterUrl) && (
          <Image
            src={movie?.backdropUrl || movie?.posterUrl}
            alt="backdrop"
            fill
            className="object-cover"
            priority
          />
        )}
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
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                {images?.length > 0 ? (
                  <>
                    {images[currentImageIndex] === null ? (
                      "No Image"
                    ) : (
                      <Image
                        src={images[currentImageIndex]}
                        alt={movie?.primaryTitle}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className=""
                          onClick={() =>
                            setCurrentImageIndex(
                              (prev) =>
                                (prev - 1 + images.length) % images.length
                            )
                          }
                          disabled={images.length <= 1}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className=""
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
                  </>
                ) : (
                  <Image
                    src="/images/placeholder.jpg"
                    alt="Movie placeholder"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
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
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {movie?.primaryTitle}
              </motion.h1>

              <div className="flex flex-wrap gap-4  mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{movie?.imdbRating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>
                    {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(movie?.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-lg  leading-relaxed">{movie?.plot}</p>
            </div>

            {/* Genres */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold ">Genres</h2>
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
                <h2 className="text-xl font-semibold ">Production</h2>
                <div className="space-y-2">
                  {movie?.production.map((prod) => (
                    <div key={prod.id} className="flex items-center gap-2 ">
                      <Globe className="h-4 w-4" />
                      <span>{prod.name}</span>
                      <span className="/60">({prod.country})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold ">Certification</h2>
                <div className="space-y-2">
                  {movie?.certification.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-2 ">
                      <Award className="h-4 w-4" />
                      <span>{cert.type}</span>
                      <span className="/60">({cert.country})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Overview */}
            <Card className="backdrop-blur-md bg-white/5 border shadow-lg border-none">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 ">Overview</h2>
                <p className=" leading-relaxed">{movie?.plot}</p>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="backdrop-blur-md bg-white/5 border shadow-lg border-none">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 ">Leave a Reply</h2>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/20 border-none placeholder:/60 "
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/20 border-none placeholder:/60 "
                    />
                  </div>
                  <Textarea
                    placeholder="Your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                    className="bg-white/20 border-none placeholder:/60 "
                  />
                  <Button
                    type="submit"
                    className="bg-white/20 hover:bg-white/30 "
                  >
                    Post Comment
                  </Button>
                </form>
              </CardContent>
            </Card>

            <CommentSection
              comments={mockComments}
              currentUser={mockCurrentUser}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onLikeComment={handleLikeComment}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Movie Details */}
            <Card className="backdrop-blur-md bg-white/5 border shadow-lg border-none">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 ">Release Date</h3>
                  <p className="">
                    {format(new Date(movie?.releaseDate), "MMMM d, yyyy")}
                  </p>
                </div>
                <Separator className="bg-white/20" />
                <div>
                  <h3 className="font-semibold mb-2 ">Runtime</h3>
                  <p className="">
                    {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                  </p>
                </div>
                <Separator className="bg-white/20" />
                <div>
                  <h3 className="font-semibold mb-2 ">Share</h3>
                  <div className="flex gap-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className=" hover:bg-white/20"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className=" hover:bg-white/20"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className=" hover:bg-white/20"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className=" hover:bg-white/20"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advertisement Space */}
            <Card className="backdrop-blur-md dark:bg-white/5 bg-black/5 border-none">
              <CardContent className="p-6">
                <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center">
                  <p className="/60">Advertisement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
              className="absolute top-2 right-2 "
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
