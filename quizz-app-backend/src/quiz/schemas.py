from datetime import datetime
from ninja import Schema
from typing import List, Optional
from typing import Literal
from pydantic import EmailStr, Field, field_validator

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
    category: Literal["programming", "math", "history", "science", "geography", "art", "language", "business", "technology", "other"]
    user_count: Optional[int] = 0
    average_score: Optional[float] = 0.0
    average_rating: Optional[float] = 0.0

    @field_validator("category")
    def validate_category(cls, value):
        return validate_category(value)

class QuizResponseSchema(Schema):
    id: int
    name: str
    description: str
    category: str
    user_count: int
    average_score: float
    average_rating: float = Field(ge=0, le=5)
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

class QuizSubmitSchema(Schema):
    quiz_score: float
    rating: Optional[float] = Field(ge=0, le=5, default=2.5)


# Validators
def validate_category(value):
    allowed_categories = ["programming", "math", "history", "science", "geography", "art", "language", "business", "technology", "other"]

    if value not in allowed_categories:
        raise ValueError(f"Invalid category {value}.")
    
    return value