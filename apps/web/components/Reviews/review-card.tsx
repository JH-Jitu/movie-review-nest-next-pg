import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Repeat2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReviewActions } from "./review-actions";

export function ReviewCard({ review }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={review?.user?.avatar} />
            <AvatarFallback>{review?.user?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${review?.user.id}`}>
              <span className="font-semibold hover:underline">
                {review?.user?.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review?.createdAt))} ago
            </p>
          </div>
        </div>

        <Link href={`/movie/${review?.title?.id}`}>
          <div className="flex items-center space-x-3">
            {review?.title?.posterUrl && (
              <Image
                src={review?.title?.posterUrl}
                alt={review?.title?.primaryTitle}
                width={50}
                height={75}
                className="rounded-md"
              />
            )}
            <div>
              <h3 className="font-semibold hover:underline">
                {review?.title?.primaryTitle}
              </h3>
              {review?.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review?.rating / 2
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent>
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: review?.content }}
        />
        {review?.images?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {review?.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <ReviewActions review={review} />
      </CardFooter>
    </Card>
  );
}
