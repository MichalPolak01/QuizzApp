from ninja import Schema
from typing import List, Optional

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

class QuizDetailSchema(QuizSchema):
    questions: List[QuestionSchema]

class UserStatsSchema(Schema):
    quiz_score: float
    percentile: float

class QuizSubmitSchema(Schema):
    quiz_score: float
