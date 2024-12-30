"use client"

import { jwtDecode } from "jwt-decode";

const TOKEN_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";


export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem(TOKEN_NAME);
    }

    return null;
}

export function setToken(authToken: string): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_NAME, authToken);
    }
}

export function getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem(TOKEN_REFRESH_NAME);
    }

    return null;
}

export function setRefreshToken(authRefreshToken: string): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_REFRESH_NAME, authRefreshToken);
    }
}

export function deleteTokens(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(TOKEN_REFRESH_NAME);
    }
}

export function isTokenExpired(token: string): boolean {
    try {
        const decoded: { exp?: number } = jwtDecode(token);

        return decoded.exp ? decoded.exp < Date.now() / 1000 : false;
    } catch {
        return true;
    }
}