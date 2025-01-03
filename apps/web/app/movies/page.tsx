"use client";

import React, { useState, useEffect } from "react";
import { useTitles, useQuickSearch } from "@/hooks/api/use-titles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import { useDebounce } from "react-use";
import Pagination from "@/components/Pagination";

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
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 5 });
  const { data: movies, isLoading, error } = useTitles(filters);
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
    setSearchQuery(movie.primaryTitle);
    setFilters({ ...filters, search: movie.primaryTitle });
    setShowCommand(false);
  };

  useEffect(() => {
    setShowCommand(
      debouncedQuery.length > 0 && searchResults?.data?.length > 0
    );
  }, [debouncedQuery, searchResults]);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const totalMovies = movies?.meta?.total || 0;

  if (isLoading) return <MoviesSkeleton />;
  if (error)
    return <div className="text-destructive">Error loading movies</div>;
  if (!movies || movies?.data?.length === 0) return <div>No movies found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Movies</h1>
      <form onSubmit={handleSearch} className="mb-4 relative">
        <Command>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search movies..."
            onFocus={() => setShowCommand(searchQuery.length > 0)}
            className="border p-2 rounded w-full"
          />
          {showCommand && searchResults?.data && (
            <CommandList>
              {searchResults.data.map((movie: Movie) => (
                <CommandItem
                  key={movie.id}
                  onSelect={() => handleCommandSelect(movie)}
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  {movie.primaryTitle} - {movie.releaseDate}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          Search
        </button>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {movies?.data?.map((movie: Movie) => (
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
                <p className="text-sm">
                  {movie.plot.length > 100
                    ? `${movie.plot.substring(0, 100)}...`
                    : movie.plot}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={filters.page}
        totalPages={Math.ceil(totalMovies / filters.limit)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllMoviesPage;
