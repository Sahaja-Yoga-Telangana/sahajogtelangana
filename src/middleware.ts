import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CustomUser } from "./app/api/auth/[...nextauth]/options";
import { hasFeatureAccess } from "@/lib/roles";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/volunteer", "/seeker-registration", "/contact-us"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  // Protect all routes starting with /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/login?error=Please login first to access this route",
          request.url
        )
      );
    }
    const user: CustomUser | null = token?.user as CustomUser;
    if (user.role !== "Admin") {
      return NextResponse.redirect(
        new URL(
          "/login?error=You do not have permission to access this route.",
          request.url
        )
      );
    }
  }

  // Protect Yogi/Volunteer routes
  const featureRoutes = ["/add-seeker", "/dashboard"];
  const isFeatureRoute = featureRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isFeatureRoute) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/login?error=Please login first to access this route",
          request.url
        )
      );
    }
    const user: CustomUser | null = token?.user as CustomUser;
    if (!hasFeatureAccess(user.role)) {
      return NextResponse.redirect(
        new URL(
          "/login?error=You need Yogi or Volunteer access to view this page.",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}