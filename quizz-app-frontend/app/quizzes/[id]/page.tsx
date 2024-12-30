"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

import { useAuth } from '@/providers/authProvider';

function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

interface Option {
    name: string;
    is_correct: boolean;
}

interface Question {
    name: string;
    options: Option[];
}

interface Quiz {
    id: number;
    name: string;
    description: string;
    questions: Question[];
}

export default function QuizPage({ params }: { params: { id: string } }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [quizResult, setQuizResult] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [rating, setRating] = useState(3);

    const auth = useAuth();
    const router = useRouter();
    const quizId = params.id;

    useEffect(() => {
        if (quizId) {
            const fetchQuiz = async () => {
                try {
                    const response = await fetch(`/api/quizzes/${quizId}`);

                    if (response.status === 401) {
                        auth.loginRequired();

                        return;
                    }

                    if (response.status === 404) {
                        router.push("/not-found");

                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    const shuffledQuestions = shuffleArray(data.questions);

                    shuffledQuestions.forEach((question: any) => {
                        question.options = shuffleArray(question.options);
                    });

                    setQuiz({
                        ...data,
                        questions: shuffledQuestions,
                    });

                } catch (error) {
                    toast(`Podczas pobierania quizu wystąpił błąd: ${error}. Spróbuj ponownie później!`,
                        {
                            icon: '❌',
                            style: {
                                borderRadius: '16px',
                                textAlign: "center",
                                padding: '16px',
                                background: "#006FEE",
                                color: '#fff',
                            },
                        }
                    );
                    router.push('/home');
                }
            };

            fetchQuiz();
        }
    }, [quizId]);


    if (!quiz) {
        return <p>Loading quiz...</p>;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleNextQuestion = () => {
        if (selectedOption) {
            const isCorrect = currentQuestion.options.find(
                (option) => option.name === selectedOption
            )?.is_correct;

            let updatedScore = score;

            if (isCorrect) {
                updatedScore = score + 1;
                setScore(updatedScore);
            }

            setSelectedOption(null);

            if (currentQuestionIndex + 1 < quiz.questions.length) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            } else {
                const finalResult = Math.round((updatedScore / quiz.questions.length) * 10000) / 100;

                setQuizResult(finalResult);
                setShowSummary(true);
            }
        }
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowSummary(false);
    };

    const handleRating = (index: number) => {
        setRating(index);
    };

    const submitQuizResult = async () => {
        try {
            await fetch(`/api/quizzes/submit?id=${quiz.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quiz_score: score,
                    rating: rating,
                }),
            });
        } catch { }
    };

    const handleButtonClick = async (redirectPath: string | null) => {
        await submitQuizResult();

        if (redirectPath) {
            router.push(redirectPath);
        } else {
            handleRestartQuiz();
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Card className="p-8 w-full">
                <div className='flex flex-row justify-between'>
                    <h1 className="text-2xl text-primary-500 font-bold mb-2">{quiz.name}</h1>
                    <p className="text-xl text-default-900 font-medium mb-2">Pytanie: {currentQuestionIndex + 1}/{quiz.questions.length}</p>
                </div>
                <p className="text-gray-700">{quiz.description}</p>

                {!showSummary ? (
                    <div className="mt-8">
                        <h2 className="text-xl mt-4">{currentQuestion.name}</h2>
                        <div className="options-container mt-2">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.name}
                                    className={`option-button ${selectedOption === option.name
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200'
                                        } p-2 rounded-lg my-2 w-full text-left`}
                                    onClick={() => handleOptionSelect(option.name)}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                        <button
                            className="next-button bg-blue-500 text-white p-2 rounded-lg mt-4"
                            disabled={!selectedOption}
                            onClick={handleNextQuestion}
                        >
                            {currentQuestionIndex + 1 === quiz.questions.length
                                ? 'Pokaż Podsumowanie'
                                : 'Następne Pytanie'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col justify-start pt-20 items-center h-[40svh] ">
                        <h2 className="text-3xl text-primary font-bold my-4">Podsumowanie quizu</h2>
                        <p className="text-lg font-semibold">Udało ci się zdobyć: <span className={` ${quizResult >= 75 ? "text-success" : quizResult >= 50 ? "text-warning" : "text-danger"} font-bold`}>{score}/{quiz.questions.length}</span> punkty</p>
                        <p className="mt-4 text-xl font-semibold">Co daje: <span className={` ${quizResult >= 75 ? "text-success" : quizResult >= 50 ? "text-warning" : "text-danger"} font-bold`}>{quizResult}%</span></p>
                        <div className='flex flex-row gap-4 mt-8'>
                            <Button color="primary" variant="shadow" onClick={() => handleButtonClick(null)}>
                                Powtórz quiz
                            </Button>
                            <Button color="default" variant="shadow" onClick={() => handleButtonClick('/home')}>
                                Powrót do domu
                            </Button>
                        </div>
                        <div className="flex flex-row gap-1 mt-8">
                            {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                    key={index}
                                    className={`w-8 h-8 cursor-pointer ${index < rating ? "text-warning" : "text-default-300"}`}
                                    onClick={() => handleRating(index + 1)}
                                />
                            ))}
                        </div>
                        <p className="mt-2 text-lg font-semibold text-default-500">Twoja ocena kursu: {rating}/5</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
