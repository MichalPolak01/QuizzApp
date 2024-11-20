import QuizPage from "../../wizard/page";


export default function QuizEditorPage({ params }: { params: { id: string } }) {
    const quizId = parseInt(params.id, 10);

    return <QuizPage quizId={quizId} />;
}