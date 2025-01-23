"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Title } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const MovieSliderUpdated = ({ movies = [] }: { movies: Title[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const getPrevIndex = () => (current - 1 + movies.length) % movies.length;
  const getNextIndex = () => (current + 1) % movies.length;

  // Background particle effect
  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(200)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
          }}
          animate={{
            y: window.innerHeight + 10,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0" />
      <Particles />

      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 8000,
          }),
        ]}
        opts={{
          align: "center",
          loop: true,
          // containScroll: "trimSnaps",
          //   dragFree: true,
        }}
        className="relative"
      >
        <CarouselContent>
          {movies.map((movie, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full flex items-center justify-center">
                <div className="flex items-center justify-center gap-16">
                  {/* Previous Movie Preview */}
                  <motion.div
                    className="relative w-[250px] cursor-pointer"
                    animate={{
                      scale: 0.8,
                      rotateY: 30,
                      opacity: 0.5,
                      filter: "brightness(0.6)",
                    }}
                    whileHover={{
                      scale: 0.85,
                      opacity: 0.7,
                    }}
                    onClick={() => api?.scrollPrev()}
                  >
                    {movies[getPrevIndex()]?.primaryTitle ||
                      movies[movies?.length - 1]?.primaryTitle ||
                      "Movie Title"}
                    <Image
                      src={
                        movies[getPrevIndex()]?.posterUrl ||
                        "https://m.media-amazon.com/images/M/MV5BYjVjYmUyNTItOTRjNi00YjNjLWEyNzAtMGViMTcwYTk1ODMyXkEyXkFqcGc@._V1_.jpg"
                      }
                      alt="Previous movie"
                      className="rounded-lg shadow-2xl"
                      width={250}
                      height={375}
                      style={{ objectFit: "cover" }}
                    />
                  </motion.div>

                  {/* Current Movie */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      className="relative z-10 flex gap-8 max-w-[860px] w-full"
                      initial={{ scale: 1, opacity: 0.3 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1, opacity: 0.3 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      {/* Movie Poster */}
                      <div className="relative w-[300px]">
                        <div className="absolute -inset-2 bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-lg blur-xl" />
                        <Image
                          src={
                            movie?.posterUrl ||
                            "https://m.media-amazon.com/images/M/MV5BYjVjYmUyNTItOTRjNi00YjNjLWEyNzAtMGViMTcwYTk1ODMyXkEyXkFqcGc@._V1_.jpg"
                          }
                          alt={movie?.primaryTitle}
                          className="relative rounded-lg shadow-[0_0_30px_rgba(147,51,234,0.3)]"
                          width={300}
                          height={450}
                          style={{ objectFit: "cover" }}
                        />
                        <motion.button
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 rounded-full font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Book Now
                        </motion.button>
                      </div>

                      {/* Movie Details */}
                      <div className="text-white max-w-xl">
                        <Link href={`/movie/${movie.id}`}>
                          <h1 className="text-4xl font-bold mb-3">
                            {movie?.primaryTitle || "Movie Title"}
                          </h1>
                        </Link>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-2 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 fill-yellow-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                          <span className="text-gray-400 ml-2">
                            180k voters
                          </span>
                        </div>

                        <p className="text-gray-300 mb-8 leading-relaxed">
                          {movie?.plot || "Movie description goes here..."}
                        </p>

                        {/* Cast */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-3">Cast:</h3>
                          <div className="flex items-center gap-2">
                            {[...Array(7)].map((_, i) => (
                              <Avatar
                                key={i}
                                className="w-10 h-10 border-2 border-purple-900/50"
                              >
                                <Image
                                  src="/api/placeholder/40/40"
                                  alt="cast"
                                  className="w-full h-full object-cover"
                                  width={40}
                                  height={40}
                                />
                              </Avatar>
                            ))}
                            <motion.button
                              className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                          <motion.button
                            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Play Now
                          </motion.button>
                          <motion.button
                            className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Watch Trailer
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Next Movie Preview */}
                  <motion.div
                    className="relative w-[250px] cursor-pointer"
                    animate={{
                      scale: 0.8,
                      rotateY: -30,
                      opacity: 0.5,
                      filter: "brightness(0.6)",
                    }}
                    whileHover={{
                      scale: 0.85,
                      opacity: 0.7,
                    }}
                    onClick={() => api?.scrollNext()}
                  >
                    {movies[getNextIndex()]?.primaryTitle ||
                      movies[0]?.primaryTitle ||
                      "Movie Title"}
                    <Image
                      src={
                        movies[getNextIndex()]?.posterUrl ||
                        "https://m.media-amazon.com/images/M/MV5BYjVjYmUyNTItOTRjNi00YjNjLWEyNzAtMGViMTcwYTk1ODMyXkEyXkFqcGc@._V1_.jpg"
                      }
                      alt="Next movie"
                      className="rounded-lg shadow-2xl"
                      width={250}
                      height={375}
                      style={{ objectFit: "cover" }}
                    />
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-2 flex items-center justify-center">
          <CarouselPrevious className="relative left-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
        </div>
        <div className="absolute top-1/2 right-2 flex items-center justify-center">
          <CarouselNext className="relative right-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
        </div>

        {/* Progress Indicator */}
        <div className="absolute mt-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(count)].map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-white w-4" : "bg-white/50"
              }`}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default MovieSliderUpdated;

export const TrendingMoviesSkeleton = () => (
  <div className="relative w-full h-screen overflow-hidden">
    <div className="flex items-center justify-center gap-16">
      {/* Previous Movie Skeleton */}
      <div className="relative w-[250px] opacity-50">
        <Skeleton className="h-[375px] w-[250px] rounded-lg" />
      </div>

      {/* Current Movie Skeleton */}
      <div className="relative z-10 flex gap-8">
        {/* Movie Poster Skeleton */}
        <div className="relative w-[300px]">
          <div className="absolute -inset-2 bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-lg blur-xl" />
          <Skeleton className="h-[450px] w-[300px] rounded-lg" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        {/* Movie Details Skeleton */}
        <div className="max-w-xl space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full" />

          {/* Cast Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* Next Movie Skeleton */}
      <div className="relative w-[250px] opacity-50">
        <Skeleton className="h-[375px] w-[250px] rounded-lg" />
      </div>
    </div>
  </div>
);
