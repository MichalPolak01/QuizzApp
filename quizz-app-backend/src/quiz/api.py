from ninja_extra import Router

from quizz_app.schemas import MessageSchema

from .models import Quiz, Question, Options
from .schemas import QuizDetailSchema, QuizDetailResponseSchema, QuizResponseSchema

import helpers

router = Router()


@router.post('', response={201: QuizDetailResponseSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_quiz(request, payload: QuizDetailSchema):
    try:
        quiz = Quiz.objects.create(
            name=payload.name,
            description=payload.description,
            created_by=request.user
        )

        for question_data in payload.questions:
            question = Question.objects.create(quiz=quiz, name=question_data.name)
            for option_data in question_data.options:
                Options.objects.create(question=question, name=option_data.name, is_correct=option_data.is_correct)

        return 201, quiz
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}


@router.get('/{quiz_id}', response={200: QuizDetailResponseSchema, 404: MessageSchema, 500: MessageSchema} )
def get_quiz_detail(request, quiz_id: int):
    quiz = Quiz.objects.get(id=quiz_id, is_removed=False)
    return quiz


@router.get('', response={200: list[QuizResponseSchema], 500: MessageSchema}, auth=helpers.auth_required)
def get_quizzes(request):
    quizzes = Quiz.objects.filter(is_removed=False)
    return quizzes