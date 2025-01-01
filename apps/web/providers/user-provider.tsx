"use client";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { useUser } from "@/hooks/api/use-user";
import { axiosInstance } from "@/config/axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setFullUser, logout, accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/users/me");
        return data;
      } catch (error) {
        if (
          error?.response?.status === 401 &&
          !currentPath.includes("/auth/signin")
        ) {
          logout();
          queryClient.clear();
          window.location.href = `/auth/signin?redirect=${encodeURIComponent(currentPath)}`;
        }
        throw error;
      }
    },
    enabled: !!accessToken,
    retry: false,
  });

  useEffect(() => {
    if (userProfile?.data) {
      setFullUser(userProfile.data);
    }
  }, [userProfile, setFullUser]);

  return <>{children}</>;
}
