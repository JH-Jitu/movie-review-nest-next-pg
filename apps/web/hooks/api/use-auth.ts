"use client";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAuthStore } from "@/stores/auth.store";
import { createSession, updateTokens, deleteSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { setUser, setTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axiosInstance.post("/auth/signin", credentials);
      return data;
    },
    onSuccess: async (result) => {
      // Create session for authenticated user
      await createSession({
        user: {
          id: result.id,
          name: result.name,
          role: result.role,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      // Update client state
      setUser(result.user);
      setTokens(result.accessToken, result.refreshToken);

      router.push("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
      return {
        message:
          error?.response?.status === 401
            ? "Invalid Credentials!"
            : error?.response?.statusText,
      };
    },
  });
}

export function useRefreshToken() {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (oldRefreshToken: string) => {
      const { data } = await axiosInstance.post("/auth/refresh", {
        refresh: oldRefreshToken,
      });
      return data;
    },
    onSuccess: async (result) => {
      await updateTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      // Update client state
      setTokens(result.accessToken, result.refreshToken);
    },
    onError: (error) => {
      console.error("Failed to refresh token:", error);
      alert("Session expired. Please sign in again.");
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/signout");
    },
    onSuccess: async () => {
      await deleteSession();
      logout();
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
}
