export interface ReviewUser {
  id: string;
  name: string;
  avatar: string | null;
}

export interface ReviewMovie {
  id: string;
  primaryTitle: string;
  posterPath: string;
}

export interface Review {
  id: string;
  content: string;
  rating?: number;
  userId: string;
  titleId: string;
  visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE";
  createdAt: string;
  user?: ReviewUser;
  title: ReviewMovie;
}

export interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
}
