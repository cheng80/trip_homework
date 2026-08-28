import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accessTokenCookieName,
  hasAuthSession,
  refreshTokenCookieName,
} from "@/app/api/graphql/auth-session";

export async function requireAuthSession() {
  const cookieStore = await cookies();
  if (!hasAuthSession(
    cookieStore.get(accessTokenCookieName)?.value,
    cookieStore.get(refreshTokenCookieName)?.value,
  )) redirect("/login");
}
