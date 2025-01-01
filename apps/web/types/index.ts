// Enums
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum TitleType {
  MOVIE = "MOVIE",
  TV_SERIES = "TV_SERIES",
  TV_EPISODE = "TV_EPISODE",
  VIDEO_GAME = "VIDEO_GAME",
  SHORT_FILM = "SHORT_FILM",
  DOCUMENTARY = "DOCUMENTARY",
  TV_MOVIE = "TV_MOVIE",
  TV_SPECIAL = "TV_SPECIAL",
  TV_MINI_SERIES = "TV_MINI_SERIES",
  VIDEO = "VIDEO",
}

export enum CertificationType {
  G = "G",
  PG = "PG",
  PG13 = "PG13",
  R = "R",
  NC17 = "NC17",
  TV14 = "TV14",
  TVMA = "TVMA",
}

export enum WatchStatus {
  WANT_TO_WATCH = "WANT_TO_WATCH",
  WATCHING = "WATCHING",
  WATCHED = "WATCHED",
  STOPPED_WATCHING = "STOPPED_WATCHING",
}

// User types
export type UserRole = "ADMIN" | "MODERATOR" | "USER";

export interface UserStats {
  followers: number;
  following: number;
  reviews: number;
  ratings: number;
  lists: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  _count: UserStats;
}

export interface UserObj {
  id: number;
  name: string;
  role: UserRole;
}

export interface UserResponse {
  data: User;
  timestamp: string;
}

// Title types
export interface Title {
  id: string;
  titleType: TitleType;
  primaryTitle: string;
  originalTitle?: string;
  slug: string;
  releaseDate?: Date;
  endDate?: Date;
  isReleased: boolean;
  inTheaters: boolean;
  plot: string;
  storyline?: string;
  tagline?: string;
  runtime?: number;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  imdbRating?: number;
  numVotes: number;
  popularity: number;
  popularityRank?: number;
  budget?: number;
  revenue?: number;
  originalLanguage: string;
  color: boolean;
  aspectRatio?: string;
  parentSeriesId?: string;
}

// Person types
export interface Person {
  id: string;
  name: string;
  slug: string;
  birthDate?: Date;
  deathDate?: Date;
  birthPlace?: string;
  biography?: string;
  photoUrl?: string;
  height?: number;
}

// Cast and Crew types
export interface CastMember {
  id: string;
  titleId: string;
  personId: string;
  character: string;
  order: number;
  person: Person;
}

export interface CrewMember {
  id: string;
  titleId: string;
  personId: string;
  role: string;
  department: string;
  person: Person;
}

// Classification types
export interface Genre {
  id: string;
  name: string;
}

export interface Keyword {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Certification {
  id: string;
  type: CertificationType;
  country: string;
}

export interface ProductionCompany {
  id: string;
  name: string;
  country?: string;
}

// Review and Rating types
export interface Review {
  id: string;
  titleId: string;
  userId: number;
  content: string;
  rating?: number;
  helpfulVotes: number;
  spoilers: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments: Comment[];
}

export interface Rating {
  id: string;
  titleId: string;
  userId: number;
  value: number;
  createdAt: Date;
  user: User;
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

// List types
export interface List {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  items: ListItem[];
  user: User;
}

export interface ListItem {
  id: string;
  listId: string;
  titleId: string;
  notes?: string;
  order: number;
  title: Title;
}

// Watchlist and History types
export interface Watchlist {
  id: string;
  userId: number;
  titleId: string;
  status: WatchStatus;
  addedAt: Date;
  title: Title;
  user: User;
}

export interface WatchHistory {
  id: string;
  userId: number;
  titleId: string;
  watchedAt: Date;
  progress?: number;
  title: Title;
  user: User;
}

// Detailed Title type with relationships
export interface DetailedTitle extends Title {
  genres: Genre[];
  keywords: Keyword[];
  spokenLanguages: Language[];
  certification: Certification[];
  cast: CastMember[];
  crew: CrewMember[];
  production: ProductionCompany[];
  reviews: Review[];
  ratings: Rating[];
  similarTo: Title[];
  episodes?: Episode[];
}

// Episode type
export interface Episode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate?: Date;
  plot?: string;
}
