import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";

export const titleKeys = {
  all: ["titles"] as const,
  lists: () => [...titleKeys.all, "list"] as const,
  list: (filters: string) => [...titleKeys.lists(), { filters }] as const,
  details: () => [...titleKeys.all, "detail"] as const,
  detail: (id: string) => [...titleKeys.details(), id] as const,
  trending: () => [...titleKeys.all, "trending"] as const,
  upcoming: () => [...titleKeys.all, "upcoming"] as const,
  episodes: (id: string) => [...titleKeys.detail(id), "episodes"] as const,
  cast: (id: string) => [...titleKeys.detail(id), "cast"] as const,
  crew: (id: string) => [...titleKeys.detail(id), "crew"] as const,
  reviews: (id: string) => [...titleKeys.detail(id), "reviews"] as const,
  ratings: (id: string) => [...titleKeys.detail(id), "ratings"] as const,
  quickSearch: (query: string) =>
    [...titleKeys.all, "quickSearch", query] as const,
  fullSearch: () => [...titleKeys.all, "search", "full"] as const,
};

export function useTitles(params?: any) {
  return useQuery({
    queryKey: titleKeys.list(JSON.stringify(params)),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/titles", { params });
      return data;
    },
  });
}

export function useTitleDetails(id: string) {
  return useQuery({
    queryKey: titleKeys.detail(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/${id}`);
      return data;
    },
  });
}

export function useTrendingTitles() {
  return useQuery({
    queryKey: titleKeys.trending(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/titles/trending");
      return data;
    },
  });
}

export function useUpcomingTitles() {
  return useQuery({
    queryKey: titleKeys.upcoming(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/titles/upcoming");
      return data;
    },
  });
}

export function useEpisodes(id: string, query?: any) {
  return useQuery({
    queryKey: titleKeys.episodes(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/${id}/episodes`, {
        params: query,
      });
      return data;
    },
  });
}

export function useCast(id: string, query?: any) {
  return useQuery({
    queryKey: titleKeys.cast(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/${id}/cast`, {
        params: query,
      });
      return data;
    },
  });
}

export function useCrew(id: string, query?: any) {
  return useQuery({
    queryKey: titleKeys.crew(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/${id}/crew`, {
        params: query,
      });
      return data;
    },
  });
}

export function useReviews(id: string, query?: any) {
  return useQuery({
    queryKey: titleKeys.reviews(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/${id}/reviews`, {
        params: query,
      });
      return data;
    },
  });
}

export function useRatings(id: string, query?: any) {
  return useQuery({
    queryKey: titleKeys.ratings(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/${id}/ratings`, {
        params: query,
      });
      return data;
    },
  });
}

export function useSearchTitles(query: string) {
  return useQuery({
    queryKey: ["titles", "search", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/titles/search?search=${query}`
      );
      return data;
    },
    enabled: query.length > 0,
  });
}

export function useQuickSearch(query: string) {
  return useQuery({
    queryKey: titleKeys.quickSearch(query),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/search/quick`, {
        params: { query },
      });
      return data;
    },
    enabled: query.length > 0,
    // Add these options to improve the search behavior
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
}

export function useFullSearch(query: any) {
  return useQuery({
    queryKey: titleKeys.fullSearch(),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/titles/search/full`, {
        params: query,
      });
      return data;
    },
    enabled: Object.keys(query).length > 0,
  });
}
