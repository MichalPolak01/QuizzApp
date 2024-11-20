"use server";

import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

const DJANGO_API_SUBMIT_QUIZ_RESULT_URL = "http://127.0.0.1:8000/api/quizzes/";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Quiz ID jest wymagany" }, { status: 400 });
    }

    const requestData = await request.json();
    const { data, status } = await ApiProxy.post(`${DJANGO_API_SUBMIT_QUIZ_RESULT_URL}${id}/submit`, requestData, true);

    return NextResponse.json(data, { status });
}
