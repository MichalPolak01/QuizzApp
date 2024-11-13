"use server"

import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

const DJANGO_API_CREATE_QUIZ_URL = "http://127.0.0.1:8000/api/quizzes"

export async function POST(request: Request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(DJANGO_API_CREATE_QUIZ_URL, requestData, true);

    return NextResponse.json(data, {status: status});
}