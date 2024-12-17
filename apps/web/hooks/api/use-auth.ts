import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAuthStore } from "@/stores/auth.store";
import { createSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { setUser, setTokens } = useAuthStore();
  const router = useRouter();

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
      router.push("/");
      // new end
      setUser(result.user);
      setTokens(result.accessToken, result.refreshToken);
    },
    onError: (res) => {
      console.log({ "check: ": res });
      return {
        message:
          res?.response?.status === 401
            ? "Invalid Credentials!123"
            : res?.response?.message,
      };
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
