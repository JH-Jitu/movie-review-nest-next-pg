import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAuthStore } from "@/stores/auth.store";

export function useLogin() {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axiosInstance.post("/auth/signin", credentials);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
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
