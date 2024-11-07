"use server"

import { cookies } from "next/headers";

const TOKEN_AGE = 3600;
const TOKEN_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";


export function getToken() {
    return cookies().get(TOKEN_NAME)?.value || null;
}

export function getRefreshToken() {
    return cookies().get(TOKEN_REFRESH_NAME)?.value || null;
}

export async function setToken(authToken: string | null | undefined) {
    return cookies().set({
        name: TOKEN_NAME,
        value: authToken ?? "",
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE
    });
}

export async function setRefreshToken(authRefreshToken: string | null | undefined) {
    return cookies().set({
        name: TOKEN_REFRESH_NAME,
        value: authRefreshToken ?? "",
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE * 7
    });
}

export async function deleteTokens() {
    cookies().delete(TOKEN_NAME);
    cookies().delete(TOKEN_REFRESH_NAME);
}