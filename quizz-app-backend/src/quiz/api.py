from ninja_extra import Router

from .models import Quiz, Question, Options
from .schemas import QuizDetailSchema

import helpers

router = Router()


@router.post('', response={201: QuizDetailSchema}, auth=helpers.auth_required)
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
