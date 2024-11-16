"use client"

import { useEffect, useState } from "react";
import { BadgePlus, PencilLine, ScrollText } from "lucide-react";

import { Quiz } from "@/app/home/types";
import { useAuth } from "@/providers/authProvider";
import QuizCard from "@/components/quiz-card";
import OptionCard from "@/components/filter-option-card";


const OPTION_QUIZZES_URL = "api/quizzes";

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
    const [error, setError] = useState<string | null>(null);

    const auth = useAuth();

    useEffect(() => {
        const fetchQuizzesWithFilter = async (filter: string | null) => {
          try {
            const query = filter ? `?filter=${filter}` : "";
            const response = await fetch(`${OPTION_QUIZZES_URL}${query}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (response.ok) {
              return response.json();
            } else if (response.status === 401) {
              auth.loginRequired();

              return null;
            } else {
              throw new Error("Failed to fetch quizzes!");
            }
          } catch {
            setError("Wystąpił problem z pobraniem danych.");

            return null;
          }
        };
      
        const fetchAllData = async () => {
          const [allQuizzes, myQuizzes] = await Promise.all([
            fetchQuizzesWithFilter(null),
            fetchQuizzesWithFilter("my"),
          ]);
      
          if (allQuizzes) setQuizzes(allQuizzes);
          if (myQuizzes) setMyQuizzes(myQuizzes);
        };
      
        fetchAllData();
      }, []);
      

    if (error) return <h1>Error: {error}</h1>;

    return (
        <>
            <div className="flex flex-row flex-wrap justify-center gap-3 py-5 mt-5">
                <OptionCard color="primary" href="quizzes/wizard" icon={BadgePlus} text="Dodaj quiz" />
                <OptionCard color="default-800" href="#my" icon={PencilLine} text="Moje" />
                <OptionCard color="default-800" href="#all" icon={ScrollText} text="Wszystkie" />
            </div>
            <h2 className="text-2xl text-primary-500 text-center font-semibold pt-20 pb-4" id="my">Moje quizy</h2>
            <div className="flex lg:flex-row flex-wrap flex-col justify-center gap-4 my-4">
                { myQuizzes.length === 0 && <p className="italic font-light text-center">Nie masz jeszcze żadnych quizów!</p>}
                {myQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
            <h2 className="text-2xl text-primary-500 text-center font-semibold pt-20 pb-4" id="all">Wszystkie quizy</h2>
            <div className="flex lg:flex-row flex-wrap flex-col justify-center gap-4 my-4">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
        </>
    );
}