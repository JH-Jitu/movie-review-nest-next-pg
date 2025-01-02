"use client";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { axiosInstance } from "@/config/axios";
import { UserObj } from "@/types";
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/ui/LoadingScreen";
// import { Spinner } from "@/components/ui/Spinner"; // Assume a Spinner component exists for loading

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<UserObj | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressVal, setProgressVal] = useState(0);
  const { setFullUser, logout, accessToken, user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isAuthPage = currentPath.includes("/auth/");

  /**
   * Fetch session and set basic user info.
   */
  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true);
      try {
        const sessionData = await getSessionFunc();
        setSession(sessionData?.user || null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      } finally {
        setLoading(false);
        // setProgressVal(100);
      }
    };

    initializeSession();
  }, []);

  /**
   * Fetch user profile if session or accessToken is present.
   */
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const session = await getSession();

        if (!session?.accessToken && !accessToken) {
          throw new Error("No authentication");
        }

        const { data } = await axiosInstance.get("/users/me");
        return data;
      } catch (error: any) {
        if (error?.response?.status === 401 && !isAuthPage) {
          handleUnauthorized();
        }
        throw error;
      }
    },
    enabled: !!session || !!accessToken,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => console.error("Error fetching user profile:", error),
  });

  /**
   * Update the user in the store when the user profile changes.
   */
  useEffect(() => {
    if (userProfile?.data) {
      setFullUser(userProfile.data);

      setProgressVal(100);
    } else {
      setFullUser(null);
      setUser(null);

      setProgressVal(100);
    }
  }, [userProfile, setFullUser, setUser]);

  /**
   * Cleanup queries on unmount.
   */
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["user-profile"] });
    };
  }, [queryClient]);

  /**
   * Handle unauthorized access.
   */
  const handleUnauthorized = () => {
    logout();
    queryClient.clear();
    window.location.href = `/auth/signin?redirect=${encodeURIComponent(currentPath)}`;
  };

  /**
   * Render loading spinner or children.
   */
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen mx-auto">
        {/* <Spinner />{" "} */}
        <Progress className="h-4 w-64" value={progressVal} />
        {/* Replace with your preferred loading spinner component */}
      </div>
      // <LoadingScreen size={60} />
    );
  }

  return <>{children}</>;
}

/**
 * Fetch the session from the server.
 */
async function getSessionFunc() {
  return await getSession();
}
