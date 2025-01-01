import { updateTokens } from "@/lib/session";
import { useAuthStore } from "@/stores/auth.store";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const setUser = useAuthStore((state) => state.setUser);

  //   if (!accessToken || !refreshToken)
  //     return new Response("Provide Tokens", { status: 401 });

  setUser(null);

  return new Response("OK", { status: 200 });
}
