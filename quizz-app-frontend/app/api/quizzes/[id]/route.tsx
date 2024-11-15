"use server"
import { NextResponse } from "next/server";
import ApiProxy from "../../proxy";


// const DJANGO_API_GET_QUIZZES_WITH_OPTION_URL = "http://127.0.0.1:8000/api/quizzes/filter/"
const DJANGO_API_GET_QUIZ_URL = "http://127.0.0.1:8000/api/quizzes/"


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    // const { searchParams } = new URL(request.url);
    // const option = searchParams.get('option');

    const {data, status} = await ApiProxy.get(`${DJANGO_API_GET_QUIZ_URL}${id}`, true);

    return NextResponse.json(data, {status: status});
}