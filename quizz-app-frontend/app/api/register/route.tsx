"use server"

import { NextResponse } from "next/server";

import ApiProxy from "../proxy";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_REGISTER_URL = `${DJANGO_API_ENDPOINT}/auth/register`;


export async function POST(request: Request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(DJANGO_API_REGISTER_URL, requestData, false);

    return NextResponse.json(data, {status: status});
}