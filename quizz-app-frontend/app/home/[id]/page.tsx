"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);

    const router = useRouter();
    const quizId = params.id;

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`/api/quiz/${quizId}`);
                const data = await response.json();
                setQuiz(data);
            } catch (error) {
                console.error('Failed to fetch quiz data:', error);
            }
        };
        fetchQuiz();
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

            if (isCorrect) {
                setScore((prevScore) => prevScore + 1);
            }

            setSelectedOption(null);

            if (currentQuestionIndex + 1 < quiz.questions.length) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            } else {
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

    return (
        <div className="quiz-container">
            <h1 className="text-2xl font-bold">{quiz.name}</h1>
            <p className="text-gray-700">{quiz.description}</p>

            {!showSummary ? (
                <div className="question-section">
                    <h2 className="text-xl mt-4">{currentQuestion.name}</h2>
                    <div className="options-container mt-2">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => handleOptionSelect(option.name)}
                                className={`option-button ${
                                    selectedOption === option.name
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200'
                                } p-2 rounded-lg my-2 w-full text-left`}
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleNextQuestion}
                        className="next-button bg-blue-500 text-white p-2 rounded-lg mt-4"
                        disabled={!selectedOption}
                    >
                        {currentQuestionIndex + 1 === quiz.questions.length
                            ? 'Show Summary'
                            : 'Next Question'}
                    </button>
                </div>
            ) : (
                <div className="summary-section">
                    <h2 className="text-2xl font-bold mt-4">Quiz Summary</h2>
                    <p className="text-lg">Your score: {score} / {quiz.questions.length}</p>
                    <button
                        onClick={handleRestartQuiz}
                        className="restart-button bg-green-500 text-white p-2 rounded-lg mt-4"
                    >
                        Restart Quiz
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="home-button bg-gray-500 text-white p-2 rounded-lg mt-4"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}
