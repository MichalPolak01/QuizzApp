"use client"
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import { Pencil, StarIcon, User } from "lucide-react";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import { useAuth } from "@/providers/authProvider";
import { categories } from "@/config/data";
import { Quiz } from "@/config/types";


interface QuizCardProps {
    quiz: Quiz
}

export default function QuizCard({quiz}: QuizCardProps) {
    const category = categories.find((cat) => cat.value === quiz.category);
    const router = useRouter();
    const auth = useAuth();

    const handleCardClick = () => {
        router.push(`/quizzes/${quiz.id}`);
    };

    const handleEditQuiz = () => {
        router.push(`/quizzes/update/${quiz.id}`);
    }

    return (
        <Card className="lg:w-[25rem] w-full hover:scale-105" >
            <Link className="pt-4 text-default-900 flex flex-col h-full cursor-pointer hover:bg-default-100" onClick={handleCardClick}>
                <CardBody className="overflow-visible py-2 flex flex-row">
                    <div className="w-2/5 h-full">
                        <Image
                            isZoomed
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src={category?.image || "https://nextui.org/images/hero-card-complete.jpeg"} 
                        />
                    </div>
                    <div className="px-4 w-3/5 flex flex-col justify-between">
                        <div className="flex flex-col">
                            <h4 className="font-bold text-large">{quiz.name}</h4>
                            <div className="flex flex-row justify-between items-center">
                                <small className="text-default-500">Created by: {quiz.created_by.username}</small>
                                {quiz.created_by.username === auth.username &&
                                    <Button className="hover:scale-110" color="primary" size="sm" onClick={handleEditQuiz}>
                                        <div className="flex items-center text-sm gap-1"><Pencil />Edit</div>
                                    </Button>
                                }
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-1 justify-center items-center">
                                <User />
                                <p className="font-bold text-large">{quiz.user_count}</p>
                            </div>
                            <div className="flex flex-row gap-1 justify-center items-center">
                                <StarIcon />
                                <p className="font-bold text-large">{Math.round(quiz.average_rating *10) /10}/5</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex flex-col gap-4 items-start justify-between h-full">
                    <p className="text-tiny px-2">{quiz.description}</p>
                    <small className="w-full pr-2 text-default-500 text-tiny font-extralight italic text-right">
                        Last updated: {new Date(quiz.last_updated).toLocaleString()}
                    </small>
                </CardFooter>
            </Link>
        </Card>
    )
}