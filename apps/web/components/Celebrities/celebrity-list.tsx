"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Celebrity } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CelebrityListProps {
  celebrities: Celebrity[];
}

const CelebrityList = ({ celebrities = [] }: CelebrityListProps) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Popular Celebrities
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover trending personalities from around the world
            </p>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {celebrities.map((celebrity, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group overflow-hidden bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-lg border-[0.5px] border-muted/30 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative h-[400px] w-full overflow-hidden">
                        <Image
                          src={
                            celebrity.imageUrl || "/placeholder-celebrity.jpg"
                          }
                          alt={celebrity.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-black/50 backdrop-blur-md border-white/10 text-white"
                          >
                            {celebrity.category || "Entertainment"}
                          </Badge>
                        </div>
                      </div>
                      <div className="relative p-6 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm">
                        <div className="absolute -top-8 left-6 h-16 w-16 rounded-full border-4 border-background overflow-hidden">
                          <Image
                            src={
                              celebrity.avatarUrl ||
                              celebrity.imageUrl ||
                              "/placeholder-avatar.jpg"
                            }
                            alt={`${celebrity.name} avatar`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="pt-8">
                          <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground/90">
                            {celebrity.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {celebrity.knownFor?.map((role, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-primary/5 hover:bg-primary/10 text-primary/80 border-primary/20 transition-colors duration-200"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-3 text-sm">
                            <p className="flex items-center gap-3 text-muted-foreground/80">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                🎂
                              </span>
                              <span className="font-medium">
                                {celebrity.birthDate}
                              </span>
                            </p>
                            <p className="flex items-center gap-3 text-muted-foreground/80">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                🌍
                              </span>
                              <span className="font-medium">
                                {celebrity.nationality}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 hover:bg-primary hover:text-white transition-colors duration-200" />
          <CarouselNext className="hidden md:flex -right-12 hover:bg-primary hover:text-white transition-colors duration-200" />
        </Carousel>
      </div>
    </section>
  );
};

export default CelebrityList;

export const CelebritiesListSkeleton = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="h-8 w-48 bg-muted rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <div className="h-[300px] bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
