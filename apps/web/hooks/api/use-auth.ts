import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAuthStore } from "@/stores/auth.store";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export function useLogin() {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log("coming this...");
      const { data } = await axiosInstance.post("/auth/signin", credentials);
      return data;
    },
    onSuccess: async (result) => {
      // new
      // TODO: Create The Session For Authenticated User.

      await createSession({
        user: {
          id: result.id,
          name: result.name,
          role: result.role,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      redirect("/");
      // new end
      setUser(result.user);
      setTokens(result.accessToken, result.refreshToken);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/signout");
    },
    onSuccess: () => {
      logout();
    },
  });
}
