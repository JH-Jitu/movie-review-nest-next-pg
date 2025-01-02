import { createSession } from "@/lib/session";
import { useAuthStore } from "@/stores/auth.store";
import { UserObj, UserRole } from "@/types";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { use } from "react";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const role = searchParams.get("role");

  if (!accessToken || !refreshToken || !userId || !name || !role)
    throw new Error("Google Ouath Failed!");
  const userObj = {
    id: userId,
    name: name,
    role: role as UserRole,
  };
  await createSession({
    user: userObj,
    accessToken,
    refreshToken,
  });

  // SetUserProps(userObj);

  redirect("/");
}

function SetUserProps(userObj: UserObj) {
  const { setUser } = useAuthStore();

  setUser(userObj);
}
