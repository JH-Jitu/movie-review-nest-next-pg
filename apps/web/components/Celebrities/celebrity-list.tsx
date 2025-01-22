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
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Popular Celebrities</h2>

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
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-muted">
                    <CardContent className="p-0">
                      <div className="relative h-[300px] w-full">
                        <Image
                          src={
                            celebrity.imageUrl || "/placeholder-celebrity.jpg"
                          }
                          alt={celebrity.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {celebrity.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {celebrity.knownFor?.map((role, idx) => (
                            <Badge key={idx} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Born: {celebrity.birthDate}</p>
                          <p>Nationality: {celebrity.nationality}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
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
