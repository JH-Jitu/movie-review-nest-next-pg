"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useUser } from "@/hooks/api/use-user";

export default function ClientUserProvider() {
  //   const setFullUser = useAuthStore((state) => state.setFullUser);
  //   const { data: userProfile, isLoading, isError } = useUser();

  //   useEffect(() => {
  //     if (isError) {
  //       console.warn("Failed to fetch user profile");
  //     } else {
  //       if (userProfile) {
  //         setFullUser(userProfile.data); // Update user state only if profile is available
  //       }
  //     }
  //   }, [userProfile, isError]);

  return null; // Render nothing
}
