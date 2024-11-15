"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/home", "/quizzes"];

const publicRoutes = [ "/register"];

function isTokenExpired(token: string): boolean {
    try {
        const decoded: { exp?: number } = jwtDecode(token);

        return decoded.exp ? decoded.exp < Date.now() / 1000 : true;
    } catch {
        return true;
    }
}

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    const token = cookies().get("auth-token")?.value;
    const isAuthenticated = token && !isTokenExpired(token);

    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.png$).*)",
        "/quizzes/:path*",
    ],
};
