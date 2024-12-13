import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";

export const titleKeys = {
  all: ["titles"] as const,
  lists: () => [...titleKeys.all, "list"] as const,
  list: (filters: string) => [...titleKeys.lists(), { filters }] as const,
  details: () => [...titleKeys.all, "detail"] as const,
  detail: (id: string) => [...titleKeys.details(), id] as const,
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
