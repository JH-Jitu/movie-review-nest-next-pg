import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { UserResponse } from "@/types";
import { UpdatePasswordForm, UpdateUserForm } from "@/types/user-update.types";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export function useUser(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: userKeys.list(JSON.stringify(params)),
    queryFn: async (): Promise<UserResponse> => {
      const { data } = await axiosInstance.get<UserResponse>("/users/me");
      return data;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserForm) => {
      const response = await axiosInstance.put("/users/me", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: UpdatePasswordForm) => {
      const response = await axiosInstance.put("/users/me/password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update password");
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.put("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Avatar updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update avatar");
    },
  });
}

// Add a utility function to handle avatar URLs
export function getAvatarUrl(avatar: string | null): string {
  // if (!avatar) return undefined;

  // If it's a Cloudinary URL, return as is
  if (avatar?.includes("cloudinary.com")) {
    return avatar;
  }

  // // If it's a local file, prepend the API base URL
  // if (avatar?.startsWith("/uploads") || avatar?.startsWith("./uploads")) {
  //   // Remove the leading dot if present
  //   const cleanPath = avatar?.replace(/^\./, "");
  //   return `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
  // }

  // If it's already a full URL, return as is
  if (avatar?.startsWith("http")) {
    return avatar;
  }

  // Default case: assume it's a local path
  return `http://localhost:8001/${avatar}`;
}
