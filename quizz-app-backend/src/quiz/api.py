import traceback
from ninja_extra import Router

from quizz_app.schemas import MessageSchema

from .models import Quiz, Question, Options
from .schemas import QuizDetailSchema, QuizDetailResponseSchema, QuizResponseSchema

from authentication.models import User

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
    except User.DoesNotExist:
        return 404, {"message": f"User not found."}
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}


@router.get('/{quiz_id}', response={200: QuizDetailResponseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required )
def get_quiz_detail(request, quiz_id: int):
    try:
        quiz = Quiz.objects.get(id=quiz_id, is_removed=False)
        return quiz
    except Quiz.DoesNotExist:
        return 404, {"message": f"Quiz with id {quiz_id} not found."}
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}


@router.get('', response={200: list[QuizResponseSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_quizzes(request):
    try:
        quizzes = Quiz.objects.filter(is_removed=False)
        return quizzes
    except Quiz.DoesNotExist:
        return 404, {"message": f"Quizes not found."}
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}
    

@router.put('/{quiz_id}', response={200: QuizDetailResponseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def update_quiz(request, payload: QuizDetailSchema, quiz_id: int):
    try:
        quiz = Quiz.objects.get(id=quiz_id, created_by=request.user)
        quiz.name = payload.name
        quiz.description = payload.description
        quiz.save()

        quiz.questions.all().delete()

        for question_data in payload.questions:
            question = Question.objects.create(quiz=quiz, name=question_data.name)
            for option_data in question_data.options:
                Options.objects.create(question=question, name=option_data.name, is_correct=option_data.is_correct)

        return 200, quiz
    except Quiz.DoesNotExist:
        return 404, {"message": f"Quiz with id {quiz_id} not found."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}