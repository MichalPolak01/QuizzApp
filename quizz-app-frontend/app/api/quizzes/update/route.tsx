"use server"

import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_CREATE_QUIZ_URL = `${DJANGO_API_ENDPOINT}/quizzes/`;


export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const requestData = await request.json();
    const {data, status} = await ApiProxy.put(`${DJANGO_API_CREATE_QUIZ_URL}${id}`, requestData, true);

    return NextResponse.json(data, {status: status});
}