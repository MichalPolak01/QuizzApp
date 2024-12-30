"use server"

import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_ACCOUNT_SETTINGS_URL = `${DJANGO_API_ENDPOINT}/auth/user`;


export async function PATCH(request: Request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.patch(DJANGO_API_ACCOUNT_SETTINGS_URL, requestData, true);

    return NextResponse.json(data, {status: status});
}

export async function GET() {
    const {data, status} = await ApiProxy.get(DJANGO_API_ACCOUNT_SETTINGS_URL, true);

    return NextResponse.json(data, {status: status});
}