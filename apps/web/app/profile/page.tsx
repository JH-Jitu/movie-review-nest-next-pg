import { useTitles } from "@/hooks/api/use-titles";
import { getProfile } from "@/lib/actions";

import React from "react";

const ProfilePage = async () => {
  // const { data, isLoading, error } = useTitles({ page: 1, genre: "action" });
  // const res = await getProfile();
  return (
    <div>
      ProfilePage
      {/* <p>{JSON.stringify(res)}</p> */}
    </div>
  );
};

export default ProfilePage;
