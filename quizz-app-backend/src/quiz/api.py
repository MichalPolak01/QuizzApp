import json
import traceback
from ninja_extra import Router
from django.db.models import Avg
from openai import OpenAI
from decouple import config
from typing import List, Optional
import helpers

from authentication.models import User
from .models import Quiz, Question, Option, UserStats

from quizz_app.schemas import MessageSchema
from .schemas import OpenAiResponseSchema, QuizDetailSchema, QuizDetailResponseSchema, QuizResponseSchema, QuizSubmitSchema, UserStatsResponseSchema, QuizSchema


router = Router()


@router.post('', response={201: QuizDetailResponseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_quiz(request, payload: QuizDetailSchema):
    try:
        quiz = Quiz.objects.create(
            name=payload.name,
            description=payload.description,
            category=payload.category,
            is_public=payload.is_public,
            created_by=request.user,
        )

        for question_data in payload.questions:
            question = Question.objects.create(quiz=quiz, name=question_data.name)
            for option_data in question_data.options:
                Option.objects.create(question=question, name=option_data.name, is_correct=option_data.is_correct)

        return 201, quiz
    except User.DoesNotExist:
        return 404, {"message": f"User not found."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}


@router.post('/generate', response={201: QuizDetailResponseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_quiz(request, payload: QuizSchema):
    try:
        quiz = Quiz.objects.create(
            name=payload.name,
            description=payload.description,
            category=payload.category,
            is_public=payload.is_public,
            created_by=request.user,
        )

        generated_quiz = generate_quiz(lesson_name=payload.name, lesson_description=payload.description, language="polish")

        for question_data in generated_quiz.questions:
            question = Question.objects.create(quiz=quiz, name=question_data.name)
            for option_data in question_data.options:
                Option.objects.create(
                    question=question,
                    name=option_data.name,
                    is_correct=option_data.is_correct
                )

        return 201, quiz
    except User.DoesNotExist:
        return 404, {"message": f"User not found."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}


@router.get('', response={200: List[QuizResponseSchema], 400: MessageSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_quizzes(request, filter: Optional[str] = None, limit: Optional[int] = None):
    try:
        user = request.user

        if filter == "my":
            quizzes = Quiz.objects.filter(created_by=user, is_removed=False).order_by('-last_updated')
        
        elif filter == "latest":
            quizzes = Quiz.objects.filter(is_removed=False, is_public=True).order_by('-last_updated')
        
        elif filter == "highest-rated":
            quizzes = Quiz.objects.filter(is_removed=False, is_public=True).order_by('-average_rating')
        
        elif filter == "most-popular":
            quizzes = Quiz.objects.filter(is_removed=False, is_public=True).order_by('-user_count')
        
        else:
            if filter is not None:
                return 400, {"message": "Invalid filter option. Choose from 'my', 'latest', 'highest-rated', 'most-popular'."}
            quizzes = Quiz.objects.filter(is_removed=False, is_public=True)

        if limit:
            quizzes = quizzes[:limit]

        return 200, quizzes

    except Quiz.DoesNotExist:
        return 404, {"message": f"Quizzes not found."}
    except Exception as e:
        traceback.print_exc()
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
    

@router.put('/{quiz_id}', response={200: QuizDetailResponseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def update_quiz(request, payload: QuizDetailSchema, quiz_id: int):
    try:
        quiz = Quiz.objects.get(id=quiz_id, created_by=request.user)
        quiz.name = payload.name
        quiz.description = payload.description
        quiz.category = payload.category
        quiz.is_public = payload.is_public
        quiz.save()

        quiz.questions.all().delete()

        for question_data in payload.questions:
            question = Question.objects.create(quiz=quiz, name=question_data.name)
            for option_data in question_data.options:
                Option.objects.create(question=question, name=option_data.name, is_correct=option_data.is_correct)

        return 200, quiz
    except User.DoesNotExist:
        return 404, {"message": f"User not found."}
    except Quiz.DoesNotExist:
        return 404, {"message": f"No quiz with this ID was found for this user."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}
    

@router.post('/{quiz_id}/submit', response={200: UserStatsResponseSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def submit_quiz(request, payload: QuizSubmitSchema, quiz_id: int):
    try:
        quiz = Quiz.objects.get(id=quiz_id)

        user_stats, created = UserStats.objects.get_or_create(
            user=request.user,
            quiz=quiz,
            defaults={"quiz_score": payload.quiz_score, "rating": payload.rating}
        )

        if not created:
            if payload.quiz_score > user_stats.quiz_score:
                user_stats.quiz_score = payload.quiz_score
            user_stats.rating = payload.rating
            user_stats.save()
        else:
            user_stats.quiz_score = payload.quiz_score
            user_stats.rating = payload.rating
            user_stats.save()

        Quiz.update_quiz_statistics(quiz.id)
        quiz.refresh_from_db()

        user_rank = UserStats.objects.filter(quiz=quiz, quiz_score__gt=user_stats.quiz_score).count()
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


def generate_quiz(lesson_name: str, lesson_description: str, language: str = "polish") -> OpenAiResponseSchema:
    try:
        client = OpenAI(api_key=config('OPENAI_API_KEY', cast=str))

        response = client.beta.chat.completions.parse(
            model=config("OPEN_API_MODEL", cast=str),
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are a quiz generator. Respond in a structured JSON format that adheres strictly to the schema provided. "
                        f"Use {language} for all content."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Generate a multiple-choice quiz for a lesson titled '{lesson_name}' described as '{lesson_description}'. "
                        "The quiz should include 5 to 10 multiple-choice questions. "
                        "Each question should have exactly one correct answer and at least two incorrect answers. "
                        "The response must follow the schema provided for validation."
                    )
                }
            ],
            response_format=OpenAiResponseSchema
        )

        parsed_response = response.choices[0].message.parsed
        return parsed_response

    except Exception as e:
        raise Exception(f"Error while generating the quiz: {str(e)}")