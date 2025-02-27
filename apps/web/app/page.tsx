"use client";

import React, { useState, useEffect } from "react";
import {
  useTitles,
  useQuickSearch,
  useTrendingTitles,
  useUpcomingTitles,
} from "@/hooks/api/use-titles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import { useDebounce } from "react-use";
import Pagination from "@/components/Pagination";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Filter from "@/components/Filter";
import MovieSliderUpdated, {
  TrendingMoviesSkeleton,
} from "@/components/Movies/movie-slider-up";
import CelebrityList from "@/components/Celebrities/celebrity-list";

interface Movie {
  id: string;
  primaryTitle: string;
  releaseDate: string;
  plot: string;
  posterUrl?: string;
}

interface Filters {
  page: number;
  limit: number;
  search?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 4 });
  const {
    data: movies,
    isLoading: allMoviesLoading,
    error: allMoviesError,
  } = useTitles(filters);
  const {
    data: trendingMovies,
    isLoading: trendMoviesLoading,
    error: trendMoviesError,
  } = useTrendingTitles();
  const {
    data: upcomingMovies,
    isLoading: upcomingMoviesLoading,
    error: upcomingMoviesError,
  } = useUpcomingTitles();
  const [showCommand, setShowCommand] = useState(false);

  // Debounce the search query
  useDebounce(
    () => {
      setDebouncedQuery(searchQuery);
    },
    300,
    [searchQuery]
  );

  // Use the debounced query for the search
  const { data: searchResults } = useQuickSearch(debouncedQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setFilters({ ...filters, search: searchQuery });
    } else {
      setFilters({ ...filters, search: undefined });
    }
    setShowCommand(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowCommand(e.target.value.length > 0);
  };

  const handleCommandSelect = (movie: Movie) => {
    setSearchQuery(movie?.primaryTitle);
    setFilters({ ...filters, search: movie?.primaryTitle });
    setShowCommand(false);
  };

  useEffect(() => {
    setShowCommand(
      debouncedQuery?.length > 0 && searchResults?.data?.length > 0
    );
  }, [debouncedQuery, searchResults]);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const totalMovies = movies?.meta?.total || 0;

  // Add this section to fetch celebrities data
  const celebrities = [
    {
      id: "1",
      name: "Tom Cruise",
      imageUrl:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQWifBffXRM97EKYWSlB07IHlaag72syUd7p50nswq_fUnnk_85fOpOuBs0PzswP7Mr3EG8CURhIqjYZD8GebpHpw",
      birthDate: "July 3, 1962",
      nationality: "American",
      knownFor: ["Actor", "Producer"],
      biography:
        "Thomas Cruise Mapother IV is an American actor and producer...",
    },
    {
      id: "2",
      name: "Tom Cruise",
      imageUrl:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQWifBffXRM97EKYWSlB07IHlaag72syUd7p50nswq_fUnnk_85fOpOuBs0PzswP7Mr3EG8CURhIqjYZD8GebpHpw",
      birthDate: "July 3, 1962",
      nationality: "American",
      knownFor: ["Actor", "Producer"],
      biography:
        "Thomas Cruise Mapother IV is an American actor and producer...",
    },
    {
      id: "3",
      name: "Tom Cruise",
      imageUrl:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQWifBffXRM97EKYWSlB07IHlaag72syUd7p50nswq_fUnnk_85fOpOuBs0PzswP7Mr3EG8CURhIqjYZD8GebpHpw",
      birthDate: "July 3, 1962",
      nationality: "American",
      knownFor: ["Actor", "Producer"],
      biography:
        "Thomas Cruise Mapother IV is an American actor and producer...",
    },
    {
      id: "4",
      name: "Tom Cruise",
      imageUrl:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQWifBffXRM97EKYWSlB07IHlaag72syUd7p50nswq_fUnnk_85fOpOuBs0PzswP7Mr3EG8CURhIqjYZD8GebpHpw",
      birthDate: "July 3, 1962",
      nationality: "American",
      knownFor: ["Actor", "Producer"],
      biography:
        "Thomas Cruise Mapother IV is an American actor and producer...",
    },
    {
      id: "5",
      name: "Tom Cruise",
      imageUrl:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQWifBffXRM97EKYWSlB07IHlaag72syUd7p50nswq_fUnnk_85fOpOuBs0PzswP7Mr3EG8CURhIqjYZD8GebpHpw",
      birthDate: "July 3, 1962",
      nationality: "American",
      knownFor: ["Actor", "Producer"],
      biography:
        "Thomas Cruise Mapother IV is an American actor and producer...",
    },
    // Add more celebrity data here
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Movies</h1>
      <form onSubmit={handleSearch} className="mb-4 relative">
        <div className="flex items-center">
          <Command>
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search movies..."
                onFocus={() => setShowCommand(searchQuery.length > 0)}
                className="border border-gray-300 rounded-l-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-200"
              >
                Search
              </button>
            </div>
            {showCommand && searchResults?.data && (
              <CommandList className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-11">
                {searchResults.data.map((movie: Movie) => (
                  <CommandItem
                    key={movie?.id}
                    onSelect={() => handleCommandSelect(movie)}
                    className="hover:bg-gray-200 cursor-pointer p-2 transition duration-200"
                  >
                    <div className="flex items-center">
                      {movie?.posterUrl && (
                        <Image
                          src={movie?.posterUrl || "/placeholder.png"}
                          alt={movie?.primaryTitle}
                          className="h-12 w-8 object-cover rounded-md mr-2"
                          width={32}
                          height={48}
                        />
                      )}
                      <div>
                        <div className="font-semibold">
                          {movie?.primaryTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {movie?.releaseDate}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            )}
          </Command>
        </div>
      </form>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mb-4">
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Movies</SheetTitle>
          </SheetHeader>
          <Filter
            onFilterChange={(filters) => {
              setFilters((prev) => ({ ...prev, ...filters }));
            }}
          />
        </SheetContent>
      </Sheet>

      {/* {movies && <MovieSlider movies={movies?.data} />} */}
      {trendMoviesLoading && <TrendingMoviesSkeleton />}

      {trendingMovies && <MovieSliderUpdated movies={trendingMovies?.data} />}

      {(!trendingMovies || trendingMovies?.data?.length === 0) && (
        <div>No movies found.</div>
      )}

      <h2 className="text-xl font-semibold mt-8">All Movies</h2>
      {(!movies || movies?.data?.length === 0) && <div>No movies found.</div>}
      {allMoviesLoading && <MoviesSkeleton />}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {allMoviesError ? (
          <div className="text-destructive">Error loading movies</div>
        ) : (
          movies?.data?.map((movie: Movie) => (
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
                  <h2 className="text-lg font-semibold">
                    {movie.primaryTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {movie.releaseDate}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={Math.ceil(totalMovies / filters.limit)}
        onPageChange={handlePageChange}
      />

      <h2 className="text-xl font-semibold mt-8">Upcoming Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {upcomingMovies?.data?.map((movie: Movie) => (
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Add the celebrities section */}
      <CelebrityList celebrities={celebrities} />
    </div>
  );
};

export default AllMoviesPage;
