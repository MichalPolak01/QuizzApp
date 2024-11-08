from datetime import datetime
from ninja import Schema
from typing import List, Optional

from authentication.schemas import UserDetailSchema

class OptionSchema(Schema):
    name: str
    is_correct: bool

class QuestionSchema(Schema):
    name: str
    options: List[OptionSchema]

class QuizSchema(Schema):
    name: str
    description: str
    user_count: Optional[int] = 0
    average_score: Optional[float] = 0.0
    average_rating: Optional[float] = 0.0

class QuizResponseSchema(Schema):
    id: int
    name: str
    description: str
    user_count: int
    average_score: float
    average_rating: float
    created_by: UserDetailSchema
    last_updated: datetime

class QuizDetailSchema(QuizSchema):
    questions: List[QuestionSchema]

class QuizDetailResponseSchema(QuizResponseSchema):
    questions: List[QuestionSchema]

class UserStatsSchema(Schema):
    user: UserDetailSchema
    quiz: QuizResponseSchema
    rating: float

class UserStatsResponseSchema(Schema):
    user_stats: UserStatsSchema
    percentile: float
    rating: Optional[float] = 2.5

class QuizSubmitSchema(Schema):
    quiz_score: float
    rating: Optional[float] = 2.5
