import traceback
from ninja_extra import Router
from django.db.models import Avg

from quizz_app.schemas import MessageSchema

from .models import Quiz, Question, Options, UserStats
from .schemas import QuizDetailSchema, QuizDetailResponseSchema, QuizResponseSchema, QuizSubmitSchema, UserStatsRespinseSchema

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
    except User.DoesNotExist:
        return 404, {"message": f"User not found."}
    except Quiz.DoesNotExist:
        return 404, {"message": f"Quiz with id {quiz_id} not found."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}
    

@router.post('/{quiz_id}/submit', response={200: UserStatsRespinseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def submit_quiz(request, payload: QuizSubmitSchema, quiz_id: int):
    try:
        quiz = Quiz.objects.get(id=quiz_id)

        user_stats = UserStats.objects.create(
            user=request.user,
            quiz=quiz,
            quiz_score=payload.quiz_score
        )

        quiz.user_count = UserStats.objects.filter(quiz=quiz).count()
        quiz.average_score = UserStats.objects.filter(quiz=quiz).aggregate(Avg("quiz_score"))['quiz_score__avg'] or 0


        user_rank = UserStats.objects.filter(quiz=quiz, quiz_score__gt=payload.quiz_score).count()
        total_users = quiz.user_count
        percentile = (1 - user_rank / total_users) * 100 if total_users > 0 else 0

        return 200, {"user_stats": user_stats, "percentile": round(percentile, 2)}
    except User.DoesNotExist:
        return 404, {"message": f"User not found."}
    except Quiz.DoesNotExist:
        return 404, {"message": f"Quiz with id {quiz_id} not found."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}
