"use server"
import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_GET_QUIZ_URL = `${DJANGO_API_ENDPOINT}/quizzes/`;


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const {data, status} = await ApiProxy.get(`${DJANGO_API_GET_QUIZ_URL}${id}`, true);

    return NextResponse.json(data, {status: status});
}