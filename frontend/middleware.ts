import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that should not be forced to login
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/);

  if (isPublic) return NextResponse.next();

  // Check Supabase session
  const supabase = createSupabaseServerClient(() => request.headers.get("cookie") ?? undefined);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};


