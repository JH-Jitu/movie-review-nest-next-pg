"use client";
import React from "react";
import { useTitles } from "@/hooks/api/use-titles";
// import { getProfile } from "@/lib/actions";

const ProfilePage = () => {
  const { data, isLoading, error } = useTitles({ page: 1, genre: "action" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message}</div>;
  // const res = await getProfile();
  return (
    <div>
      ProfilePage
      {/* <p>{JSON.stringify(res)}</p> */}
    </div>
  );
};

export default ProfilePage;
