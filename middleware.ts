import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register")
        ) {
          return true;
        }
        //public routes
        if (pathname.startsWith("/") || pathname.startsWith("/api/videos")) {
          return true;
        }

        return !!token;
      },
    },
  }
);


export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"] };