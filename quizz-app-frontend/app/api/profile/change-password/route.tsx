"use server"

import { NextResponse } from "next/server"

import ApiProxy from "../../proxy";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_CHANGE_PASSWORD_URL = `${DJANGO_API_ENDPOINT}/auth/change-password`;


export async function POST(request: Request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(DJANGO_API_CHANGE_PASSWORD_URL, requestData, true);

    return NextResponse.json(data, {status: status});
}