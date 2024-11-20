"use client"

import { useEffect, useState } from "react";

import QuizCard from "./quiz-card"

import { useAuth } from "@/providers/authProvider";
import { Quiz } from "@/config/types";

interface QuizzesRowProps {
    title: string;
    option?: string
}

const OPTION_QUIZZES_URL = "api/quizzes";

export default function QuizzesRow({ title, option }: QuizzesRowProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [error, setError] = useState<string | null>(null);

    const auth = useAuth();

    useEffect(() => {
        const fetchQuizzes = async () => {
            const query = new URLSearchParams({
                limit: "3",
                ...(option && { filter: option })
            });

            const response = await fetch(`${OPTION_QUIZZES_URL}?${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data: Quiz[] = await response.json();

                setQuizzes(data);
            } else if (response.status == 401) {
                auth.loginRequired();
            } else {
                setError("Failed to fetch quizzes!");
            }
        };

        fetchQuizzes();
    }, [option]);

    if (error) return <h1>Error: {error}</h1>;

    return (
        <div className="pt-20" id={option}>
            <h2 className="text-2xl text-primary-500 text-center font-semibold">{title}</h2>
            <div className="flex lg:flex-row flex-col justify-between gap-4 my-4">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
        </div>
    );
}