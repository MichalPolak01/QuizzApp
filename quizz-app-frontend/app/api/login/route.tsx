"use server"

import { NextResponse } from "next/server"

import ApiProxy from "../proxy";

import { setRefreshToken, setToken } from "@/lib/authServer";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";


const DJANGO_API_LOGIN_URL = `${DJANGO_API_ENDPOINT}/auth/login`;

interface LoginResponse {
    access: string;
    refresh: string;
    role: string;
}

export async function POST(request: Request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(DJANGO_API_LOGIN_URL, requestData, false);

    if (status === 200) {
        const loginData = data as LoginResponse;

        setToken(loginData.access);
        setRefreshToken(loginData.refresh);
    }

    return NextResponse.json(data, {status: status});
}