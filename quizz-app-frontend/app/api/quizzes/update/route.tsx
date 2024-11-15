"use server"

import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

const DJANGO_API_CREATE_QUIZ_URL = "http://127.0.0.1:8000/api/quizzes/"

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const requestData = await request.json();
    const {data, status} = await ApiProxy.put(`${DJANGO_API_CREATE_QUIZ_URL}${id}`, requestData, true);

    return NextResponse.json(data, {status: status});
}