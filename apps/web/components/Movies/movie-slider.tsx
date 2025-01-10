"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Title } from "../../types";

const MovieCarousel = ({ movies = [] }: { movies: Title[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const getPrevIndex = () => (currentIndex - 1 + movies.length) % movies.length;
  const getNextIndex = () => (currentIndex + 1) % movies.length;

  const handleNext = () => {
    setCurrentIndex(getNextIndex());
    setDragOffset(0);
  };

  const handlePrev = () => {
    setCurrentIndex(getPrevIndex());
    setDragOffset(0);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (info.offset.x < -100) {
      handleNext();
    } else if (info.offset.x > 100) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleDrag = (event, info) => {
    setDragOffset(info.offset.x);
  };

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

  //   Movie class
  //   "bg-[radial-gradient(circle_at_top,rgba(30,30,50,0.5),transparent)]"
  //   "bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]"
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 " />
      <Particles />

      <div className="relative h-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-16">
          {/* Previous Movie */}
          <motion.div
            className="relative w-[250px] cursor-pointer"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            animate={{
              x: isDragging ? dragOffset - 30 : 0,
              scale: 0.8,
              rotateY: 30,
              opacity: 0.5,
              filter: "brightness(0.6)",
            }}
            whileHover={{
              scale: 0.85,
              opacity: 0.7,
            }}
            onClick={handlePrev}
          >
            {movies[getPrevIndex()]?.primaryTitle ||
              movies[movies?.length - 1]?.primaryTitle ||
              "Movie Title"}
            <Image
              src={
                movies[getPrevIndex()]?.posterUrl || "/api/placeholder/250/375"
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
              key={currentIndex}
              className="relative z-10 flex gap-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: dragOffset,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                x: currentIndex > getNextIndex() ? 100 : -100,
              }}
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
                    movies[currentIndex]?.posterUrl ||
                    "/api/placeholder/300/450"
                  }
                  alt={movies[currentIndex]?.primaryTitle}
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
                <h1 className="text-4xl font-bold mb-3">
                  {movies[currentIndex]?.primaryTitle || "Movie Title"}
                </h1>

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
                  <span className="text-gray-400 ml-2">180k voters</span>
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">
                  {movies[currentIndex]?.plot ||
                    "Movie description goes here..."}
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

          {/* Next Movie */}
          <motion.div
            className="relative w-[250px] cursor-pointer"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            animate={{
              x: isDragging ? dragOffset + 30 : 0,
              scale: 0.8,
              rotateY: -30,
              opacity: 0.5,
              filter: "brightness(0.6)",
            }}
            whileHover={{
              scale: 0.85,
              opacity: 0.7,
            }}
            onClick={handleNext}
          >
            {movies[getNextIndex()]?.primaryTitle || "Movie Title"}
            <Image
              src={
                movies[getNextIndex()]?.posterUrl || "/api/placeholder/250/375"
              }
              alt="Next movie"
              className="rounded-lg shadow-2xl"
              width={250}
              height={375}
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <motion.button
            onClick={handlePrev}
            className="bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-full text-white backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={handleNext}
            className="bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-full text-white backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
