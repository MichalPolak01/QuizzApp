"use server"
import { NextResponse } from "next/server";

import ApiProxy from "../proxy";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_GET_QUIZZES_URL = `${DJANGO_API_ENDPOINT}/quizzes`;


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const limit = searchParams.get("limit");

    const url = new URL(DJANGO_API_GET_QUIZZES_URL);

    if (limit) {
        url.searchParams.set("limit", limit);
    }
    if (filter) {
        url.searchParams.set("filter", filter);
    }

    const { data, status } = await ApiProxy.get(url.toString(), true);

    return NextResponse.json(data, { status: status });
}