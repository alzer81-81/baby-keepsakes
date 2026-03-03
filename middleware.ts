import { NextRequest, NextResponse } from "next/server";

import { verifyBasicAuth } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (verifyBasicAuth(authHeader)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"'
    }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
